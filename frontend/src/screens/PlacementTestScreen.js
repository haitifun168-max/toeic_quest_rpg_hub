import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  BackHandler
} from 'react-native';

import SecureStore from '../utils/storage';
import { showAlert, showConfirm } from '../utils/alertHelper';

import { BACKEND_URL } from '../config'; // Default API Host

export default function PlacementTestScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [startTime, setStartTime] = useState(null);

  // Fetch placement test questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Prevent going back via hardware back button (Android) and gesture (iOS)
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Không thể quay lại',
        'Bạn đang trong quá trình thực hiện bài kiểm tra đầu vào. Vui lòng hoàn thành để xếp Rank.',
        [{ text: 'Tiếp tục làm bài', style: 'cancel' }]
      );
      return true; // Blocks the back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Disable swipe back gesture on iOS
    navigation?.setOptions({
      gestureEnabled: false,
      headerLeft: () => null,
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Handle countdown timer without drift
  useEffect(() => {
    if (questions.length === 0 || !startTime) return;

    if (timeLeft <= 0) {
      Alert.alert(
        'Hết thời gian',
        'Thời gian làm bài 5 phút đã hết. Hệ thống tự động nộp bài làm của bạn!',
        [{ text: 'Đồng ý', onPress: () => handleSubmit(true) }]
      );
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 300 - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions, startTime]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/placement/questions`);
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Không thể tải đề thi đầu vào');
      }
      setQuestions(result.data.questions);
      setStartTime(Date.now());
    } catch (err) {
      Alert.alert('Thất bại', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: option
    };
    setSelectedAnswers(newAnswers);

    // Auto-submit when user selects an answer on the LAST question
    if (currentIndex === questions.length - 1) {
      // Brief delay so user sees their selection, then auto-submit
      setTimeout(() => executeSubmit(newAnswers), 600);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleQuit = () => {
    showConfirm(
      'Thoát bài kiểm tra?',
      'Bạn có chắc chắn muốn thoát? Kết quả chưa nộp sẽ không được lưu.',
      () => navigation?.goBack()
    );
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    // Confirm before nộp bài if manual
    if (!isAutoSubmit) {
      const answeredCount = Object.keys(selectedAnswers).length;
      if (answeredCount < questions.length) {
        showConfirm(
          'Chưa hoàn thành bài thi',
          `Bạn mới trả lời ${answeredCount}/${questions.length} câu. Bạn có chắc chắn muốn nộp bài ngay bây giờ?`,
          () => executeSubmit()
        );
        return;
      }
    }
    await executeSubmit();
  };

  const executeSubmit = async (answersOverride = null) => {
    setSubmitting(true);
    const finalAnswers = answersOverride || selectedAnswers;
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }

      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        answer: finalAnswers[q.id] || ''
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${BACKEND_URL}/api/placement/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: formattedAnswers }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Nộp bài thi thất bại');
      }

      const cachedProfileStr = await SecureStore.getItemAsync('user_profile');
      if (cachedProfileStr) {
        const cached = JSON.parse(cachedProfileStr);
        cached.current_rank = result.data.rank;
        cached.current_elo = result.data.elo;
        await SecureStore.setItemAsync('user_profile', JSON.stringify(cached));
      }

      navigateToResult(result.data);
    } catch (err) {
      console.log('Placement submit API fallback/error:', err.message);

      // Local fallback calculation when API unavailable
      let correct = 0;
      Object.keys(finalAnswers).forEach(qId => {
        if (finalAnswers[qId]) correct++;
      });
      const rate = correct / Math.max(1, questions.length);
      const simScore = Math.round((rate * 950 + 10) / 5) * 5;
      const rank = Math.min(6, Math.max(1, Math.floor(simScore / 150)));

      navigateToResult({ correctCount: correct, simScore, rank });
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToResult = ({ correctCount, simScore, rank }) => {
    const rankNames = [
      'Không xác định',
      'Thực Tập Sinh',
      'Học Việc',
      'Chiến Binh',
      'Tinh Anh',
      'Huyền Thoại',
      'Thần Thoại'
    ];

    showAlert(
      '🎉 KẾT QUẢ PLACEMENT TEST',
      `Bạn trả lời đúng: ${correctCount}/${questions.length} câu.\nĐiểm ước lượng: ~${simScore} TOEIC.\nXếp hạng khởi điểm: ${rankNames[rank]}!`,
      () => {
        if (navigation) {
          navigation.replace('PlacementResult', { correctCount, simScore, rank });
        }
      }
    );
  };

  // Helper to format remaining time to MM:SS
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang tải đề thi Placement Test...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Không tìm thấy câu hỏi kiểm tra nào.</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.questionIndexText}>Câu {currentIndex + 1}/{questions.length}</Text>
            <Text style={styles.partText}>Part {currentQuestion.part}: Hoàn thành câu</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏳ {formatTime()}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Main Question Body */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q</Text>
          </View>
          <Text style={styles.questionContent}>{currentQuestion.question_content}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {['A', 'B', 'C', 'D'].map((opt) => {
            const isSelected = selectedOption === opt;
            const optionKey = `option_${opt.toLowerCase()}`;
            const optionText = currentQuestion[optionKey];

            return (
              <TouchableOpacity
                key={opt}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelectOption(opt)}
                activeOpacity={0.8}
              >
                <View style={styles.optionRow}>
                  <View style={[styles.optIndexBg, isSelected && styles.optIndexBgSelected]}>
                    <Text style={[styles.optIndexText, isSelected && styles.optIndexTextSelected]}>{opt}</Text>
                  </View>
                  <Text style={[styles.optionTextLabel, isSelected && styles.optionTextLabelSelected]}>{optionText}</Text>
                </View>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Navigation Actions */}
      <View style={styles.footer}>
        <View style={styles.navButtonsRow}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>Quay lại</Text>
          </TouchableOpacity>

          {currentIndex === questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ede0ff" />
              ) : (
                <Text style={styles.submitButtonText}>Nộp bài ⚡</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
            >
              <Text style={styles.navButtonText}>Tiếp theo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#12121d',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#ccc3d8',
    fontSize: 15,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionIndexText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d2bbff',
  },
  partText: {
    fontSize: 12,
    color: '#958da1',
    marginTop: 2,
  },
  timerBadge: {
    backgroundColor: '#1b1a26',
    borderWidth: 1,
    borderColor: 'rgba(210, 187, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    color: '#d2bbff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#1b1a26',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  qBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  qBadgeText: {
    color: '#ede0ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionContent: {
    fontSize: 16,
    color: '#e3e0f1',
    lineHeight: 24,
    fontWeight: '600',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: '#7c3aed',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optIndexBg: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#1b1a26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optIndexBgSelected: {
    backgroundColor: '#7c3aed',
  },
  optIndexText: {
    color: '#958da1',
    fontWeight: '700',
    fontSize: 13,
  },
  optIndexTextSelected: {
    color: '#ede0ff',
  },
  optionTextLabel: {
    color: '#ccc3d8',
    fontSize: 14,
    flex: 1,
  },
  optionTextLabelSelected: {
    color: '#ede0ff',
    fontWeight: '600',
  },
  checkMark: {
    color: '#d2bbff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12121d',
    padding: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  navButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#e3e0f1',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ede0ff',
    fontSize: 14,
    fontWeight: '700',
  },
});

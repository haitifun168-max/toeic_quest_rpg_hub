import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform
} from 'react-native';

import SecureStore from '../utils/storage';
import { showAlert } from '../utils/alertHelper';

import { BACKEND_URL } from '../config'; // Default API Host

export default function GoalSettingScreen({ navigation }) {
  const [step, setStep] = useState(1); // Step 1: Score, Step 2: Duration
  const [targetScore, setTargetScore] = useState(600); // Default selection
  const [durationMonths, setDurationMonths] = useState(3); // Default duration
  const [loading, setLoading] = useState(false);
  const [computedDate, setComputedDate] = useState('');

  // Target score cards data (matches mockup)
  const scoreOptions = [
    { score: 300, cefr: 'A1', desc: 'Cơ bản: Giao tiếp xã giao' },
    { score: 450, cefr: 'A2', desc: 'Tốt nghiệp: Tiêu chuẩn chung' },
    { score: 600, cefr: 'B1', desc: 'B1: Đủ điều kiện làm việc VP', popular: true },
    { score: 750, cefr: 'B2', desc: 'Nâng cao: Tập đoàn đa quốc gia' },
    { score: 850, cefr: 'C1', desc: 'Thành thạo: Quản lý cấp cao' },
    { score: 900, cefr: 'C2', desc: 'Chuyên gia: Bản ngữ hoàn hảo' }
  ];

  // Duration options data
  const durationOptions = [
    { months: 1, desc: 'Cấp tốc: Ôn luyện cường độ cao' },
    { months: 3, desc: 'Tiêu chuẩn: Lộ trình tối ưu' },
    { months: 6, desc: 'Bền bỉ: Vừa làm vừa ôn tập' },
    { months: 12, desc: 'Dài hạn: Nền tảng vững chắc' }
  ];

  // Recalculate target exam date when duration changes
  useEffect(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + durationMonths);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    setComputedDate(`${day}/${month}/${year}`);
  }, [durationMonths]);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      saveGoal();
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigation?.goBack();
    }
  };

  const saveGoal = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Không tìm thấy phiên làm việc. Vui lòng đăng nhập lại.');
      }

      const response = await fetch(`${BACKEND_URL}/api/users/goal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetScore,
          durationMonths
        })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Lưu mục tiêu thất bại');
      }

      // Update cached user profile
      const cachedProfileStr = await SecureStore.getItemAsync('user_profile');
      if (cachedProfileStr) {
        const cached = JSON.parse(cachedProfileStr);
        cached.target_score = targetScore;
        cached.target_deadline = result.data.user.target_deadline;
        await SecureStore.setItemAsync('user_profile', JSON.stringify(cached));
      }

      showAlert(
        'Đã thiết lập mục tiêu',
        `Mục tiêu đạt ${targetScore} TOEIC trong ${durationMonths} tháng đã được lưu!`,
        () => {
          if (navigation) {
            navigation.replace('PlacementTest');
          } else {
            console.log('Navigation trigger: PlacementTest');
          }
        }
      );
    } catch (err) {
      showAlert('Thất bại', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handleBackStep} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Progress Indicators */}
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={[styles.indicator, step === 2 && styles.activeIndicator]} />
          </View>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.stepTitle}>Bước {step}/2</Text>
        <Text style={styles.title}>
          {step === 1 ? 'Bạn muốn đạt bao nhiêu điểm TOEIC?' : 'Bạn muốn đạt mục tiêu này trong bao lâu?'}
        </Text>
      </View>

      {/* Main Options */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <View style={styles.grid}>
            {scoreOptions.map((item) => {
              const isSelected = targetScore === item.score;
              return (
                <TouchableOpacity
                  key={item.score}
                  style={[styles.scoreCard, isSelected && styles.scoreCardSelected]}
                  onPress={() => setTargetScore(item.score)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.scoreNumber, isSelected && styles.selectedText]}>
                      {item.score === 900 ? '900+' : item.score}
                    </Text>
                    <Text style={[styles.scoreCefr, isSelected && styles.selectedMutedText]}>
                      {item.cefr}
                    </Text>
                  </View>
                  <Text style={[styles.scoreDesc, isSelected && styles.selectedMutedText]}>
                    {item.desc}
                  </Text>
                  {item.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>PHỔ BIẾN</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.list}>
            {durationOptions.map((item) => {
              const isSelected = durationMonths === item.months;
              return (
                <TouchableOpacity
                  key={item.months}
                  style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                  onPress={() => setDurationMonths(item.months)}
                  activeOpacity={0.8}
                >
                  <View style={styles.durationHeader}>
                    <Text style={[styles.durationTitle, isSelected && styles.selectedText]}>
                      {item.months} tháng
                    </Text>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text style={[styles.durationDesc, isSelected && styles.selectedMutedText]}>
                    {item.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Context Deadline Info */}
            <View style={styles.deadlineInfoCard}>
              <Text style={styles.deadlineLabel}>NGÀY THI DỰ KIẾN</Text>
              <Text style={styles.deadlineValue}>{computedDate}</Text>
            </View>
          </View>
        )}

        {/* Tip Box */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Lựa chọn mục tiêu giúp chúng tôi tối ưu hóa lộ trình học và thiết lập bài kiểm tra thích hợp cho riêng bạn.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleNextStep} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#3f008e" />
          ) : (
            <Text style={styles.submitButtonText}>
              {step === 1 ? 'Tiếp theo' : 'Hoàn tất mục tiêu'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    color: '#e3e0f1',
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#343440',
  },
  activeIndicator: {
    backgroundColor: '#d2bbff',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d2bbff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e3e0f1',
    lineHeight: 28,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  scoreCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  scoreCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e3e0f1',
  },
  scoreCefr: {
    fontSize: 12,
    color: '#958da1',
    fontWeight: '600',
  },
  scoreDesc: {
    fontSize: 12,
    color: '#ccc3d8',
    lineHeight: 16,
  },
  popularBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ede0ff',
  },
  selectedText: {
    color: '#ede0ff',
  },
  selectedMutedText: {
    color: '#ede0ff',
    opacity: 0.9,
  },
  list: {
    gap: 16,
  },
  durationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
  },
  durationCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: '#7c3aed',
  },
  durationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e3e0f1',
  },
  durationDesc: {
    fontSize: 13,
    color: '#ccc3d8',
  },
  checkIcon: {
    fontSize: 16,
    color: '#d2bbff',
    fontWeight: 'bold',
  },
  deadlineInfoCard: {
    backgroundColor: '#1b1a26',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(210, 187, 255, 0.2)',
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  deadlineLabel: {
    fontSize: 11,
    color: '#d2bbff',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  deadlineValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4edea3',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(210, 187, 255, 0.3)',
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#ccc3d8',
    lineHeight: 18,
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
  submitButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ede0ff',
  },
});

/**
 * PvpBattleScreen.js
 * Màn hình thi đấu PvP 10 câu hỏi TOEIC áp lực cao thời gian thực.
 * Hiển thị thanh HP/score song song của 2 người chơi và 20s đếm ngược cho mỗi câu.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';

import SecureStore from '../utils/storage';
import { showAlert, showConfirm } from '../utils/alertHelper';

import { BACKEND_URL } from '../config';

const MOCK_QUESTIONS = [
  {
    id: 'pq-1',
    question_content: 'Before _______ the office, employees must double check if all computers are shut down.',
    option_a: 'leave',
    option_b: 'leaving',
    option_c: 'left',
    option_d: 'to leave',
    correct_option: 'B',
    explanation: 'Giải thích: Sử dụng V-ing sau giới từ thời gian Before khi hai mệnh đề cùng chủ ngữ.'
  },
  {
    id: 'pq-2',
    question_content: 'The manager decided to _______ the training seminar until next Monday.',
    option_a: 'postpone',
    option_b: 'postponed',
    option_c: 'postponing',
    option_d: 'postpones',
    correct_option: 'A',
    explanation: 'Giải thích: Cấu trúc to + V-inf chỉ mục đích hoặc sau động từ decide.'
  }
];

export default function PvpBattleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomId, isBotMatch, players, existingSocket } = route.params || {
    roomId: 'mock_room',
    isBotMatch: true,
    players: {
      playerA: { id: 'pA', elo: 1100 },
      playerB: { id: 'pB', display_name: 'Phù Thủy Từ Vựng (BOT)', avatar_id: 'mage', elo: 1080, isBot: true }
    }
  };

  // State controls
  const [isPreMatch, setIsPreMatch] = useState(true);
  const [preMatchSeconds, setPreMatchSeconds] = useState(5);
  
  const [roundIndex, setRoundIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [opponentAnsweredState, setOpponentAnsweredState] = useState(false);

  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const [timerSeconds, setTimerSeconds] = useState(20);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [correctOption, setCorrectOption] = useState('');
  const [roundExplanation, setRoundExplanation] = useState('');

  const socketRef = useRef(null);
  const roundTimerRef = useRef(null);
  const preMatchTimerRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());
  const userIdRef = useRef('');

  useEffect(() => {
    // 1. Khởi chạy 5 giây Pre-match
    preMatchTimerRef.current = setInterval(() => {
      setPreMatchSeconds(prev => {
        if (prev <= 1) {
          clearInterval(preMatchTimerRef.current);
          setIsPreMatch(false);
          // Bắt đầu game thực tế
          initializeGameFlow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Kết nối WebSocket đồng bộ
    connectToBattleSocket();

    return () => {
      if (preMatchTimerRef.current) clearInterval(preMatchTimerRef.current);
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectToBattleSocket = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const cachedProfileStr = await SecureStore.getItemAsync('user_profile');
      let currentUserId = '';
      if (cachedProfileStr) {
        currentUserId = JSON.parse(cachedProfileStr).id;
        userIdRef.current = currentUserId;
      }

      const socket = existingSocket || io(BACKEND_URL, {
        transports: ['polling', 'websocket'],
        forceNew: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[Battle] Socket connected to room', roomId);
        setTimeout(() => {
          socket.emit('joinMatchmaking', { token, roomId });
        }, 800);
      });

      if (existingSocket?.connected) {
        setTimeout(() => {
          socket.emit('joinMatchmaking', { token, roomId });
        }, 800);
      }

      socket.on('newQuestion', (data) => {
        // Reset states for a new question round
        setShowRoundResult(false);
        setSelectedOption(null);
        setAnswered(false);
        setOpponentAnsweredState(false);
        setTimerSeconds(20);
        setRoundIndex(data.roundIndex);
        setCurrentQuestion(data.question);
        questionStartTimeRef.current = Date.now();

        // Restart timer countdown
        if (roundTimerRef.current) clearInterval(roundTimerRef.current);
        roundTimerRef.current = setInterval(() => {
          setTimerSeconds(t => {
            if (t <= 1) {
              clearInterval(roundTimerRef.current);
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      });

      socket.on('opponentAnswered', () => {
        setOpponentAnsweredState(true);
      });

      socket.on('roundResult', (data) => {
        // Show correct option and details
        setCorrectOption(data.correctOption);
        setRoundExplanation(data.explanationLayer1);
        setShowRoundResult(true);

        // Update scores
        const isPlayerA = players.playerA.id === userIdRef.current;
        const myResult = isPlayerA ? data.playerAResult : data.playerBResult;
        const oppResult = isPlayerA ? data.playerBResult : data.playerAResult;

        if (myResult.isCorrect) setScore(s => s + 1);
        if (oppResult.isCorrect) setOpponentScore(o => o + 1);
      });

      socket.on('battleFinished', (data) => {
        if (roundTimerRef.current) clearInterval(roundTimerRef.current);
        socket.disconnect();

        // Navigate to final result page
        navigation.navigate('PvpResult', {
          resultData: data,
          isWinner: data.winnerId === userIdRef.current
        });
      });

    } catch (e) {
      console.log('Battle socket setup error:', e.message);
    }
  };

  const initializeGameFlow = () => {
    // If socket failed to load (offline), trigger client side simulation
    if (!socketRef.current || !socketRef.current.connected) {
      console.log('Utilizing local battle offline simulation');
      setQuestions(MOCK_QUESTIONS);
      loadMockQuestionRound(0);
    }
  };

  const loadMockQuestionRound = (idx) => {
    if (idx >= MOCK_QUESTIONS.length) {
      // Offline battle end simulation
      navigation.navigate('PvpResult', {
        resultData: {
          winnerId: 'offline_player',
          scores: { playerA: score, playerB: opponentScore || 1 },
          eloChanges: { playerA: 28, playerB: -10 },
          kpRewards: { playerA: 300, playerB: 50 },
          finalStats: {
            playerA: { current_elo: (players.playerA.elo || 1000) + 28, total_kp: 1500, current_stamina: 13 },
            playerB: { current_elo: (players.playerB.elo || 1000) - 10, total_kp: 800, current_stamina: 13 }
          }
        },
        isWinner: true
      });
      return;
    }

    const question = MOCK_QUESTIONS[idx];
    setRoundIndex(idx);
    setCurrentQuestion(question);
    setSelectedOption(null);
    setAnswered(false);
    setOpponentAnsweredState(false);
    setShowRoundResult(false);
    setTimerSeconds(20);
    questionStartTimeRef.current = Date.now();

    // Start 20s round timer
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    roundTimerRef.current = setInterval(() => {
      setTimerSeconds(t => {
        if (t <= 1) {
          clearInterval(roundTimerRef.current);
          revealMockRoundResult(question, null, idx);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Simulate BOT answer after 4 seconds
    setTimeout(() => {
      setOpponentAnsweredState(true);
    }, 4000);
  };

  const revealMockRoundResult = (question, myChoice, idx) => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);

    setCorrectOption(question.correct_option);
    setRoundExplanation(question.explanation);
    setShowRoundResult(true);

    const botIsCorrect = Math.random() < 0.7; // BOT correct rate 70%
    if (myChoice === question.correct_option) setScore(s => s + 1);
    if (botIsCorrect) setOpponentScore(o => o + 1);

    // Go to next question after 3.5s
    setTimeout(() => {
      loadMockQuestionRound(idx + 1);
    }, 3500);
  };

  const handleSelectOption = (option) => {
    if (answered || showRoundResult) return;

    setSelectedOption(option);
    setAnswered(true);

    const timeSpentMs = Date.now() - questionStartTimeRef.current;

    // Send answer to server
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('submitAnswer', {
        roomId,
        selectedOption: option,
        timeSpentMs
      });
    } else {
      // Offline mock round resolution
      revealMockRoundResult(currentQuestion, option, roundIndex);
    }
  };

  const getOptionStyle = (option) => {
    const isSelected = selectedOption === option;

    if (showRoundResult) {
      const isCorrect = option === correctOption;
      if (isCorrect) {
        return [styles.optionCard, styles.optionCorrect];
      }
      if (isSelected && !isCorrect) {
        return [styles.optionCard, styles.optionWrong];
      }
    }

    if (isSelected) {
      return [styles.optionCard, styles.optionSelected];
    }

    return styles.optionCard;
  };

  const getOptionTextStyle = (option) => {
    const isSelected = selectedOption === option;
    if (showRoundResult) {
      if (option === correctOption) return styles.optionTextCorrect;
      if (isSelected) return styles.optionTextWrong;
    }
    if (isSelected) return styles.optionTextSelected;
    return styles.optionText;
  };

  const handleQuitPrompt = () => {
    showConfirm(
      'Rời trận đấu?',
      'Thoát giữa chừng sẽ tính là Thua Cuộc và trừ ELO xếp hạng của bạn. Bạn vẫn muốn thoát?',
      () => {
        if (socketRef.current) socketRef.current.disconnect();
        navigation.navigate('PvpLobby');
      }
    );
  };

  if (isPreMatch) {
    return (
      <SafeAreaView style={styles.preMatchContainer}>
        <Text style={styles.vsIcon}>⚔️</Text>
        <Text style={styles.preMatchTitle}>CHUẨN BỊ CHIẾN ĐẤU</Text>
        
        <View style={styles.vsGrid}>
          <View style={styles.matchPlayer}>
            <Text style={styles.playerAvatar}>👤</Text>
            <Text style={styles.playerName}>{players.playerA.display_name || 'Bạn'}</Text>
            <Text style={styles.playerElo}>{players.playerA.elo} ELO</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.matchPlayer}>
            <Text style={styles.playerAvatar}>🤖</Text>
            <Text style={styles.playerName}>{players.playerB.display_name || 'Đối thủ'}</Text>
            <Text style={styles.playerElo}>{players.playerB.elo} ELO</Text>
          </View>
        </View>

        <Text style={styles.preMatchTimer}>{preMatchSeconds}</Text>
        <Text style={styles.preMatchSub}>Trận đấu gồm 10 câu hỏi trắc nghiệm tiếng Anh</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Status Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.quitBtn} onPress={handleQuitPrompt}>
          <Text style={styles.quitText}>🏳️ Đầu hàng</Text>
        </TouchableOpacity>
        
        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{score}</Text>
            <Text style={styles.scoreLbl}>Bạn</Text>
          </View>
          <Text style={styles.scoreColon}>:</Text>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{opponentScore}</Text>
            <Text style={styles.scoreLbl}>Đối thủ</Text>
          </View>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>{timerSeconds}s</Text>
        </View>
      </View>

      {/* Progress Bar (Round index) */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${((roundIndex + 1) / 10) * 100}%` }]} />
      </View>

      {/* Main Question Display */}
      {currentQuestion && (
        <View style={styles.questionPanel}>
          <View style={styles.roundInfoRow}>
            <Text style={styles.roundLabel}>CÂU HỎI {roundIndex + 1}/10</Text>
            <Text style={styles.partLabel}>Part {currentQuestion.part}</Text>
          </View>

          <Text style={styles.questionText}>{currentQuestion.question_content}</Text>

          {/* Option list */}
          <View style={styles.optionsList}>
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optionKey = `option_${opt.toLowerCase()}`;
              return (
                <TouchableOpacity
                  key={opt}
                  style={getOptionStyle(opt)}
                  disabled={answered || showRoundResult}
                  onPress={() => handleSelectOption(opt)}
                >
                  <Text style={getOptionTextStyle(opt)}>
                    {opt}. {currentQuestion[optionKey]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Opponent Answered indicator */}
          {opponentAnsweredState && !showRoundResult && (
            <View style={styles.oppStateBadge}>
              <Text style={styles.oppStateText}>⚡ Đối thủ đã trả lời xong!</Text>
            </View>
          )}

          {/* Round explanation details */}
          {showRoundResult && (
            <View style={styles.explainPanel}>
              <Text style={styles.explainHeader}>📚 GIẢI THÍCH NHANH</Text>
              <Text style={styles.explainText}>{roundExplanation}</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  preMatchContainer: {
    flex: 1,
    backgroundColor: '#12121d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  vsIcon: {
    fontSize: 54,
  },
  preMatchTitle: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  vsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 32,
  },
  matchPlayer: {
    alignItems: 'center',
    gap: 8,
    width: '40%',
  },
  playerAvatar: {
    fontSize: 48,
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  playerElo: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  vsText: {
    color: '#fb923c',
    fontSize: 24,
    fontWeight: '950',
    fontStyle: 'italic',
  },
  preMatchTimer: {
    fontSize: 64,
    fontWeight: '950',
    color: '#fff',
    textShadowColor: 'rgba(124,58,237,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  preMatchSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  quitBtn: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  quitText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreVal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  scoreLbl: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '600',
  },
  scoreColon: {
    color: '#ccc3d8',
    fontSize: 18,
    fontWeight: '800',
  },
  timerBadge: {
    backgroundColor: 'rgba(251,146,60,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  timerText: {
    color: '#fb923c',
    fontSize: 12,
    fontWeight: '900',
  },
  progressBarBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
  },
  questionPanel: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  roundInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundLabel: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  partLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  questionText: {
    color: '#f8fafc',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginVertical: 8,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: '#7c3aed',
  },
  optionCorrect: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderColor: '#4ade80',
  },
  optionWrong: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderColor: '#f87171',
  },
  optionText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#c084fc',
    fontSize: 13,
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: '#4ade80',
    fontSize: 13,
    fontWeight: '800',
  },
  optionTextWrong: {
    color: '#f87171',
    fontSize: 13,
    fontWeight: '800',
  },
  oppStateBadge: {
    backgroundColor: 'rgba(56,189,248,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  oppStateText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  explainPanel: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  explainHeader: {
    color: '#a78bfa',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  explainText: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
});

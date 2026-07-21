/**
 * DungeonSelectionScreen.js
 * Màn hình chọn Dungeon thi thử (Mini/Full Mock Test).
 * Kiểm tra và tự động khôi phục bài thi cũ hoặc cảnh báo trước khi vào thi.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import SecureStore from '../utils/storage';

import { BACKEND_URL } from '../config';

export default function DungeonSelectionScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  
  // Modal states
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (isFocused) {
      checkActiveSession();
    }
  }, [isFocused]);

  const checkActiveSession = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) throw new Error('Hết hạn đăng nhập');

      const response = await fetch(`${BACKEND_URL}/api/dungeons/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();
      if (response.ok && result.ok && result.data.sessionActive) {
        setActiveSession(result.data);
      } else {
        setActiveSession(null);
      }
    } catch (err) {
      console.log('Dungeon checkActiveSession error fallback:', err.message);
      setActiveSession(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDungeon = (type) => {
    setSelectedType(type);
    setShowWarningModal(true);
  };

  const handleStartExam = async () => {
    setShowWarningModal(false);
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      let startSuccess = false;

      if (token) {
        const response = await fetch(`${BACKEND_URL}/api/dungeons/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ dungeonType: selectedType })
        });

        const result = await response.json();
        if (response.ok && result.ok) {
          startSuccess = true;
          navigation.navigate('DungeonExam', {
            dungeonSessionId: result.data.dungeonSessionId,
            dungeonType: result.data.dungeonType,
            questions: result.data.questions,
            initialDrafts: []
          });
        }
      }

      if (!startSuccess) {
        console.log('Utilizing local offline simulated dungeon exam questions');
        const limit = selectedType === 'mini' ? 100 : 200;
        const mockQuestions = Array.from({ length: limit }).map((_, idx) => ({
          id: `dq-mock-${idx}`,
          part: idx < limit / 2 ? 5 : 6,
          question_content: `Dungeon Exam Question ${idx + 1}: The committee approved the proposal _______ some minor edits.`,
          option_a: 'with',
          option_b: 'by',
          option_c: 'from',
          option_d: 'at'
        }));
        navigation.navigate('DungeonExam', {
          dungeonSessionId: `mock-session-${Date.now()}`,
          dungeonType: selectedType,
          questions: mockQuestions,
          initialDrafts: []
        });
      }
    } catch (err) {
      console.log('Start exam error fallback:', err.message);
      const limit = selectedType === 'mini' ? 100 : 200;
      const mockQuestions = Array.from({ length: limit }).map((_, idx) => ({
        id: `dq-mock-${idx}`,
        part: idx < limit / 2 ? 5 : 6,
        question_content: `Dungeon Exam Question ${idx + 1}: The committee approved the proposal _______ some minor edits.`,
        option_a: 'with',
        option_b: 'by',
        option_c: 'from',
        option_d: 'at'
      }));
      navigation.navigate('DungeonExam', {
        dungeonSessionId: `mock-session-${Date.now()}`,
        dungeonType: selectedType,
        questions: mockQuestions,
        initialDrafts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = () => {
    if (!activeSession) return;
    navigation.navigate('DungeonExam', {
      dungeonSessionId: activeSession.dungeonSessionId,
      dungeonType: activeSession.dungeonType,
      questions: activeSession.questions,
      initialDrafts: activeSession.drafts
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang chuẩn bị sảnh Dungeon...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.backBtnText}>◀ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TOEIC DUNGEONS</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionHeader}>🏰 CHỌN ẢI THI THỬ TOEIC</Text>
        <Text style={styles.sectionSub}>Chọn ải phù hợp để quy đổi Estimated TOEIC score thực tế của bạn</Text>

        {/* Resume Active Session Card */}
        {activeSession && (
          <View style={styles.activeSessionCard}>
            <Text style={styles.activeSessionTitle}>⚠️ BÀI THI CHƯA HOÀN THÀNH</Text>
            <Text style={styles.activeSessionSub}>
              Bạn có phiên thi {activeSession.dungeonType === 'mini' ? 'Mini Mock Test' : 'Full Mock Test'} đang làm dở.
            </Text>
            <TouchableOpacity style={styles.resumeBtn} onPress={handleResumeSession}>
              <Text style={styles.resumeBtnText}>TIẾP TỤC LÀM BÀI ➡️</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.grid}>
          {/* Option 1: Mini Mock Test */}
          <TouchableOpacity style={styles.dungeonCard} onPress={() => handleSelectDungeon('mini')}>
            <Text style={styles.dungeonIcon}>🏰</Text>
            <Text style={styles.dungeonName}>Mini Mock Test</Text>
            <Text style={styles.dungeonDesc}>100 câu hỏi rút gọn (Listening + Reading)</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Thời gian: </Text>
              <Text style={styles.statVal}>60 phút</Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Full Mock Test */}
          <TouchableOpacity style={styles.dungeonCard} onPress={() => handleSelectDungeon('full')}>
            <Text style={styles.dungeonIcon}>🏛️</Text>
            <Text style={styles.dungeonName}>Full Mock Test</Text>
            <Text style={styles.dungeonDesc}>200 câu hỏi chuẩn format TOEIC quốc tế</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Thời gian: </Text>
              <Text style={styles.statVal}>120 phút</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Warning Entry Modal */}
      <Modal
        visible={showWarningModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>CẢNH BÁO PHÒNG THI</Text>
            <Text style={styles.modalText}>
              Bài thi thử {selectedType === 'mini' ? 'Mini (60 phút)' : 'Full (120 phút)'} yêu cầu sự tập trung cao độ. 
              Bạn không thể thoát ngang trong quá trình làm bài. Bạn có chắc chắn muốn bắt đầu thi ngay bây giờ?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowWarningModal(false)}>
                <Text style={styles.modalCancelText}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleStartExam}>
                <Text style={styles.modalConfirmText}>BẮT ĐẦU THI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ccc3d8',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#a78bfa',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  activeSessionCard: {
    backgroundColor: 'rgba(234,179,8,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.25)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 8,
  },
  activeSessionTitle: {
    fontSize: 13,
    fontWeight: '850',
    color: '#facc15',
  },
  activeSessionSub: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  resumeBtn: {
    backgroundColor: '#eab308',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resumeBtnText: {
    color: '#12121d',
    fontSize: 12,
    fontWeight: '900',
  },
  grid: {
    gap: 16,
  },
  dungeonCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  dungeonIcon: {
    fontSize: 36,
  },
  dungeonName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  dungeonDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 12,
    color: '#fb923c',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    maxWidth: 400,
  },
  modalIcon: {
    fontSize: 48,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '950',
    color: '#f87171',
    letterSpacing: 0.5,
  },
  modalText: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
});

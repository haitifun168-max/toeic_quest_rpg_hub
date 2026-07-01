/**
 * SessionSummaryScreen.js
 * Story 2-4: Tổng kết phiên học (Session Summary)
 *
 * Màn hình tổng kết kết quả học tập sau mỗi Quest.
 * Hiển thị điểm số, tỷ lệ đúng/sai, KP thưởng, và 3 chủ điểm yếu từ AI Mentor.
 * Thiết kế Glassmorphism tối cao cấp HSL với hiệu ứng thăng hạng ấn tượng.
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SessionSummaryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Safe extraction of params with fallbacks for direct navigations or mock tests
  const { score, recommendations, streak, rankUp } = route.params || {
    score: { totalQuestions: 10, correct: 8, wrong: 2, kpEarned: 210 },
    recommendations: [
      'Mệnh đề trạng ngữ chỉ thời gian (Gerund after prepositions)',
      'Trạng từ chỉ mức độ và cách thức (Adverbs of degree/manner)',
      'Giới từ và Mạo từ trong tiếng Anh (Prepositions & Articles)'
    ],
    streak: { currentStreak: 6, longestStreak: 12, wasIncremented: true },
    rankUp: false
  };

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReturnHome = () => {
    navigation.navigate('HomeDashboard');
  };

  const correctRate = score.totalQuestions > 0 
    ? Math.round((score.correct / score.totalQuestions) * 100) 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Animated Trophy Header */}
        <Animated.View style={[styles.headerSection, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.headerTitle}>HOÀN THÀNH NHIỆM VỤ!</Text>
          <Text style={styles.headerSubtitle}>Bạn đã kết thúc xuất sắc phiên học hôm nay</Text>
        </Animated.View>

        {/* Score Overview Glassmorphism Panel */}
        <Animated.View style={[styles.glassPanel, { opacity: fadeAnim }]}>
          <Text style={styles.panelTitle}>📊 TỔNG QUAN PHIÊN HỌC</Text>
          <View style={styles.divider} />
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{correctRate}%</Text>
              <Text style={styles.statLbl}>Tỷ lệ đúng</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#4ade80' }]}>{score.correct}</Text>
              <Text style={styles.statLbl}>Đúng</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#f87171' }]}>{score.wrong}</Text>
              <Text style={styles.statLbl}>Sai</Text>
            </View>
          </View>

          <View style={styles.kpRewardSection}>
            <Text style={styles.kpRewardTitle}>KP TÍCH LŨY</Text>
            <Text style={styles.kpRewardVal}>+{score.kpEarned} KP</Text>
          </View>
        </Animated.View>

        {/* Streak Celebration Badge */}
        {streak && (
          <Animated.View style={[styles.streakBadge, { opacity: fadeAnim }]}>
            <View style={styles.streakInfo}>
              <Text style={styles.fireIcon}>🔥</Text>
              <View>
                <Text style={styles.streakTitle}>Học liên tục {streak.currentStreak} ngày!</Text>
                <Text style={styles.streakSub}>Kỷ lục dài nhất của bạn: {streak.longestStreak} ngày</Text>
              </View>
            </View>
            {streak.wasIncremented && (
              <View style={styles.plusOneBadge}>
                <Text style={styles.plusOneText}>+1</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Rank Up Celebration */}
        {rankUp && (
          <Animated.View style={[styles.rankUpBadge, { opacity: fadeAnim }]}>
            <Text style={styles.rankUpIcon}>⭐</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rankUpTitle}>LÊN HẠNG NHÂN VẬT!</Text>
              <Text style={styles.rankUpSub}>Chúc mừng bạn đã đạt cấp bậc mới cao quý hơn!</Text>
            </View>
          </Animated.View>
        )}

        {/* AI Mentor Insights Box */}
        <Animated.View style={[styles.mentorPanel, { opacity: fadeAnim }]}>
          <View style={styles.mentorHeader}>
            <Text style={styles.mentorAvatar}>🧠</Text>
            <View>
              <Text style={styles.mentorName}>AI MENTOR KHUYÊN BẠN</Text>
              <Text style={styles.mentorSubtitle}>Phân tích từ lỗi sai trong bài làm</Text>
            </View>
          </View>
          
          <View style={styles.recommendationsList}>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationNumber}>{index + 1}</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Button */}
        <TouchableOpacity style={styles.homeBtn} onPress={handleReturnHome} testID="return-dashboard-button">
          <Text style={styles.homeBtnText}>Quay về Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 16,
    paddingBottom: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  trophyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#d2bbff',
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  statLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  kpRewardSection: {
    marginTop: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  kpRewardTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.8,
  },
  kpRewardVal: {
    fontSize: 20,
    fontWeight: '950',
    color: '#c084fc',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(251, 146, 60, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fireIcon: {
    fontSize: 24,
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  streakSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  plusOneBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fb923c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusOneText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  rankUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  rankUpIcon: {
    fontSize: 24,
  },
  rankUpTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#facc15',
  },
  rankUpSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  mentorPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  mentorAvatar: {
    fontSize: 28,
  },
  mentorName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  mentorSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  recommendationsList: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
  },
  recommendationNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    color: '#a78bfa',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 18,
  },
  recommendationText: {
    flex: 1,
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    fontWeight: '500',
  },
  homeBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});

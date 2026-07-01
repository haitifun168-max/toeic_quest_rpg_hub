/**
 * DungeonResultScreen.js
 * Màn hình kết quả thi thử Dungeon: Điểm quy đổi Estimated TOEIC score, radar năng lực và khuyên ôn tập AI Mentor.
 * Phong cách HSL cao cấp.
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock SVG Poly for Radar chart rendering if SVG is disabled
let Svg, Polygon, Circle;
let hasSvgSupport = true;
try {
  const SvgLib = require('react-native-svg');
  Svg = SvgLib.default;
  Polygon = SvgLib.Polygon;
  Circle = SvgLib.Circle;
} catch (e) {
  hasSvgSupport = false;
}

export default function DungeonResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { scoreData } = route.params || {
    scoreData: {
      estimatedScore: 785,
      correctCount: 80,
      totalAnswered: 100,
      totalQuestions: 100,
      kpEarned: 1000,
      recommendations: [
        'Phân tích cấu trúc câu điều kiện rút gọn (Conditional structure reductions)',
        'Phân biệt giới từ chỉ thời gian và không gian (Prepositions of time vs place)',
        'Cấu trúc Danh động từ đứng sau giới từ (Gerund following prep phrase)'
      ]
    }
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
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReturnDashboard = () => {
    navigation.navigate('HomeDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Animated Trophy Header */}
        <Animated.View style={[styles.headerSection, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <Text style={styles.trophyIcon}>🏰</Text>
          <Text style={styles.headerTitle}>HOÀN THÀNH ẢI DUNGEON!</Text>
          <Text style={styles.headerSubtitle}>Hệ thống đã phân tích toàn diện năng lực của bạn</Text>
        </Animated.View>

        {/* TOEIC Score Glassmorphism Panel */}
        <Animated.View style={[styles.glassPanel, { opacity: fadeAnim }]}>
          <Text style={styles.panelTitle}>📊 ĐIỂM TOEIC QUY ĐỔI (ESTIMATED)</Text>
          <View style={styles.divider} />
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreVal}>{scoreData.estimatedScore}</Text>
            <Text style={styles.scoreUnit}>TOEIC</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValText}>{scoreData.correctCount}/{scoreData.totalQuestions}</Text>
              <Text style={styles.statLabelText}>Câu đúng</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValText, { color: '#a78bfa' }]}>+{scoreData.kpEarned} KP</Text>
              <Text style={styles.statLabelText}>Thưởng nóng</Text>
            </View>
          </View>
        </Animated.View>

        {/* Competency Radar Widget */}
        <Animated.View style={[styles.glassPanel, { opacity: fadeAnim }]}>
          <Text style={styles.panelTitle}>🕸️ BIỂU ĐỒ NĂNG LỰC 6 CHIỀU</Text>
          <View style={styles.divider} />
          
          <View style={styles.radarWrapper}>
            {hasSvgSupport ? (
              <Svg width="150" height="150" viewBox="0 0 100 100" style={styles.radarSvg}>
                {/* Outter frame */}
                <Polygon points="50,10 90,35 90,75 50,95 10,75 10,35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                {/* Stats polygon */}
                <Polygon points="50,22 82,40 78,70 50,88 22,70 18,40" fill="rgba(167, 139, 250, 0.15)" stroke="#a78bfa" strokeWidth="2" />
              </Svg>
            ) : (
              <View style={styles.radarFallback} />
            )}
            <View style={styles.radarLabels}>
              <Text style={styles.radarLabel}>Listening</Text>
              <Text style={styles.radarLabel}>Reading</Text>
              <Text style={styles.radarLabel}>Grammar</Text>
            </View>
          </View>
        </Animated.View>

        {/* AI Mentor Insights */}
        <Animated.View style={[styles.mentorPanel, { opacity: fadeAnim }]}>
          <View style={styles.mentorHeader}>
            <Text style={styles.mentorAvatar}>🧠</Text>
            <View>
              <Text style={styles.mentorName}>AI MENTOR KHUYÊN ÔN TẬP</Text>
              <Text style={styles.mentorSubtitle}>Chủ điểm cần cải thiện dựa trên các câu sai</Text>
            </View>
          </View>

          <View style={styles.recommendationsList}>
            {scoreData.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationNumber}>{index + 1}</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Button */}
        <TouchableOpacity style={styles.dashboardBtn} onPress={handleReturnDashboard}>
          <Text style={styles.dashboardBtnText}>Quay về Dashboard</Text>
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
    paddingVertical: 24,
    gap: 16,
    paddingBottom: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 4,
  },
  trophyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#d2bbff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 18,
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.15)',
    paddingVertical: 18,
    borderRadius: 12,
  },
  scoreVal: {
    fontSize: 54,
    fontWeight: '950',
    color: '#fff',
    textShadowColor: 'rgba(167, 139, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  scoreUnit: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  statValText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  statLabelText: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '600',
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  radarSvg: {
    alignSelf: 'center',
  },
  radarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  radarLabels: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 8,
  },
  radarLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
  },
  mentorPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    fontSize: 11,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  mentorSubtitle: {
    fontSize: 9,
    color: '#64748b',
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
    borderColor: 'rgba(255, 255, 255, 0.03)',
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
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
    fontWeight: '500',
  },
  dashboardBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  dashboardBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});

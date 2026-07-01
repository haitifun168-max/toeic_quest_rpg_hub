/**
 * RankUpCeremonyScreen.js
 * Giao diện Lễ thăng hạng hoành tráng chúc mừng học viên.
 * Hoạt họa scale và xoay huy hiệu, pháo hoa đa sắc màu cùng thưởng nóng KP.
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RANK_NAMES = {
  1: 'TẬP SỰ (NOVICE)',
  2: 'HỌC VIỆC (APPRENTICE)',
  3: 'CHUYÊN VIÊN (SPECIALIST)',
  4: 'HIỆP SĨ (KNIGHT)'
};

const RANK_ICONS = {
  1: '🛡️',
  2: '⚔️',
  3: '🔮',
  4: '👑'
};

const RANK_COLORS = {
  1: '#94a3b8', // Slate
  2: '#34d399', // Emerald
  3: '#60a5fa', // Blue
  4: '#f59e0b'  // Amber
};

export default function RankUpCeremonyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { oldRank, newRank, kpEarned } = route.params || {
    oldRank: 1,
    newRank: 2,
    kpEarned: 200
  };

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Fireworks mock positions
  const fw1 = useRef(new Animated.Value(0)).current;
  const fw2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Kích hoạt chuỗi hoạt họa đồng thời
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(fw1, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(fw1, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(fw2, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(fw2, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      )
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleClaim = () => {
    navigation.navigate('HomeDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Simulated Fireworks */}
      <Animated.Text style={[styles.firework, { transform: [{ scale: fw1 }], opacity: fw1, top: '20%', left: '15%' }]}>
        ✨🎇✨
      </Animated.Text>
      <Animated.Text style={[styles.firework, { transform: [{ scale: fw2 }], opacity: fw2, top: '35%', right: '15%' }]}>
        🌟🎆🌟
      </Animated.Text>

      <Animated.View style={[styles.ceremonyCard, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <Text style={styles.congratsText}>🎉 THĂNG HẠNG THÀNH CÔNG! 🎉</Text>
        <Text style={styles.congratsSub}>Nỗ lực học tập của bạn đã được ghi nhận</Text>

        {/* Badge Upgrade Animation Panel */}
        <View style={styles.badgeShowcase}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeIconOld}>{RANK_ICONS[oldRank]}</Text>
            <Text style={styles.badgeLabel}>Cấp cũ</Text>
          </View>

          <Text style={styles.arrowIcon}>➡️</Text>

          <Animated.View style={[styles.badgeWrapper, { transform: [{ rotate: spin }] }]}>
            <View style={[styles.badgeGlow, { backgroundColor: RANK_COLORS[newRank] }]} />
            <Text style={styles.badgeIconNew}>{RANK_ICONS[newRank]}</Text>
            <Text style={[styles.badgeLabel, { color: RANK_COLORS[newRank] }]}>CẤP MỚI</Text>
          </Animated.View>
        </View>

        <Text style={[styles.rankNameText, { color: RANK_COLORS[newRank] }]}>
          {RANK_NAMES[newRank]}
        </Text>

        {/* Unlocked privileges */}
        <View style={styles.privilegePanel}>
          <Text style={styles.privilegeTitle}>🔓 ĐẶC QUYỀN MỚI MỞ KHÓA:</Text>
          <View style={styles.privilegeList}>
            {newRank === 2 && (
              <Text style={styles.privilegeItem}>• ⚔️ Tham gia đấu trường PvP Ranked thời gian thực.</Text>
            )}
            {newRank === 3 && (
              <Text style={styles.privilegeItem}>• 🏛️ Tham gia Dungeon thi thử Full Mock Test 200 câu.</Text>
            )}
            {newRank >= 4 && (
              <Text style={styles.privilegeItem}>• 👑 Nhận 2x điểm KP thưởng hàng ngày.</Text>
            )}
            <Text style={styles.privilegeItem}>• 🎁 Thưởng nóng Lễ thăng hạng: +{kpEarned} KP.</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={[styles.claimBtn, { backgroundColor: RANK_COLORS[newRank] }]} onPress={handleClaim}>
          <Text style={styles.claimBtnText}>NHẬN THƯỞNG & QUAY VỀ</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f16',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  firework: {
    position: 'absolute',
    fontSize: 24,
  },
  ceremonyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 0.5,
  },
  congratsText: {
    fontSize: 16,
    fontWeight: '950',
    color: '#facc15',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  congratsSub: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: -8,
  },
  badgeShowcase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginVertical: 14,
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  badgeGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.15,
  },
  badgeIconOld: {
    fontSize: 32,
    opacity: 0.5,
  },
  badgeIconNew: {
    fontSize: 36,
  },
  badgeLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  rankNameText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  privilegePanel: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  privilegeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#cbd5e1',
    letterSpacing: 0.5,
  },
  privilegeList: {
    gap: 6,
  },
  privilegeItem: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 18,
    fontWeight: '500',
  },
  claimBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  claimBtnText: {
    color: '#12121d',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

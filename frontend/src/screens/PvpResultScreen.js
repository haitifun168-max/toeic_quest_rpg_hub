/**
 * PvpResultScreen.js
 * Màn hình kết quả trận đấu PvP: Thắng/Thua, thay đổi ELO và điểm KP thưởng nhận được.
 * Phong cách HSL cao cấp rực rỡ.
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

export default function PvpResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { resultData, isWinner } = route.params || {
    resultData: {
      winnerId: 'pA',
      scores: { playerA: 8, playerB: 6 },
      eloChanges: { playerA: 24, playerB: -8 },
      kpRewards: { playerA: 300, playerB: 50 },
      finalStats: {
        playerA: { current_elo: 1120, total_kp: 2150, current_stamina: 13 },
        playerB: { current_elo: 990, total_kp: 1050, current_stamina: 13 }
      }
    },
    isWinner: true
  };

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReturnLobby = () => {
    navigation.navigate('PvpLobby');
  };

  // Extract variables
  const scores = resultData.scores || { playerA: 0, playerB: 0 };
  const eloChange = isWinner ? resultData.eloChanges.playerA : resultData.eloChanges.playerB;
  const kpReward = isWinner ? resultData.kpRewards.playerA : resultData.kpRewards.playerB;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        
        {/* Result Badge */}
        <Animated.View style={[styles.headerSection, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <Text style={styles.badgeIcon}>{isWinner ? '👑' : '💀'}</Text>
          <Text style={[styles.badgeTitle, { color: isWinner ? '#facc15' : '#94a3b8' }]}>
            {isWinner ? 'CHIẾN THẮNG!' : 'THẤT BẠI'}
          </Text>
          <Text style={styles.badgeSubtitle}>
            {isWinner ? 'Bạn đã đánh bại đối thủ đầy thuyết phục' : 'Thất bại là mẹ thành công, hãy cố gắng tiếp tục!'}
          </Text>
        </Animated.View>

        {/* Scoreboard Panel */}
        <Animated.View style={[styles.glassPanel, { opacity: fadeAnim }]}>
          <Text style={styles.panelTitle}>🏆 TỈ SỐ CHUNG CUỘC</Text>
          <View style={styles.divider} />
          
          <View style={styles.scoreRow}>
            <View style={styles.playerScoreCol}>
              <Text style={styles.scoreVal}>{isWinner ? Math.max(scores.playerA, scores.playerB) : Math.min(scores.playerA, scores.playerB)}</Text>
              <Text style={styles.playerLabel}>BẠN</Text>
            </View>
            <Text style={styles.scoreColon}>-</Text>
            <View style={styles.playerScoreCol}>
              <Text style={[styles.scoreVal, { color: '#64748b' }]}>{isWinner ? Math.min(scores.playerA, scores.playerB) : Math.max(scores.playerA, scores.playerB)}</Text>
              <Text style={styles.playerLabel}>ĐỐI THỦ</Text>
            </View>
          </View>
        </Animated.View>

        {/* ELO & KP Rewards Cards */}
        <Animated.View style={[styles.rewardsRow, { opacity: fadeAnim }]}>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardLabel}>TIẾN TRÌNH XẾP HẠNG</Text>
            <Text style={[styles.rewardVal, { color: eloChange >= 0 ? '#4ade80' : '#f87171' }]}>
              {eloChange >= 0 ? `+${eloChange}` : eloChange} ELO
            </Text>
          </View>
          <View style={styles.rewardCard}>
            <Text style={styles.rewardLabel}>ĐIỂM KP NHẬN ĐƯỢC</Text>
            <Text style={styles.rewardVal}>+{kpReward} KP</Text>
          </View>
        </Animated.View>

        {/* Action Button */}
        <TouchableOpacity style={styles.returnBtn} onPress={handleReturnLobby}>
          <Text style={styles.returnBtnText}>Quay về Sảnh PvP</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
    gap: 20,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  badgeIcon: {
    fontSize: 72,
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 26,
    fontWeight: '950',
    letterSpacing: 1.5,
  },
  badgeSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    width: '100%',
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  playerScoreCol: {
    alignItems: 'center',
    gap: 4,
  },
  scoreVal: {
    fontSize: 36,
    fontWeight: '950',
    color: '#fff',
  },
  playerLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scoreColon: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ccc3d8',
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  rewardCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  rewardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  rewardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#c084fc',
  },
  returnBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  returnBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});

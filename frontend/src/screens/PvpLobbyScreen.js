/**
 * PvpLobbyScreen.js
 * Sảnh chờ PvP: Hiển thị ELO, Stamina, Lịch sử đấu và nút tìm trận đấu Ranked.
 * Phong cách HSL dark-glassmorphism cao cấp.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import SecureStore from '../utils/storage';
import { showAlert } from '../utils/alertHelper';

import { BACKEND_URL } from '../config';

export default function PvpLobbyScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [lobbyData, setLobbyData] = useState(null);
  const [lockedMessage, setLockedMessage] = useState(null);

  useEffect(() => {
    if (isFocused) {
      fetchLobbyData();
    }
  }, [isFocused]);

  const fetchLobbyData = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Hết hạn phiên đăng nhập. Vui lòng đăng nhập lại.');
      }

      const response = await fetch(`${BACKEND_URL}/api/pvp/lobby`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();
      if (response.ok && result.ok) {
        setLockedMessage(null);
        setLobbyData(result.data);
      } else {
        if (result.error?.code === 'RANK_TOO_LOW') {
          setLobbyData(null);
          setLockedMessage(result.error.message || 'Bạn cần đạt tối thiểu Rank 2 (Học việc) để tham gia đấu PvP Ranked.');
          return;
        }
        throw new Error(result.error?.message || 'Không thể tải sảnh đấu PvP');
      }
    } catch (err) {
      console.log('PvPLobby error:', err.message);
      showAlert('Không thể tải sảnh đấu PvP', err.message);
      setLobbyData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatchmaking = () => {
    if (!lobbyData) return;
    if (lobbyData.stamina <= 0) {
      showAlert('Hết năng lượng', 'Bạn đã sử dụng hết Stamina đấu PvP hôm nay. Hãy đợi Stamina hồi phục lúc 00h00.');
      return;
    }

    navigation.navigate('PvpMatchmaking', { elo: lobbyData.elo });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang vào sảnh đấu...</Text>
      </SafeAreaView>
    );
  }

  if (lockedMessage) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.lockedTitle}>Chưa đủ điều kiện PvP Ranked</Text>
        <Text style={styles.lockedText}>{lockedMessage}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.backBtnText}>Về Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!lobbyData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.lockedTitle}>Không thể tải sảnh đấu PvP</Text>
        <TouchableOpacity style={styles.backBtn} onPress={fetchLobbyData}>
          <Text style={styles.backBtnText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.backBtnText}>◀ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ĐẤU TRƯỜNG RANKED</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Ranked Banner Cards */}
        <View style={styles.rankedCard}>
          <Text style={styles.arenaIcon}>⚔️</Text>
          <Text style={styles.eloText}>{lobbyData.elo} ELO</Text>
          <Text style={styles.leagueText}>HẠNG VÀNG II</Text>
          
          <View style={styles.staminaRow}>
            <Text style={styles.staminaLabel}>Năng lượng trận đấu: </Text>
            <Text style={styles.staminaValue}>⚡ {lobbyData.stamina}/15</Text>
          </View>
        </View>

        {/* Win/Loss Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={[styles.metricVal, { color: '#4ade80' }]}>{lobbyData.wins}</Text>
            <Text style={styles.metricLbl}>Chiến thắng</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={[styles.metricVal, { color: '#f87171' }]}>{lobbyData.losses}</Text>
            <Text style={styles.metricLbl}>Thất bại</Text>
          </View>
        </View>

        {/* Find match Action */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStartMatchmaking}>
          <Text style={styles.startBtnText}>TÌM TRẬN ĐẤU NGAY</Text>
        </TouchableOpacity>

        {/* Match History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📜 LỊCH SỬ BÀI ĐẤU</Text>
          
          {lobbyData.history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>Chưa có trận đấu nào được ghi nhận.</Text>
            </View>
          ) : (
            lobbyData.history.map((match) => {
              const isWin = match.score_a > match.score_b;
              return (
                <View key={match.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={[styles.resultBadge, { backgroundColor: isWin ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: isWin ? '#4ade80' : '#f87171' }]}>
                      {isWin ? 'THẮNG' : 'THUA'}
                    </Text>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.opponentName}>vs {match.player_b_name || 'Đối thủ ẩn danh'}</Text>
                      <Text style={styles.matchTime}>{new Date(match.played_at).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.scoreText}>{match.score_a} - {match.score_b}</Text>
                    <Text style={[styles.eloDiff, { color: match.elo_change_a >= 0 ? '#4ade80' : '#f87171' }]}>
                      {match.elo_change_a >= 0 ? `+${match.elo_change_a}` : match.elo_change_a} ELO
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
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
  lockedTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  lockedText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    maxWidth: 320,
    textAlign: 'center',
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
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  rankedCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.25)',
    borderRadius: 16,
    paddingVertical: 24,
    gap: 8,
  },
  arenaIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  eloText: {
    fontSize: 28,
    fontWeight: '950',
    color: '#fff',
    letterSpacing: 0.5,
  },
  leagueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#c084fc',
    letterSpacing: 1,
  },
  staminaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  staminaLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  staminaValue: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '850',
  },
  metricLbl: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  startBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  historySection: {
    gap: 10,
    marginTop: 8,
  },
  historyTitle: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '800',
    overflow: 'hidden',
  },
  opponentName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  matchTime: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  eloDiff: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});

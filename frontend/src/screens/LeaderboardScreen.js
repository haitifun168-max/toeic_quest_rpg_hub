/**
 * LeaderboardScreen.js
 * Màn hình Bảng Xếp Hạng Toàn Server (PvP ELO, Điểm KP, Chuỗi Streak).
 * Giao diện Glassmorphism hiệu ứng mượt mà.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '../config';

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState('elo'); // 'elo', 'kp', 'streak'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchLeaderboard(tab);
  }, [tab]);

  const fetchLeaderboard = async (selectedTab) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${BACKEND_URL}/api/leaderboard?type=${selectedTab}`);
      const data = await res.json();
      if (data.ok && data.data && Array.isArray(data.data.leaderboard)) {
        setLeaderboard(data.data.leaderboard);
      } else {
        setLeaderboard([]);
        setError(true);
      }
    } catch (e) {
      console.warn('Failed to fetch leaderboard:', e);
      setLeaderboard([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) return <Text style={styles.goldMedal}>🥇</Text>;
    if (rank === 2) return <Text style={styles.silverMedal}>🥈</Text>;
    if (rank === 3) return <Text style={styles.bronzeMedal}>🥉</Text>;
    return <Text style={styles.rankNum}>#{rank}</Text>;
  };

  const renderValue = (item) => {
    if (tab === 'kp') return `${item.kp_score || 0} KP`;
    if (tab === 'streak') return `🔥 ${item.streak || 0} Ngày`;
    return `⚔️ ${item.elo_rating || 1000} ELO`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Bảng Xếp Hạng</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'elo' && styles.activeTabBtn]}
          onPress={() => setTab('elo')}
        >
          <Text style={[styles.tabText, tab === 'elo' && styles.activeTabText]}>⚔️ ELO PvP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'kp' && styles.activeTabBtn]}
          onPress={() => setTab('kp')}
        >
          <Text style={[styles.tabText, tab === 'kp' && styles.activeTabText]}>💎 Điểm KP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'streak' && styles.activeTabBtn]}
          onPress={() => setTab('streak')}
        >
          <Text style={[styles.tabText, tab === 'streak' && styles.activeTabText]}>🔥 Streak</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => item.user_id || index.toString()}
          contentContainerStyle={
            leaderboard.length === 0 ? styles.emptyListContent : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{error ? '📡' : '🏆'}</Text>
              <Text style={styles.emptyTitle}>
                {error ? 'Không tải được bảng xếp hạng' : 'Chưa có ai trên bảng xếp hạng'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {error
                  ? 'Kiểm tra kết nối mạng và thử lại.'
                  : 'Hãy là người đầu tiên leo hạng bằng cách học và thi đấu!'}
              </Text>
              {error && (
                <TouchableOpacity style={styles.retryBtn} onPress={() => fetchLeaderboard(tab)}>
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.itemCard, item.rank <= 3 && styles.topItemCard]}>
              <View style={styles.rankContainer}>
                {renderRankBadge(item.rank)}
              </View>
              <View style={styles.userContainer}>
                <Text style={styles.displayName}>{item.display_name || 'Chiến Binh TOEIC'}</Text>
                <Text style={styles.rankLabel}>Rank Hạng {item.rank}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{renderValue(item)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#818CF8',
    fontSize: 16,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#818CF8',
    fontWeight: '700',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  topItemCard: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
  },
  rankContainer: {
    width: 44,
    alignItems: 'center',
  },
  goldMedal: { fontSize: 24 },
  silverMedal: { fontSize: 24 },
  bronzeMedal: { fontSize: 24 },
  rankNum: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: 'bold',
  },
  userContainer: {
    flex: 1,
    marginLeft: 8,
  },
  displayName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  rankLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  valueContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  valueText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '700',
  },
});

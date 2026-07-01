/**
 * CareerMilestonesScreen.js
 * Màn hình định hướng nghề nghiệp, lộ trình Skill Tree TOEIC và danh sách việc làm đề xuất.
 * Phong cách HSL cao cấp.
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
import { useNavigation } from '@react-navigation/native';

// Fallback secure storage interface that works correctly on Web and Native
let SecureStore;
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  SecureStore = {
    setItemAsync: async (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch (e) {
        console.warn('localStorage.setItem failed:', e);
      }
    },
    getItemAsync: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage.getItem failed:', e);
        return null;
      }
    },
    deleteItemAsync: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage.removeItem failed:', e);
      }
    }
  };
} else {
  try {
    SecureStore = require('expo-secure-store');
  } catch (e) {
    const store = {};
    SecureStore = {
      setItemAsync: async (key, val) => { store[key] = val; },
      getItemAsync: async (key) => store[key] || null,
      deleteItemAsync: async (key) => { delete store[key]; }
    };
  }
}

import { BACKEND_URL } from '../config';

export default function CareerMilestonesScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [estimatedScore, setEstimatedScore] = useState(450);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) throw new Error('Hết hạn đăng nhập');

      const response = await fetch(`${BACKEND_URL}/api/users/career-jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();
      if (response.ok && result.ok) {
        setEstimatedScore(result.data.estimatedScore);
        setJobs(result.data.jobs);
      }
    } catch (err) {
      console.log('Fetch career jobs failed, loading fallback data:', err.message);
      // Fallback
      setEstimatedScore(675);
      setJobs([
        { id: '1', jobTitle: 'Thực tập sinh Marketing', companyName: 'VNG Group', requiredToeic: 450, salaryRange: '5,000,000 - 8,000,000 VND', description: 'Yêu cầu TOEIC 450+. Hỗ trợ xây dựng chiến dịch truyền thông thương hiệu và viết bài PR.' },
        { id: '2', jobTitle: 'Trợ lý Giám đốc Vận hành', companyName: 'Shopee Vietnam', requiredToeic: 650, salaryRange: '12,000,000 - 18,000,000 VND', description: 'Yêu cầu TOEIC 650+. Hỗ trợ điều phối các hoạt động kinh doanh, chuẩn bị báo cáo vận hành quốc tế.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getNextMilestone = (score) => {
    if (score < 450) return { target: 450, title: 'Tập sự (Intern)', desc: 'Mốc cơ bản đầu tiên của doanh nghiệp' };
    if (score < 650) return { target: 650, title: 'Nhân viên vận hành (Associate)', desc: 'Giao tiếp tốt trong công việc đa quốc gia' };
    if (score < 800) return { target: 800, title: 'Quản lý dự án (Project Manager)', desc: 'Làm việc trực tiếp với đối tác US/EU' };
    return { target: 990, title: 'Quản trị viên tập sự (Management Trainee)', desc: 'Cơ hội thăng tiến lãnh đạo Unilever, Nestle' };
  };

  const nextMilestone = getNextMilestone(estimatedScore);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang lập bản đồ định hướng nghề nghiệp...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.backBtnText}>◀ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ĐỊNH HƯỚNG NGHỀ NGHIỆP</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile score card */}
        <View style={styles.scoreCard}>
          <Text style={styles.cardHeader}>📊 THỐNG KÊ TOEIC HIỆN TẠI</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreVal}>{estimatedScore}</Text>
              <Text style={styles.scoreLabel}>EST. TOEIC</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
              <Text style={styles.statusVal}>
                {estimatedScore >= 800 ? 'Chuyên viên cao cấp' : estimatedScore >= 650 ? 'Nhân viên vận hành' : 'Tập sự'}
              </Text>
              <Text style={styles.statusTips}>Đã mở khóa {jobs.length} vị trí tuyển dụng!</Text>
            </View>
          </View>
        </View>

        {/* Milestone Skill Tree layout */}
        <Text style={styles.sectionTitle}>🗺️ LỘ TRÌNH CỘT MỐC (CAREER MAP)</Text>
        <View style={styles.treeContainer}>
          {[450, 650, 800, 850].map((mVal, idx) => {
            const isUnlocked = estimatedScore >= mVal;
            const labels = ['Novice (450+)', 'Associate (650+)', 'Specialist (800+)', 'Leader (850+)'];
            return (
              <View key={mVal} style={styles.treeNodeRow}>
                <View style={[styles.treeDot, isUnlocked ? styles.treeDotUnlocked : styles.treeDotLocked]}>
                  <Text style={styles.treeDotText}>{isUnlocked ? '✓' : '🔒'}</Text>
                </View>
                <View style={[styles.treeNodeCard, isUnlocked ? styles.treeNodeUnlocked : styles.treeNodeLocked]}>
                  <Text style={styles.nodeLabel}>{labels[idx]}</Text>
                  <Text style={styles.nodeDesc}>
                    {mVal === 450 ? 'Thực tập sinh VNG' : mVal === 650 ? 'Associate Shopee' : mVal === 800 ? 'Project Manager FPT' : 'Management Trainee'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Next goal recommendation */}
        {nextMilestone && (
          <View style={styles.targetCard}>
            <Text style={styles.targetTitle}>🎯 MỤC TIÊU TIẾP THEO: {nextMilestone.target} TOEIC</Text>
            <Text style={styles.targetSub}>{nextMilestone.title}</Text>
            <Text style={styles.targetDesc}>{nextMilestone.desc}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, (estimatedScore / nextMilestone.target) * 100)}%` }]} />
            </View>
          </View>
        )}

        {/* Recommended jobs vacancies list */}
        <Text style={styles.sectionTitle}>💼 CÔNG VIỆC PHÙ HỢP ĐANG TUYỂN DỤNG ({jobs.length})</Text>
        <View style={styles.jobsList}>
          {jobs.map(job => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitleText}>{job.jobTitle}</Text>
                <Text style={styles.companyText}>{job.companyName}</Text>
              </View>
              <Text style={styles.jobDesc}>{job.description}</Text>
              <View style={styles.jobFooter}>
                <Text style={styles.salaryText}>💰 Lương: {job.salaryRange}</Text>
                <View style={styles.toeicBadge}>
                  <Text style={styles.toeicBadgeText}>≥ {job.requiredToeic} TOEIC</Text>
                </View>
              </View>
            </View>
          ))}
          {jobs.length === 0 && (
            <Text style={styles.emptyText}>Chưa có công việc nào tương thích. Hãy làm bài thi thử Dungeon để nâng cao Estimated TOEIC score!</Text>
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 60,
  },
  scoreCard: {
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.18)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a78bfa',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1.5,
    borderColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreVal: {
    fontSize: 28,
    fontWeight: '950',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#a78bfa',
    fontWeight: '700',
    marginTop: 2,
  },
  scoreDetails: {
    flex: 1,
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statusVal: {
    fontSize: 14,
    fontWeight: '850',
    color: '#fff',
  },
  statusTips: {
    fontSize: 10,
    color: '#34d399',
    fontWeight: '750',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '850',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  treeContainer: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    gap: 14,
  },
  treeNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  treeDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  treeDotUnlocked: {
    backgroundColor: 'rgba(52,211,153,0.12)',
    borderColor: '#34d399',
  },
  treeDotLocked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  treeDotText: {
    fontSize: 10,
    color: '#34d399',
    fontWeight: '900',
  },
  treeNodeCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  treeNodeUnlocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  treeNodeLocked: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderColor: 'rgba(255,255,255,0.02)',
    opacity: 0.5,
  },
  nodeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  nodeDesc: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  targetCard: {
    backgroundColor: 'rgba(251,146,60,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.15)',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  targetTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fb923c',
  },
  targetSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  targetDesc: {
    fontSize: 10,
    color: '#94a3b8',
    lineHeight: 14,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fb923c',
    borderRadius: 3,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  jobHeader: {
    gap: 2,
  },
  jobTitleText: {
    fontSize: 13,
    fontWeight: '850',
    color: '#fff',
  },
  companyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#a78bfa',
  },
  jobDesc: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  salaryText: {
    fontSize: 11,
    color: '#fb923c',
    fontWeight: '800',
  },
  toeicBadge: {
    backgroundColor: 'rgba(52,211,153,0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  toeicBadgeText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 20,
    lineHeight: 18,
  },
});

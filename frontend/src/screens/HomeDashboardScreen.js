import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import QuestSelectionSheet from '../components/QuestSelectionSheet';

import SecureStore from '../utils/storage';

// Fallback SVG rendering logic to avoid crash if react-native-svg is not installed
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

import { BACKEND_URL } from '../config';

const AVATAR_MAP = {
  knight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMvINP78Luvg2ihUhKsqduRfvGcIcV0phfOC1Vb9MGqpZGyINq-QeAKv2LSuenTf_jVjEiqZ8tMQJGI3lQjni03Nth7PYzA7KNMomY9YFUDR86Q8egYP9xiBOprqYYJyTNuRwC134eh_jmMIS18imjKCtS7WlIs7iVQIhkykQJ4fQIDwpAvCQb1zJz9PBg0_v7Scg33YSh0F5pgt82Z1UfeCXn39GAsBA5sbfsFhLu3aeo76pgBOqzNMoK9Tm4HaKXNJVqD4MtQBHU',
  mage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD9Bq2cVYz_-gd4JMUPdkpL5bPwmliJnhAdTD4GIdYGLQST5inX-HILt4gcBM-q3UKh0KJnOyERKyLdflcFJvR8c3PIGBMGPLz69uWVvgO5i2NZTxlLr8qQuoS14d0za5mmderVV_M8Rhu5cnLJaM2wAzdonKaocKB_eOlKAYhIwBek8qppXumIqEq5RDeXqKSHjYe_MFJhuCHwpSsMy2Ryab0iz-90pVw50TKUW771Lvs3m5q3Z0VYzUGorZ4-t5Z0DOgIpe7e4jP',
  assassin: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr1z9ZzoAj9qPZnS8E-wTZHELGTYi5XCn0INN44LsI6q4aKemefF1b9qHqgwu6_Dt1QzRKEOMgPRGi1_4dRhW7SpVkWtVfDMA_7uN73sRG5P56_UAuIC-ki9LUjC4GM2My4ElHyzr-EhsyG6U9KTmCBJ2hPWPiAnDyinWfXJTjwKTHS5vnMpAodZb5t28Yx0bvTw9y19IbgOXjmczIhOWqQSqY1GGta_SPQHpiDPJY5RJKregMxVnfvmQd5CW-kD1CjflAE36lz90-',
  pilot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzNKQ8WUvd5XNq03jFbGlPJCo3XI5q41jeCkF3M0lqxNMfiHwcRAwMW9SlfDInCK59URzHYHcnpdVhebcbJw9CzEMX3ZvPr8-nozDa3LnAfH9NC0uNFXDAhgVgBbhO5QiWgRnKTA3VUVGvi1zZryhDeW8XfV-QxGvXmeMvuAu_s_oXNyDByoldRoTedZ25RdUQGHnOD-wUecGT-pqqy0BSjUt1mjvXIHqsPvODrW1ULc0-2P5ocWciL0FeQHk9ARJAlDXYM4UtHoyy',
  scholar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmLPKduZB7nVBGf9JRibMZJXUAPLsUhPKVmuGHhHuh8pwph8ckjhyvhOIBBG9zt7iK456RC-5P90RgRid6hGGE-lbliMkdw8mZv-NASVmqCmKB-h8dg3PmYCN2_te1o5-F8dWTw4qR53H-JaarNBHr5FK1dDCPKQt9JKLWm3FD2tzQ8TfeiE8DYTlszF0GLEcWzcHfZAjKQ97DHH3P2QrRDukT36P3aLwphNfThWybarjx-2mj9SXI8i6Zz4dziZ8JySCpkM9hPKpx',
  scout: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANBlWwRITDceN24ylInAewL1Ns4szVIC2xVM9XrvXLX8iCvhg_FNCF0Q7X-QJsxHA5tpW0pmfJdVMGjmsKqs7WWspndKm918I5bJpp5amPaqGjGDsMZ_jXMRQxziYyFL7rehCytE9eKtf3dgdx4a2SwkPbdlU1hgxLeGCn0lkvTaYcLgpbSobIsT5J4WxP50q1HJ-F4r03Kf8ipz_UAeRdEyoTF28hoOcHeU12tlZP_apMO4IYfmY1ZklWlav-q_HoKLXEp4V4buM2'
};

export default function HomeDashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [stamina, setStamina] = useState(15);
  const [maxStamina, setMaxStamina] = useState(15);
  const [loading, setLoading] = useState(true);
  const [isQuestSheetVisible, setIsQuestSheetVisible] = useState(false);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }

      // Fetch daily quests and stamina
      const questResponse = await fetch(`${BACKEND_URL}/api/quests/daily`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const questResult = await questResponse.json();

      if (!questResponse.ok || !questResult.ok) {
        throw new Error(questResult.error?.message || 'Không thể tải danh sách nhiệm vụ');
      }

      setQuests(questResult.data.quests);
      setStamina(questResult.data.stamina);
      setMaxStamina(questResult.data.maxStamina);

      // Fetch user profile info
      const profileResponse = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileResult = await profileResponse.json();

      if (profileResponse.ok && profileResult.ok) {
        const user = profileResult.data.user;
        setProfile(user);

        if (!user.target_score) {
          navigation.replace('GoalSetting');
          return;
        }

        if (!user.character_name) {
          navigation.replace('PlacementTest');
          return;
        }

        // Check rank up trigger asynchronously
        try {
          const rankUpResponse = await fetch(`${BACKEND_URL}/api/users/check-rank`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const rankUpResult = await rankUpResponse.json();
          if (rankUpResponse.ok && rankUpResult.ok && rankUpResult.data.rankUpTriggered) {
            navigation.navigate('RankUpCeremony', {
              oldRank: rankUpResult.data.oldRank,
              newRank: rankUpResult.data.newRank,
              kpEarned: rankUpResult.data.kpEarned
            });
          }
        } catch (e) {
          console.log('Background rank check failed:', e.message);
        }
      }
    } catch (err) {
      Alert.alert('Thất bại', err.message);
      // Clean invalid session data and redirect to login
      SecureStore.deleteItemAsync('user_token').catch(() => {});
      SecureStore.deleteItemAsync('user_profile').catch(() => {});
      navigation.navigate('Auth');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseStreakFreeze = async () => {
    if (!profile) return;
    if (profile.total_kp < 500) {
      Alert.alert('Không đủ KP', 'Bạn cần tối thiểu 500 KP để mua Đóng băng Streak.');
      return;
    }

    Alert.alert(
      'Mua Đóng băng Streak',
      'Bạn có chắc chắn muốn dùng 500 KP để mua vật phẩm Đóng băng Streak? (Giới hạn 1 lần/tuần)',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Mua',
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('user_token');
              if (!token) {
                throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
              }

              const response = await fetch(`${BACKEND_URL}/api/users/streak/freeze`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              const result = await response.json();
              if (response.ok && result.ok) {
                Alert.alert('Thành công', `Đã mua Đóng băng Streak! Chuỗi ngày học của bạn được khôi phục thành ${result.data.streakRestored} ngày.`);
                setProfile(result.data.user);
              } else {
                throw new Error(result.error?.message || 'Không thể mua Streak Freeze');
              }
            } catch (err) {
              Alert.alert('Thất bại', err.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang tải trang chủ...</Text>
      </SafeAreaView>
    );
  }

  // Get active avatar configurations
  const avatarUri = profile ? AVATAR_MAP[profile.avatar_id] : AVATAR_MAP.knight;
  const username = profile ? (profile.character_name || profile.display_name) : 'Người học';
  const totalKp = profile ? profile.total_kp : 0;
  const rank = profile ? profile.current_rank : 1;

  // Icon maps for quest type
  const getQuestIcon = (type) => {
    switch (type) {
      case 'vocab': return '📖';
      case 'listening': return '🎧';
      case 'pvp': return '⚔️';
      default: return '⚡';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header App Bar */}
      <View style={styles.appBar}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity onPress={() => navigation?.navigate('CharacterProfile')}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>RANK {rank}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Chào, {username}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statStreak}>🔥 {profile?.current_streak || 0} Ngày</Text>
              <Text style={styles.statKp}>⚡ {totalKp} KP</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationBtn} onPress={() => Alert.alert('Thông báo', 'Hôm nay bạn không có thông báo mới.')}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Stamina Meter Widget */}
        <View style={styles.staminaPanel}>
          <View style={styles.staminaHeader}>
            <Text style={styles.staminaTitle}>⚡ NĂNG LƯỢNG HỌC TẬP (STAMINA)</Text>
            <Text style={styles.staminaValue}>{stamina}/{maxStamina}</Text>
          </View>
          <View style={styles.staminaBarBg}>
            <View style={[styles.staminaBarFill, { width: `${(stamina / maxStamina) * 100}%` }]} />
          </View>
          {stamina === 0 && (
            <Text style={styles.staminaWarning}>⚠️ Đã hết Stamina. Vui lòng nghỉ ngơi hoặc hoàn thành Quest để phục hồi trước khi đấu PvP.</Text>
          )}
        </View>

        {/* Hero Widget: Daily Quests */}
        <View style={styles.glassPanel}>
          <TouchableOpacity onPress={() => setIsQuestSheetVisible(true)}>
            <Text style={styles.sectionTitle}>🎯 NHIỆM VỤ HÔM NAY</Text>
          </TouchableOpacity>
        </View>
        <QuestSelectionSheet
          visible={isQuestSheetVisible}
          onClose={() => setIsQuestSheetVisible(false)}
          quests={quests}
          onSelect={(quest) => {
            setIsQuestSheetVisible(false);
            navigation?.navigate('QuestDetail', { questId: quest.id });
          }}
        />


        {/* Grid Half widgets: Competency & Roadmap */}
        <View style={styles.gridRow}>
          {/* Streak Circle Goal */}
          <View style={[styles.glassPanelHalf, { flex: 1.1 }]}>
            <Text style={styles.halfTitle}>MỤC TIÊU NGÀY</Text>
            <Text style={styles.streakDays}>Chuỗi {profile?.current_streak || 0} ngày</Text>
            <View style={styles.progressCircleContainer}>
              {hasSvgSupport ? (
                <Svg width="70" height="70" viewBox="0 0 36 36" style={styles.circleSvg}>
                  <Circle cx="18" cy="18" r="16" fill="none" stroke="#292935" strokeWidth="3" />
                  <Circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray={[profile?.current_streak ? Math.min(100, Math.round((profile.current_streak / 7) * 100)) : 0, 100]}
                    strokeLinecap="round"
                  />
                </Svg>
              ) : (
                <Text style={styles.circleFallback}>{profile?.current_streak ? Math.min(100, Math.round((profile.current_streak / 7) * 100)) : 0}%</Text>
              )}
              <View style={styles.circleTextWrapper}>
                <Text style={styles.circleProgressText}>{profile?.current_streak ? Math.min(100, Math.round((profile.current_streak / 7) * 100)) : 0}%</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.freezeBtn, (!profile || profile.total_kp < 500) && { opacity: 0.5 }]} 
              onPress={handlePurchaseStreakFreeze}
            >
              <Text style={styles.freezeBtnText}>❄️ Đóng băng</Text>
            </TouchableOpacity>
          </View>

          {/* Competency mini radar */}
          <TouchableOpacity style={[styles.glassPanelHalf, { flex: 0.9 }]} onPress={() => navigation.navigate('CareerMilestones')}>
            <Text style={styles.halfTitle}>NĂNG LỰC</Text>
            <View style={styles.radarContainer}>
              {hasSvgSupport ? (
                <Svg width="70" height="70" viewBox="0 0 100 100">
                  <Polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="rgba(210,187,255,0.3)" strokeWidth="1" />
                  <Polygon points="50,25 75,45 65,75 35,75 25,45" fill="rgba(210,187,255,0.35)" stroke="#d2bbff" strokeWidth="2" />
                </Svg>
              ) : (
                <View style={styles.radarFallback} />
              )}
              <View style={styles.radarCenterText}>
                <Text style={styles.rankClassText}>{profile?.rank === 4 ? 'R4' : profile?.rank === 3 ? 'R3' : profile?.rank === 2 ? 'R2' : 'R1'}</Text>
                <Text style={styles.rankSubText}>
                  {profile?.rank === 4 ? 'Hiệp sĩ' : profile?.rank === 3 ? 'Chuyên viên' : profile?.rank === 2 ? 'Học việc' : 'Tập sự'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Flashcard learning */}
        <View style={styles.flashcardCard}>
          <View style={styles.flashcardBadgeBg}>
            <Text style={styles.flashcardBadgeText}>🎴</Text>
            <Text style={styles.flashcardCount}>{profile?.total_kp ? Math.round(profile.total_kp / 10) : 0}</Text>
          </View>
          <View style={styles.flashcardInfo}>
            <Text style={styles.flashcardTitle}>Flashcard Ôn Tập</Text>
            <Text style={styles.flashcardDesc}>
              {profile?.total_kp ? `Cần ôn lại ${Math.round(profile.total_kp / 50) || 5} từ khó hôm nay` : 'Bắt đầu học để lưu từ vựng ôn tập'}
            </Text>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => Alert.alert('Học từ vựng', 'Chức năng học từ vựng Flashcard đang được phát triển.')}>
            <Text style={styles.playIcon}>▶️</Text>
          </TouchableOpacity>
        </View>

        {/* AI Mentor Recommendation Widget */}
        <View style={styles.aiMentorCard}>
          <View style={styles.aiTextContainer}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiHeaderTag}>AI MENTOR</Text>
            </View>
            <Text style={styles.aiMessage}>"Bạn đang gặp khó ở Part 5, hãy thử một bài luyện nhanh?"</Text>
            <TouchableOpacity style={styles.aiStartBtn} onPress={() => navigation.navigate('DungeonSelection')}>
              <Text style={styles.aiStartBtnText}>Bắt đầu ngay ⚡</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.orbWrapper}>
            <View style={styles.orbGlow} />
            <View style={styles.orbCore}>
              <Text style={styles.brainIcon}>🧠</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navIcon, styles.activeNavText]}>🏠</Text>
          <Text style={[styles.navLabel, styles.activeNavText]}>Trang Chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PvpLobby')}>
          <Text style={styles.navIcon}>⚔️</Text>
          <Text style={styles.navLabel}>PvP Battle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SkillTreeMap')}>
          <Text style={styles.navIcon}>🌳</Text>
          <Text style={styles.navLabel}>Skill Tree</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guild')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Guild</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('CharacterProfile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Hồ Sơ</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#12121d',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#ccc3d8',
    fontSize: 15,
  },
  appBar: {
    height: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d2bbff',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  rankBadgeText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#ede0ff',
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ccc3d8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  statStreak: {
    fontSize: 11,
    color: '#F97316',
    fontWeight: '700',
  },
  statKp: {
    fontSize: 11,
    color: '#d2bbff',
    fontWeight: '700',
  },
  notificationBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
    gap: 16,
  },
  staminaPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
  },
  staminaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  staminaTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d2bbff',
    letterSpacing: 0.5,
  },
  staminaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#d2bbff',
  },
  staminaBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#292935',
    borderRadius: 4,
    overflow: 'hidden',
  },
  staminaBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  staminaWarning: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 8,
    lineHeight: 16,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#d2bbff',
    marginBottom: 12,
  },
  questList: {
    gap: 12,
  },
  questCard: {
    backgroundColor: '#1f1e2a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questIcon: {
    fontSize: 18,
  },
  questInfo: {
    flex: 1,
    gap: 4,
  },
  questTextTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#343440',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#d2bbff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  glassPanelHalf: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    alignItems: 'center',
    minHeight: 170,
  },
  halfTitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  streakDays: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F1F5F9',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  progressCircleContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  circleSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  circleTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  circleProgressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F97316',
  },
  streakFooter: {
    fontSize: 9,
    color: '#4edea3',
    fontWeight: '600',
  },
  circleFallback: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F97316',
  },
  radarContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 12,
  },
  radarCenterText: {
    position: 'absolute',
    alignItems: 'center',
  },
  rankClassText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#d2bbff',
  },
  rankSubText: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 1,
  },
  radarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(210,187,255,0.2)',
  },
  flashcardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#ffb95f',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flashcardBadgeBg: {
    width: 52,
    height: 52,
    backgroundColor: '#292935',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashcardBadgeText: {
    fontSize: 16,
  },
  flashcardCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffb95f',
    marginTop: 2,
  },
  flashcardInfo: {
    flex: 1,
  },
  flashcardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 4,
  },
  flashcardDesc: {
    fontSize: 11,
    color: '#94A3B8',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffb95f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffb95f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playIcon: {
    fontSize: 12,
  },
  aiMentorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  aiTextContainer: {
    flex: 1,
    paddingRight: 80,
  },
  aiHeader: {
    marginBottom: 6,
  },
  aiHeaderTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#d2bbff',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
  },
  aiMessage: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiStartBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  aiStartBtnText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  orbWrapper: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderRadius: 30,
  },
  orbCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 6,
  },
  brainIcon: {
    fontSize: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'rgba(18, 18, 29, 0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
    zIndex: 999,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  navItemActive: {
    opacity: 1,
  },
  navIcon: {
    fontSize: 20,
    color: '#ccc3d8',
  },
  navLabel: {
    fontSize: 10,
    color: '#ccc3d8',
    fontWeight: '600',
    marginTop: 2,
  },
  activeNavText: {
    color: '#d2bbff',
    textShadowColor: 'rgba(210, 187, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  freezeBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeBtnText: {
    color: '#22d3ee',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

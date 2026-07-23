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
  Platform
} from 'react-native';

import SecureStore from '../utils/storage';
import { RANK_NAMES } from '../constants/ranks';

// Fallback SVG rendering logic to avoid crash if react-native-svg is not installed
let Svg, Polygon, Circle, Line;
let hasSvgSupport = true;
try {
  const SvgLib = require('react-native-svg');
  Svg = SvgLib.default;
  Polygon = SvgLib.Polygon;
  Circle = SvgLib.Circle;
  Line = SvgLib.Line;
} catch (e) {
  hasSvgSupport = false;
}

import { BACKEND_URL } from '../config';

const AVATAR_MAP = {
  knight: {
    name: 'Kỵ Sĩ',
    title: 'Chiến binh học thuật',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMvINP78Luvg2ihUhKsqduRfvGcIcV0phfOC1Vb9MGqpZGyINq-QeAKv2LSuenTf_jVjEiqZ8tMQJGI3lQjni03Nth7PYzA7KNMomY9YFUDR86Q8egYP9xiBOprqYYJyTNuRwC134eh_jmMIS18imjKCtS7WlIs7iVQIhkykQJ4fQIDwpAvCQb1zJz9PBg0_v7Scg33YSh0F5pgt82Z1UfeCXn39GAsBA5sbfsFhLu3aeo76pgBOqzNMoK9Tm4HaKXNJVqD4MtQBHU'
  },
  mage: {
    name: 'Pháp Sư',
    title: 'Bậc thầy tri thức',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD9Bq2cVYz_-gd4JMUPdkpL5bPwmliJnhAdTD4GIdYGLQST5inX-HILt4gcBM-q3UKh0KJnOyERKyLdflcFJvR8c3PIGBMGPLz69uWVvgO5i2NZTxlLr8qQuoS14d0za5mmderVV_M8Rhu5cnLJaM2wAzdonKaocKB_eOlKAYhIwBek8qppXumIqEq5RDeXqKSHjYe_MFJhuCHwpSsMy2Ryab0iz-90pVw50TKUW771Lvs3m5q3Z0VYzUGorZ4-t5Z0DOgIpe7e4jP'
  },
  assassin: {
    name: 'Sát Thủ',
    title: 'Bóng ma cú pháp',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr1z9ZzoAj9qPZnS8E-wTZHELGTYi5XCn0INN44LsI6q4aKemefF1b9qHqgwu6_Dt1QzRKEOMgPRGi1_4dRhW7SpVkWtVfDMA_7uN73sRG5P56_UAuIC-ki9LUjC4GM2My4ElHyzr-EhsyG6U9KTmCBJ2hPWPiAnDyinWfXJTjwKTHS5vnMpAodZb5t28Yx0bvTw9y19IbgOXjmczIhOWqQSqY1GGta_SPQHpiDPJY5RJKregMxVnfvmQd5CW-kD1CjflAE36lz90-'
  },
  pilot: {
    name: 'Phi Công',
    title: 'Kẻ dắt gió nghe hiểu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzNKQ8WUvd5XNq03jFbGlPJCo3XI5q41jeCkF3M0lqxNMfiHwcRAwMW9SlfDInCK59URzHYHcnpdVhebcbJw9CzEMX3ZvPr8-nozDa3LnAfH9NC0uNFXDAhgVgBbhO5QiWgRnKTA3VUVGvi1zZryhDeW8XfV-QxGvXmeMvuAu_s_oXNyDByoldRoTedZ25RdUQGHnOD-wUecGT-pqqy0BSjUt1mjvXIHqsPvODrW1ULc0-2P5ocWciL0FeQHk9ARJAlDXYM4UtHoyy'
  },
  scholar: {
    name: 'Học Giả',
    title: 'Nhà thông thái từ vựng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmLPKduZB7nVBGf9JRibMZJXUAPLsUhPKVmuGHhHuh8pwph8ckjhyvhOIBBG9zt7iK456RC-5P90RgRid6hGGE-lbliMkdw8mZv-NASVmqCmKB-h8dg3PmYCN2_te1o5-F8dWTw4qR53H-JaarNBHr5FK1dDCPKQt9JKLWm3FD2tzQ8TfeiE8DYTlszF0GLEcWzcHfZAjKQ97DHH3P2QrRDukT36P3aLwphNfThWybarjx-2mj9SXI8i6Zz4dziZ8JySCpkM9hPKpx'
  },
  scout: {
    name: 'Trinh Sát',
    title: 'Nhà thám hiểm ngữ nghĩa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANBlWwRITDceN24ylInAewL1Ns4szVIC2xVM9XrvXLX8iCvhg_FNCF0Q7X-QJsxHA5tpW0pmfJdVMGjmsKqs7WWspndKm918I5bJpp5amPaqGjGDsMZ_jXMRQxziYyFL7rehCytE9eKtf3dgdx4a2SwkPbdlU1hgxLeGCn0lkvTaYcLgpbSobIsT5J4WxP50q1HJ-F4r03Kf8ipz_UAeRdEyoTF28hoOcHeU12tlZP_apMO4IYfmY1ZklWlav-q_HoKLXEp4V4buM2'
  }
};

export default function CharacterProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }

      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Không thể tải hồ sơ nhân vật');
      }

      setUser(result.data.user);
    } catch (err) {
      Alert.alert('Thất bại', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang tải hồ sơ nhân vật...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Không thể hiển thị thông tin hồ sơ.</Text>
      </SafeAreaView>
    );
  }

  // Get active avatar configurations
  const avatarInfo = AVATAR_MAP[user.avatar_id] || AVATAR_MAP.knight;
  
  // Calculate simulated level: start level 1, +1 per 1000 KP
  const computedLevel = Math.floor((user.total_kp || 0) / 1000) + 1;
  const currentLevelXp = (user.total_kp || 0) % 1000;
  const xpPercent = (currentLevelXp / 1000) * 100;

  // Estimation TOEIC Score
  const estimatedToeic = user.current_elo ? Math.round(user.current_elo * 0.4 + 10) : 350;

  // Radar points computation
  const computeRadarPoints = () => {
    const R_MAX = 40;
    const stats = user.stats || { grammar: 50, vocab: 50, listening: 50, reading: 50, pronunciation: 50, speed: 50 };
    const values = [
      stats.grammar,
      stats.vocab,
      stats.listening,
      stats.reading,
      stats.pronunciation,
      stats.speed
    ];
    
    const angles = [
      -Math.PI / 2,     // Grammar (Lên)
      -Math.PI / 6,     // Vocab (Phải Trên)
      Math.PI / 6,      // Listening (Phải Dưới)
      Math.PI / 2,      // Reading (Dưới)
      5 * Math.PI / 6,  // Error IQ (Trái Dưới)
      7 * Math.PI / 6   // Stamina (Trái Trên)
    ];

    const points = values.map((val, idx) => {
      const r = (val / 100) * R_MAX;
      const x = 50 + r * Math.cos(angles[idx]);
      const y = 50 + r * Math.sin(angles[idx]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return points.join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Navigation */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.backBtnText}>◀ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>PROFILE</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Cài đặt', 'Cài đặt sẽ được cập nhật ở các phase sau.')}>
          <Text style={styles.menuIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Hero Card Character Profile */}
        <View style={styles.glassPanel}>
          <View style={styles.avatarGlowEffect} />
          
          {/* Avatar Container */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image source={{ uri: avatarInfo.image }} style={styles.avatarImage} />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>LVL {computedLevel}</Text>
            </View>
          </View>

          {/* Identity & Display Name */}
          <Text style={styles.displayName}>{user.character_name || user.display_name}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankStar}>🏅</Text>
            <Text style={styles.rankText}>Rank {user.current_rank} — {RANK_NAMES[user.current_rank]}</Text>
          </View>

          {/* Estimated TOEIC Score */}
          <View style={styles.scoreBanner}>
            <Text style={styles.scoreBannerLabel}>ESTIMATED SCORE</Text>
            <Text style={styles.scoreBannerValue}>~{estimatedToeic} TOEIC</Text>
          </View>

          {/* Grid Stats KP & Streak */}
          <View style={styles.heroStatsRow}>
            <View style={[styles.heroStatItem, styles.statBorderRight]}>
              <Text style={styles.heroStatLabel}>Total KP</Text>
              <Text style={styles.heroStatValue}>{user.total_kp || 0}</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Streak</Text>
              <Text style={[styles.heroStatValue, styles.orangeColor]}>{user.current_streak || 0} Ngày 🔥</Text>
            </View>
          </View>
        </View>

        {/* Attribute Proficiency Radar Section */}
        <Text style={styles.sectionTitle}>Attribute Proficiency</Text>
        <View style={styles.glassPanel}>
          <View style={styles.radarContainer}>
            {hasSvgSupport ? (
              <Svg width="220" height="220" viewBox="0 0 100 100" style={styles.radarSvg}>
                {/* Background Grid Hexagons */}
                <Polygon points="50,10 84.6,30 84.6,70 50,90 15.4,70 15.4,30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                <Polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                <Polygon points="50,30 67.3,40 67.3,60 50,70 32.7,60 32.7,40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                <Polygon points="50,40 58.7,45 58.7,55 50,60 41.3,55 41.3,45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />

                {/* Axes lines */}
                <Line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <Line x1="50" y1="50" x2="84.6" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <Line x1="50" y1="50" x2="84.6" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <Line x1="50" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <Line x1="50" y1="50" x2="15.4" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
                <Line x1="50" y1="50" x2="15.4" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

                {/* Fill Area */}
                <Polygon
                  points={computeRadarPoints()}
                  fill="rgba(124, 58, 237, 0.35)"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                />
              </Svg>
            ) : (
              <View style={styles.fallbackBarContainer}>
                <Text style={styles.fallbackText}>Grammar: {user.stats?.grammar}%</Text>
                <Text style={styles.fallbackText}>Reading: {user.stats?.reading}%</Text>
                <Text style={styles.fallbackText}>Listening: {user.stats?.listening}%</Text>
              </View>
            )}

            {/* Labels */}
            <Text style={[styles.radarLabel, { top: -6, left: '50%', transform: [{ translateX: -28 }] }]}>GRAMMAR</Text>
            <Text style={[styles.radarLabel, { top: '25%', right: -16 }]}>READING</Text>
            <Text style={[styles.radarLabel, { bottom: '25%', right: -16 }]}>LISTENING</Text>
            <Text style={[styles.radarLabel, { bottom: -6, left: '50%', transform: [{ translateX: -16 }] }]}>VOCAB</Text>
            <Text style={[styles.radarLabel, { bottom: '25%', left: -16 }]}>ERROR IQ</Text>
            <Text style={[styles.radarLabel, { top: '25%', left: -16 }]}>STAMINA</Text>
          </View>
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsTitleRow}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtnText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.achievementsGrid}>
          {user.achievements?.map((item) => {
            const isUnlocked = item.unlocked;
            return (
              <View
                key={item.id}
                style={[styles.achievementCard, !isUnlocked && styles.achievementCardLocked]}
              >
                <View style={[styles.badgeIconBg, isUnlocked ? styles.purpleGlow : styles.lockedGlow]}>
                  <Text style={styles.badgeEmoji}>{item.id === 'streak_14' ? '🎖️' : item.id === 'pvp_10' ? '⚔️' : item.id === 'grammar_sage' ? '🎓' : '📖'}</Text>
                </View>
                <Text style={[styles.badgeName, !isUnlocked && styles.lockedText]}>{item.name}</Text>
                <Text style={[styles.badgeDesc, !isUnlocked && styles.lockedText]}>{item.desc}</Text>
                
                {!isUnlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Account Status Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.premiumIconBg}>
            <Text style={styles.premiumIcon}>🛡️</Text>
          </View>
          <View style={styles.premiumTextWrapper}>
            <Text style={styles.premiumTitle}>Tài khoản Tiêu chuẩn</Text>
            <Text style={styles.premiumDesc}>Nhận thêm Stamina bằng cách thăng Rank học tập</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar Navigation Sim */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('DungeonSelection')}>
          <Text style={styles.navIcon}>🏰</Text>
          <Text style={styles.navLabel}>Dungeon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Đang phát triển', 'Cửa hàng Armory sẽ được mở ở Phase tiếp theo.')}>
          <Text style={styles.navIcon}>🛍️</Text>
          <Text style={styles.navLabel}>Armory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Đang phát triển', 'Bang hội Guild sẽ được mở ở Phase tiếp theo.')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Guild</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navIcon, styles.activeNavText]}>👤</Text>
          <Text style={[styles.navLabel, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d18',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0d0d18',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#ccc3d8',
    fontSize: 15,
  },
  appBar: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#d2bbff',
    letterSpacing: 2,
  },
  iconButton: {
    padding: 8,
  },
  backBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  menuIcon: {
    color: '#d2bbff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarGlowEffect: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRadius: 70,
    // blurRadius equivalent can be simulated by background styling or simple transparency
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#7c3aed',
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -6,
    right: 2,
    backgroundColor: '#ffb95f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#472a00',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2a1700',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  rankStar: {
    fontSize: 16,
  },
  rankText: {
    fontSize: 14,
    color: '#ffb95f',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scoreBanner: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: '#7c3aed',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreBannerLabel: {
    fontSize: 10,
    color: '#d2bbff',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scoreBannerValue: {
    fontSize: 24,
    color: '#d2bbff',
    fontWeight: '800',
    marginTop: 2,
  },
  heroStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    paddingTop: 16,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorderRight: {
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#ccc3d8',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  orangeColor: {
    color: '#F97316',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 16,
    paddingLeft: 4,
  },
  radarContainer: {
    width: 220,
    height: 220,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarSvg: {
    overflow: 'visible',
  },
  radarLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#ccc3d8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fallbackBarContainer: {
    width: '100%',
    padding: 12,
    gap: 8,
  },
  fallbackText: {
    color: '#ccc3d8',
    fontSize: 12,
  },
  achievementsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllBtnText: {
    fontSize: 12,
    color: '#d2bbff',
    fontWeight: '700',
    marginRight: 4,
    marginBottom: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  badgeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  purpleGlow: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderColor: 'rgba(124, 58, 237, 0.5)',
    borderWidth: 1,
  },
  lockedGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 10,
    color: '#ccc3d8',
    textAlign: 'center',
  },
  lockedText: {
    color: '#958da1',
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },
  premiumBanner: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  premiumIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  premiumTextWrapper: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 2,
  },
  premiumDesc: {
    fontSize: 12,
    color: '#ccc3d8',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'rgba(13, 13, 24, 0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
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
    color: '#ffb95f',
    textShadowColor: 'rgba(255, 185, 95, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

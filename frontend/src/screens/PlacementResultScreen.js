import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions
} from 'react-native';

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

const AVATAR_OPTIONS = [
  {
    id: 'knight',
    name: 'Kỵ Sĩ',
    title: 'Chiến binh học thuật',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMvINP78Luvg2ihUhKsqduRfvGcIcV0phfOC1Vb9MGqpZGyINq-QeAKv2LSuenTf_jVjEiqZ8tMQJGI3lQjni03Nth7PYzA7KNMomY9YFUDR86Q8egYP9xiBOprqYYJyTNuRwC134eh_jmMIS18imjKCtS7WlIs7iVQIhkykQJ4fQIDwpAvCQb1zJz9PBg0_v7Scg33YSh0F5pgt82Z1UfeCXn39GAsBA5sbfsFhLu3aeo76pgBOqzNMoK9Tm4HaKXNJVqD4MtQBHU'
  },
  {
    id: 'mage',
    name: 'Pháp Sư',
    title: 'Bậc thầy tri thức',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD9Bq2cVYz_-gd4JMUPdkpL5bPwmliJnhAdTD4GIdYGLQST5inX-HILt4gcBM-q3UKh0KJnOyERKyLdflcFJvR8c3PIGBMGPLz69uWVvgO5i2NZTxlLr8qQuoS14d0za5mmderVV_M8Rhu5cnLJaM2wAzdonKaocKB_eOlKAYhIwBek8qppXumIqEq5RDeXqKSHjYe_MFJhuCHwpSsMy2Ryab0iz-90pVw50TKUW771Lvs3m5q3Z0VYzUGorZ4-t5Z0DOgIpe7e4jP'
  },
  {
    id: 'assassin',
    name: 'Sát Thủ',
    title: 'Bóng ma cú pháp',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr1z9ZzoAj9qPZnS8E-wTZHELGTYi5XCn0INN44LsI6q4aKemefF1b9qHqgwu6_Dt1QzRKEOMgPRGi1_4dRhW7SpVkWtVfDMA_7uN73sRG5P56_UAuIC-ki9LUjC4GM2My4ElHyzr-EhsyG6U9KTmCBJ2hPWPiAnDyinWfXJTjwKTHS5vnMpAodZb5t28Yx0bvTw9y19IbgOXjmczIhOWqQSqY1GGta_SPQHpiDPJY5RJKregMxVnfvmQd5CW-kD1CjflAE36lz90-'
  },
  {
    id: 'pilot',
    name: 'Phi Công',
    title: 'Kẻ dắt gió nghe hiểu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzNKQ8WUvd5XNq03jFbGlPJCo3XI5q41jeCkF3M0lqxNMfiHwcRAwMW9SlfDInCK59URzHYHcnpdVhebcbJw9CzEMX3ZvPr8-nozDa3LnAfH9NC0uNFXDAhgVgBbhO5QiWgRnKTA3VUVGvi1zZryhDeW8XfV-QxGvXmeMvuAu_s_oXNyDByoldRoTedZ25RdUQGHnOD-wUecGT-pqqy0BSjUt1mjvXIHqsPvODrW1ULc0-2P5ocWciL0FeQHk9ARJAlDXYM4UtHoyy'
  },
  {
    id: 'scholar',
    name: 'Học Giả',
    title: 'Nhà thông thái từ vựng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmLPKduZB7nVBGf9JRibMZJXUAPLsUhPKVmuGHhHuh8pwph8ckjhyvhOIBBG9zt7iK456RC-5P90RgRid6hGGE-lbliMkdw8mZv-NASVmqCmKB-h8dg3PmYCN2_te1o5-F8dWTw4qR53H-JaarNBHr5FK1dDCPKQt9JKLWm3FD2tzQ8TfeiE8DYTlszF0GLEcWzcHfZAjKQ97DHH3P2QrRDukT36P3aLwphNfThWybarjx-2mj9SXI8i6Zz4dziZ8JySCpkM9hPKpx'
  },
  {
    id: 'scout',
    name: 'Trinh Sát',
    title: 'Nhà thám hiểm ngữ nghĩa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANBlWwRITDceN24ylInAewL1Ns4szVIC2xVM9XrvXLX8iCvhg_FNCF0Q7X-QJsxHA5tpW0pmfJdVMGjmsKqs7WWspndKm918I5bJpp5amPaqGjGDsMZ_jXMRQxziYyFL7rehCytE9eKtf3dgdx4a2SwkPbdlU1hgxLeGCn0lkvTaYcLgpbSobIsT5J4WxP50q1HJ-F4r03Kf8ipz_UAeRdEyoTF28hoOcHeU12tlZP_apMO4IYfmY1ZklWlav-q_HoKLXEp4V4buM2'
  }
];

const RANK_NAMES = [
  'Không xác định',
  'Thực Tập Sinh',
  'Học Việc',
  'Chiến Binh',
  'Tinh Anh',
  'Huyền Thoại',
  'Thần Thoại'
];

export default function PlacementResultScreen({ route, navigation }) {
  const { correctCount, simScore, rank } = route.params || { correctCount: 5, simScore: 600, rank: 3 };

  const [animatedScore, setAnimatedScore] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [characterName, setCharacterName] = useState('Kỵ Sĩ TOEIC');
  const [submitting, setSubmitting] = useState(false);

  // Score rolling animation
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(simScore / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= simScore) {
        setAnimatedScore(simScore);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [simScore]);

  // Sync default character name when avatar changes
  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setCharacterName(`${avatar.name} TOEIC`);
  };

  // Compute mock stats for Radar Chart based on correctCount
  const stats = {
    grammar: Math.min(100, correctCount * 8 + 20),
    vocab: Math.min(100, correctCount * 7 + 25),
    listening: Math.min(100, correctCount * 6 + 15),
    reading: Math.min(100, correctCount * 7 + 20),
    pronunciation: Math.min(100, correctCount * 5 + 30),
    speed: Math.min(100, correctCount * 8 + 10),
  };

  const computeRadarPoints = () => {
    const R_MAX = 40;
    const values = [
      stats.grammar,
      stats.vocab,
      stats.listening,
      stats.reading,
      stats.pronunciation,
      stats.speed
    ];
    
    const angles = [
      -Math.PI / 2,     // Ngữ Pháp (Lên)
      -Math.PI / 6,     // Từ Vựng (Phải Trên)
      Math.PI / 6,      // Nghe (Phải Dưới)
      Math.PI / 2,      // Đọc (Dưới)
      5 * Math.PI / 6,  // Phát Âm (Trái Dưới)
      7 * Math.PI / 6   // Tốc Độ (Trái Trên)
    ];

    const points = values.map((val, idx) => {
      const r = (val / 100) * R_MAX;
      const x = 50 + r * Math.cos(angles[idx]);
      const y = 50 + r * Math.sin(angles[idx]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return points.join(' ');
  };

  const handleStartAdventure = async () => {
    const trimmedName = characterName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 30) {
      Alert.alert('Tên không hợp lệ', 'Tên nhân vật phải có độ dài từ 2 đến 30 ký tự.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }

      const response = await fetch(`${BACKEND_URL}/api/users/character`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          characterName: trimmedName,
          avatarId: selectedAvatar.id
        })
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Lưu thông tin nhân vật thất bại');
      }

      // Update cached user profile
      const cachedProfileStr = await SecureStore.getItemAsync('user_profile');
      if (cachedProfileStr) {
        const cached = JSON.parse(cachedProfileStr);
        cached.character_name = trimmedName;
        cached.avatar_id = selectedAvatar.id;
        await SecureStore.setItemAsync('user_profile', JSON.stringify(cached));
      }

      Alert.alert(
        'Thành công',
        'Anh hùng của bạn đã được khởi tạo! Hãy bắt đầu cuộc hành trình.',
        [
          {
            text: 'Bắt đầu ngay 🚀',
            onPress: () => {
              if (navigation) {
                navigation.replace('HomeDashboard');
              } else {
                console.log('Navigation trigger: HomeDashboard');
              }
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert('Thất bại', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trình độ hiện tại của bạn</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankIcon}>🏆</Text>
            <Text style={styles.rankText}>Rank {rank} — {RANK_NAMES[rank] || 'Thành Viên mới'}</Text>
          </View>
        </View>

        {/* Score & Radar Result */}
        <View style={styles.glassPanel}>
          <Text style={styles.scoreLabel}>ƯỚC TÍNH ĐIỂM SỐ</Text>
          <Text style={styles.scoreValue}>~{animatedScore} TOEIC</Text>

          {/* Radar Chart Visual */}
          <View style={styles.radarContainer}>
            {hasSvgSupport ? (
              <Svg width="220" height="220" viewBox="0 0 100 100" style={styles.radarSvg}>
                {/* Background Grid Circles */}
                <Circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <Circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <Circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <Circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />

                {/* Axis Lines */}
                <Line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <Line x1="50" y1="50" x2="84.6" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <Line x1="50" y1="50" x2="84.6" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <Line x1="50" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <Line x1="50" y1="50" x2="15.4" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                <Line x1="50" y1="50" x2="15.4" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

                {/* Polygon Stats Fill Area */}
                <Polygon
                  points={computeRadarPoints()}
                  fill="rgba(124, 58, 237, 0.3)"
                  stroke="#d2bbff"
                  strokeWidth="1.5"
                />
              </Svg>
            ) : (
              // Simple bar fallback if react-native-svg is missing
              <View style={styles.fallbackBarContainer}>
                <Text style={styles.fallbackText}>Ngữ pháp: {stats.grammar}%</Text>
                <Text style={styles.fallbackText}>Từ vựng: {stats.vocab}%</Text>
                <Text style={styles.fallbackText}>Nghe: {stats.listening}%</Text>
                <Text style={styles.fallbackText}>Đọc: {stats.reading}%</Text>
              </View>
            )}

            {/* Absolute Axis Labels */}
            <Text style={[styles.radarLabel, { top: -4, left: '50%', transform: [{ translateX: -30 }] }]}>Ngữ Pháp</Text>
            <Text style={[styles.radarLabel, { top: '25%', right: -12 }]}>Từ Vựng</Text>
            <Text style={[styles.radarLabel, { bottom: '25%', right: -12 }]}>Nghe</Text>
            <Text style={[styles.radarLabel, { bottom: -4, left: '50%', transform: [{ translateX: -15 }] }]}>Đọc</Text>
            <Text style={[styles.radarLabel, { bottom: '25%', left: -16 }]}>Phát Âm</Text>
            <Text style={[styles.radarLabel, { top: '25%', left: -12 }]}>Tốc Độ</Text>
          </View>

          {/* Analysis Tags */}
          <View style={styles.analysisTagsRow}>
            <View style={styles.tagStrong}>
              <Text style={styles.tagTextStrong}>📈 Mạnh: Ngữ Pháp</Text>
            </View>
            <View style={styles.tagWeak}>
              <Text style={styles.tagTextWeak}>📉 Yếu: Nghe</Text>
            </View>
          </View>
        </View>

        {/* Character Creation Section */}
        <View style={styles.characterSection}>
          <Text style={styles.sectionTitle}>Khởi tạo Anh Hùng</Text>
          
          {/* Avatar Selector Horizontal Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarList}
            snapToInterval={96}
            decelerationRate="fast"
          >
            {AVATAR_OPTIONS.map((item) => {
              const isSelected = selectedAvatar.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.avatarCard, isSelected && styles.avatarCardSelected]}
                  onPress={() => handleSelectAvatar(item)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={[styles.avatarImage, !isSelected && styles.avatarImageGray]}
                  />
                  <View style={styles.avatarOverlay} />
                  <Text style={[styles.avatarNameLabel, isSelected && styles.avatarNameLabelSelected]}>
                    {item.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Identity Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>DANH XƯNG ANH HÙNG</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={characterName}
                onChangeText={setCharacterName}
                maxLength={30}
                placeholder="Nhập tên nhân vật..."
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </View>

          {/* Preview Card */}
          <View style={styles.glassPanelRow}>
            <View style={styles.previewAvatarContainer}>
              <Image source={{ uri: selectedAvatar.image }} style={styles.previewAvatar} />
            </View>
            <View style={styles.previewInfo}>
              <View style={styles.previewHeaderRow}>
                <Text style={styles.previewName}>{characterName || 'Chưa đặt tên'}</Text>
                <View style={styles.lvlBadge}>
                  <Text style={styles.lvlText}>LVL 1</Text>
                </View>
              </View>
              {/* Fake XP progress bar */}
              <View style={styles.xpBarBg}>
                <View style={styles.xpBarFill} />
              </View>
              <Text style={styles.previewDesc}>{selectedAvatar.title}</Text>
            </View>
          </View>
        </View>

        {/* CTA Launch Button */}
        <TouchableOpacity
          style={[styles.launchButton, submitting && styles.launchButtonDisabled]}
          onPress={handleStartAdventure}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.launchButtonContent}>
              <Text style={styles.launchButtonText}>Bắt Đầu Cuộc Phiêu Lưu!</Text>
              <Text style={styles.launchIcon}>🚀</Text>
            </View>
          )}
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
    paddingVertical: 16,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d2bbff',
    textShadowColor: 'rgba(210, 187, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#292935',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  rankIcon: {
    fontSize: 16,
  },
  rankText: {
    color: '#ffb95f',
    fontSize: 14,
    fontWeight: '600',
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#ccc3d8',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontSize: 28,
    color: '#eaddff',
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 16,
  },
  radarContainer: {
    width: 220,
    height: 220,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radarSvg: {
    overflow: 'visible',
  },
  radarLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#ccc3d8',
    fontWeight: '500',
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
  analysisTagsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    marginTop: 8,
  },
  tagStrong: {
    backgroundColor: 'rgba(0, 118, 80, 0.15)',
    borderColor: 'rgba(78, 222, 163, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagTextStrong: {
    color: '#4edea3',
    fontSize: 13,
    fontWeight: '600',
  },
  tagWeak: {
    backgroundColor: 'rgba(147, 0, 10, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagTextWeak: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  characterSection: {
    gap: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e3e0f1',
    paddingLeft: 4,
  },
  avatarList: {
    gap: 12,
    paddingVertical: 4,
    paddingRight: 16,
  },
  avatarCard: {
    width: 80,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  avatarCardSelected: {
    borderColor: '#d2bbff',
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  avatarImageGray: {
    opacity: 0.6,
    tintColor: 'gray', // grayscale simulation in react native
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  avatarNameLabel: {
    position: 'absolute',
    bottom: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#ccc3d8',
    textAlign: 'center',
    width: '100%',
  },
  avatarNameLabelSelected: {
    color: '#d2bbff',
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    color: '#ccc3d8',
    fontWeight: '600',
    marginLeft: 4,
    letterSpacing: 1,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 48,
    color: '#d2bbff',
    fontSize: 16,
    fontWeight: '600',
  },
  editIcon: {
    position: 'absolute',
    right: 16,
    fontSize: 18,
    opacity: 0.6,
  },
  glassPanelRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewAvatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(210, 187, 255, 0.4)',
  },
  previewAvatar: {
    width: '100%',
    height: '100%',
  },
  previewInfo: {
    flex: 1,
    gap: 4,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d2bbff',
  },
  lvlBadge: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lvlText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  xpBarBg: {
    height: 6,
    backgroundColor: '#343440',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  xpBarFill: {
    width: '20%', // 20% mock initial progress
    height: '100%',
    backgroundColor: '#d2bbff',
  },
  previewDesc: {
    fontSize: 11,
    color: '#ccc3d8',
  },
  launchButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  launchButtonDisabled: {
    opacity: 0.6,
  },
  launchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  launchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  launchIcon: {
    fontSize: 18,
  },
});

// QuestDetailScreen.js
// This screen displays detailed information about a selected quest.
// It follows the glassmorphism dark theme and integrates with the existing navigation.

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Fallback secure store (same as HomeDashboardScreen)
import SecureStore from '../utils/storage';
import { showAlert } from '../utils/alertHelper';

import { BACKEND_URL } from '../config';

export default function QuestDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params || {};

  const [quest, setQuest] = useState(null);
  const [stamina, setStamina] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestDetailAndStamina();
  }, [questId]);

  const fetchQuestDetailAndStamina = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (!token) {
        throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }
      // 1. Fetch quest detail
      const response = await fetch(`${BACKEND_URL}/api/quests/${questId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Không thể tải chi tiết nhiệm vụ');
      }
      setQuest(result.data.quest);

      // 2. Fetch user profile for stamina
      const profileResponse = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileResult = await profileResponse.json();
      if (profileResponse.ok && profileResult.ok) {
        setStamina(profileResult.data.user.current_stamina);
      }
    } catch (err) {
      showAlert('Thất bại', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Đang tải chi tiết nhiệm vụ...</Text>
      </SafeAreaView>
    );
  }

  if (!quest) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy nhiệm vụ.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{quest.title}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        {/* Image */}
        {quest.image && (
          <Image source={{ uri: quest.image }} style={styles.image} resizeMode="cover" />
        )}
        {/* Details */}
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{quest.description}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Thưởng</Text>
          <Text style={styles.detailText}>XP: {quest.reward_xp} | KP: {quest.reward_kp}</Text>
        </View>
        {/* Action */}
        <TouchableOpacity 
          style={styles.startBtn} 
          onPress={() => {
            if (stamina <= 0) {
              showAlert('Không đủ Stamina', 'Năng lượng học tập (Stamina) của bạn đã hết. Vui lòng nghỉ ngơi để phục hồi.');
              return;
            }
            navigation.navigate('Quiz', { questId });
          }}
        >
          <Text style={styles.startBtnText}>Bắt đầu Quest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  errorText: {
    color: '#ff5555',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  backBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#d2bbff',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    color: '#ff5555',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#d2bbff',
    marginBottom: 8,
  },
  description: {
    color: '#F1F5F9',
    fontSize: 14,
    lineHeight: 20,
  },
  detailText: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});

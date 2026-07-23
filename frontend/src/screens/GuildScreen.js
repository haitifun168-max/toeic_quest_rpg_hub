import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

/**
 * GuildScreen — Bang Hội (placeholder "Sắp ra mắt").
 *
 * Guild là tính năng Phase 2 (quyết định của Kevin). Màn này giữ tab thứ 4 đúng
 * IA §10.2 để điều hướng khớp thiết kế, nhưng chỉ hiển thị trạng thái coming-soon
 * thay vì Alert chết như trước.
 */
export default function GuildScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('HomeDashboard')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bang Hội</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Coming soon */}
      <View style={styles.centerFill}>
        <Text style={styles.bigIcon}>🏰</Text>
        <Text style={styles.title}>Sắp Ra Mắt</Text>
        <Text style={styles.subtitle}>
          Hệ thống Bang Hội đang được rèn giũa. Sớm thôi, bạn sẽ có thể lập bang,
          chiêu mộ đồng đội và cùng nhau chinh phục các thử thách TOEIC.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PHASE 2</Text>
        </View>
      </View>

      {/* Bottom Bar Navigation — Guild active */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Trang Chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PvpLobby')}>
          <Text style={styles.navIcon}>⚔️</Text>
          <Text style={styles.navLabel}>PvP Battle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SkillTreeMap')}>
          <Text style={styles.navIcon}>🌳</Text>
          <Text style={styles.navLabel}>Skill Tree</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navIcon, styles.activeNavText]}>👥</Text>
          <Text style={[styles.navLabel, styles.activeNavText]}>Guild</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CharacterProfile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Hồ Sơ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#d2bbff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d2bbff',
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  bigIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  badgeText: {
    color: '#d2bbff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
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
});

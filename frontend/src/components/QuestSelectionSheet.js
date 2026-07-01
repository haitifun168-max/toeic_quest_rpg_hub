/**
 * QuestSelectionSheet.js
 * Story 2-2: Chọn nhiệm vụ học tập (Quest Selection)
 *
 * Bottom Sheet với Glassmorphism nền tối cao cấp HSL.
 * Sử dụng React Native built-in Modal (tương thích React 19, iOS, Android, Web).
 * Hỗ trợ Safe Area insets, responsive cross-platform.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

// Safe Area fallback — hoạt động dù có hay không có react-native-safe-area-context
let useSafeAreaInsets;
try {
  useSafeAreaInsets = require('react-native-safe-area-context').useSafeAreaInsets;
} catch (_) {
  useSafeAreaInsets = () => ({ bottom: 0, top: 0, left: 0, right: 0 });
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Trả về emoji icon tương ứng với loại quest.
 * @param {string} type - quest_type từ API
 * @returns {string} emoji icon
 */
const getQuestIcon = (type) => {
  switch (type) {
    case 'vocab':      return '📖';
    case 'listening':  return '🎧';
    case 'pvp':        return '⚔️';
    case 'grammar':    return '✏️';
    case 'reading':    return '📄';
    default:           return '⚡';
  }
};

/**
 * Trả về màu accent theo loại quest.
 * @param {string} type
 * @returns {string} hex color
 */
const getQuestAccentColor = (type) => {
  switch (type) {
    case 'vocab':      return '#a78bfa';
    case 'listening':  return '#38bdf8';
    case 'pvp':        return '#f87171';
    case 'grammar':    return '#4ade80';
    case 'reading':    return '#fb923c';
    default:           return '#d2bbff';
  }
};

/**
 * QuestSelectionSheet — Bottom Sheet lựa chọn nhiệm vụ học tập.
 *
 * Props:
 *   visible   {boolean}          - Điều khiển hiển thị/ẩn bottom sheet
 *   onClose   {function}         - Callback đóng sheet
 *   quests    {Array}            - Danh sách quest từ state của HomeDashboardScreen
 *   onSelect  {function(quest)}  - Callback khi người dùng chọn một quest
 */
export default function QuestSelectionSheet({ visible, onClose, quests, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Slide-in animation khi visible thay đổi
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = (quest) => {
    setSelectedId(quest.id);
    setTimeout(() => {
      setSelectedId(null);
      if (onSelect) onSelect(quest);
    }, 150);
  };

  const handleClose = () => {
    setSelectedId(null);
    if (onClose) onClose();
  };

  // Padding bottom an toàn: ưu tiên Safe Area, fallback cho Web/Android
  const safeBottom = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 20 : 16);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      testID="quest-selection-sheet-modal"
      accessibilityViewIsModal
    >
      {/* Backdrop overlay */}
      <TouchableWithoutFeedback onPress={handleClose} accessibilityLabel="Đóng danh sách nhiệm vụ">
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet Container — slide animation */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: safeBottom + 8 },
          { transform: [{ translateY: slideAnim }] },
        ]}
        accessibilityRole="menu"
        accessibilityLabel="Danh sách nhiệm vụ hôm nay"
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle} accessibilityElementsHidden />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎯 NHIỆM VỤ HÔM NAY</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            accessibilityLabel="Đóng danh sách nhiệm vụ"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quest List */}
        {quests && quests.length > 0 ? (
          quests.map((quest) => {
            const accentColor = getQuestAccentColor(quest.quest_type);
            const isSelected = selectedId === quest.id;
            return (
              <TouchableOpacity
                key={quest.id}
                style={[
                  styles.questCard,
                  { borderLeftColor: accentColor },
                  isSelected && styles.questCardSelected,
                ]}
                onPress={() => handleSelect(quest)}
                activeOpacity={0.75}
                accessibilityLabel={`Chọn nhiệm vụ ${quest.title}, thời gian ${quest.estimatedTime || '15 phút'}, thưởng ${quest.kpReward || 20} KP`}
                accessibilityRole="menuitem"
                testID={`quest-item-${quest.id}`}
              >
                {/* Icon */}
                <View style={[styles.iconBg, { backgroundColor: `${accentColor}22` }]}>
                  <Text style={styles.iconText}>{getQuestIcon(quest.quest_type)}</Text>
                </View>

                {/* Info */}
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle} numberOfLines={1}>
                    {quest.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaTime}>⏱ {quest.estimatedTime || '15 phút'}</Text>
                    <View style={styles.kpBadge}>
                      <Text style={[styles.kpText, { color: accentColor }]}>
                        +{quest.kpReward || 20} KP
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Arrow */}
                <Text style={[styles.arrow, { color: accentColor }]}>›</Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Hôm nay không có nhiệm vụ nào.</Text>
            <Text style={styles.emptySubText}>Hãy quay lại vào ngày mai!</Text>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Full-screen backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },

  // Glass sheet — nền tối cao cấp với border glow
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'hsl(240, 20%, 11%)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(210, 187, 255, 0.25)',
    paddingHorizontal: 16,
    paddingTop: 12,
    // Shadow/glow trên Web
    ...(Platform.OS === 'web' && {
      boxShadow: '0 -8px 40px rgba(124, 58, 237, 0.25)',
      maxWidth: 480,
      left: '50%',
      right: 'auto',
      transform: [{ translateX: '-50%' }],
    }),
    // Shadow trên native
    ...(Platform.OS !== 'web' && {
      shadowColor: '#7c3aed',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 12,
    }),
  },

  // Drag handle
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(210, 187, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Header row
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#d2bbff',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },

  // Quest Card — glassmorphism với border-left accent
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  questCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },

  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },

  questInfo: {
    flex: 1,
    gap: 4,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  kpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  kpText: {
    fontSize: 11,
    fontWeight: '700',
  },

  arrow: {
    fontSize: 22,
    fontWeight: '300',
    opacity: 0.7,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 12,
    color: '#64748B',
  },
});

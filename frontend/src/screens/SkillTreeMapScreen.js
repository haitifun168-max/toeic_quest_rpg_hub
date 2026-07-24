import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';

import SecureStore from '../utils/storage';
import { BACKEND_URL } from '../config';

// Mô tả nội dung học của từng node (client-side, khớp seed migration 11).
// Backend chỉ trả label/branch/status; phần mô tả gợi ý học đặt ở đây cho gọn.
const NODE_DETAILS = {
  START: 'Điểm khởi đầu hành trình TOEIC. Hoàn thành bài kiểm tra đầu vào để mở khóa 2 nhánh Nghe và Đọc.',
  'R-01': 'Nền tảng ngữ pháp Part 5: thì động từ, giới từ, liên từ. Xây móng vững trước khi vào từ vựng.',
  'L-01': 'Nền tảng nghe hiểu Part 1: mô tả tranh, nhận diện âm và từ khóa cơ bản.',
  'R-02': 'Mở rộng vốn từ vựng Part 5-6: từ đồng nghĩa, cụm từ cố định (collocations) hay gặp.',
  'L-02': 'Luyện nghe câu hỏi - đáp Part 2: nhận diện dạng câu hỏi Wh-, Yes/No và bẫy đồng âm.',
  'R-03': 'Đọc hiểu đoạn văn Part 7: kỹ thuật scan, skim và tìm ý chính, suy luận.',
  'L-03': 'Nghe hội thoại và bài nói Part 3-4: bắt ý chính, chi tiết và mục đích người nói.',
  'R-STAR': 'Thử thách trùm nhánh Đọc: bài test tổng hợp Part 5-7 áp lực thời gian.',
  'L-STAR': 'Thử thách trùm nhánh Nghe: bài test tổng hợp Part 1-4 tốc độ cao.',
  BOSS: 'Trận chiến cuối: full mock test mô phỏng kỳ thi TOEIC thật để chinh phục danh hiệu Champion.',
};

const STATUS_LABEL = {
  completed: 'Đã hoàn thành',
  active: 'Đang mở khóa',
  locked: 'Chưa mở khóa',
};

/**
 * SkillTreeMapScreen — Lộ Trình Kỹ Năng (IA §10.2)
 *
 * Node là dữ liệu ĐỘNG từ GET /api/skill-tree. Backend suy trạng thái mỗi node
 * theo RANK người dùng (quyết định của Kevin):
 *   completed (vàng, ✓) | active (xanh, ▶ + pulse) | locked (xám, 🔒)
 *
 * Node được xếp thành 2 nhánh song song (Reading / Listening) theo tier, phần
 * lõi (start / final boss) canh giữa — bám bố cục mockup skill_tree_map.
 */

// Bảng màu theo trạng thái, khớp mockup (gold-active / success-green / locked-gray).
const STATUS_STYLE = {
  completed: {
    bg: '#F59E0B',
    border: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.6)',
    text: '#ffffff',
    symbol: '✓',
  },
  active: {
    bg: 'rgba(16, 185, 129, 0.15)',
    border: '#10B981',
    glow: 'rgba(16, 185, 129, 0.6)',
    text: '#10B981',
    symbol: '▶',
  },
  locked: {
    bg: '#343440',
    border: 'rgba(255, 255, 255, 0.15)',
    glow: 'transparent',
    text: '#94A3B8',
    symbol: '🔒',
  },
};

function SkillNode({ node, onPress }) {
  const s = STATUS_STYLE[node.status] || STATUS_STYLE.locked;
  const isBoss = node.nodeType === 'boss' || node.nodeType === 'final_boss';
  const size = node.nodeType === 'final_boss' ? 76 : isBoss ? 60 : 54;

  return (
    <TouchableOpacity
      style={styles.nodeWrap}
      onPress={() => onPress(node)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${node.label}, ${STATUS_LABEL[node.status] || ''}`}
    >
      <View
        style={[
          styles.node,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: s.bg,
            borderColor: s.border,
            shadowColor: s.glow,
          },
          node.status !== 'locked' && styles.nodeGlow,
        ]}
      >
        <Text style={[styles.nodeSymbol, { color: s.text }]}>{s.symbol}</Text>
      </View>
      <Text
        style={[
          styles.nodeLabel,
          node.status === 'locked' && styles.nodeLabelMuted,
        ]}
        numberOfLines={2}
      >
        {node.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function SkillTreeMapScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tree, setTree] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    fetchSkillTree();
  }, []);

  const fetchSkillTree = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await SecureStore.getItemAsync('user_token');
      const res = await fetch(`${BACKEND_URL}/api/skill-tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok && result.ok) {
        setTree(result.data);
      } else {
        setError(result.error?.message || 'Không thể tải Lộ Trình Kỹ Năng');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gom node theo tier để dựng các hàng từ trên (boss) xuống dưới (xuất phát).
  const renderRows = () => {
    if (!tree || !tree.nodes) return null;
    const byTier = {};
    tree.nodes.forEach((n) => {
      if (!byTier[n.tier]) byTier[n.tier] = [];
      byTier[n.tier].push(n);
    });
    const tiers = Object.keys(byTier)
      .map(Number)
      .sort((a, b) => b - a); // tier cao (boss) vẽ trước, xuất phát cuối

    return tiers.map((tier) => {
      const row = byTier[tier];
      const core = row.filter((n) => n.branch === 'core');
      const reading = row.filter((n) => n.branch === 'reading');
      const listening = row.filter((n) => n.branch === 'listening');

      if (core.length > 0) {
        // Hàng lõi (xuất phát / final boss): canh giữa
        return (
          <View key={tier} style={styles.rowCenter}>
            {core.map((n) => (
              <SkillNode key={n.id} node={n} onPress={setSelectedNode} />
            ))}
          </View>
        );
      }

      // Hàng hai nhánh: Listening trái, Reading phải (bám mockup)
      return (
        <View key={tier} style={styles.rowSplit}>
          <View style={styles.branchCol}>
            {listening.map((n) => (
              <SkillNode key={n.id} node={n} onPress={setSelectedNode} />
            ))}
          </View>
          <View style={styles.branchCol}>
            {reading.map((n) => (
              <SkillNode key={n.id} node={n} onPress={setSelectedNode} />
            ))}
          </View>
        </View>
      );
    });
  };

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
        <Text style={styles.headerTitle}>Lộ Trình Kỹ Năng</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color="#d2bbff" />
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSkillTree}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Rank hiện tại */}
          <View style={styles.rankBanner}>
            <Text style={styles.rankIcon}>{tree.rankIcon}</Text>
            <View>
              <Text style={styles.rankLabel}>Hạng hiện tại</Text>
              <Text style={styles.rankName}>{tree.rankName}</Text>
            </View>
            <Text style={styles.kpText}>{tree.totalKp} KP</Text>
          </View>

          {/* Nhãn 2 nhánh */}
          <View style={styles.pathLabels}>
            <Text style={styles.pathLabelListening}>Listening Path</Text>
            <Text style={styles.pathLabelReading}>Reading Path</Text>
          </View>

          <ScrollView contentContainerStyle={styles.mapBody}>
            {renderRows()}
          </ScrollView>
        </>
      )}

      {/* Node detail modal */}
      <Modal
        visible={!!selectedNode}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNode(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedNode(null)}
        >
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            {selectedNode && (
              <>
                <View
                  style={[
                    styles.modalBadge,
                    { borderColor: (STATUS_STYLE[selectedNode.status] || STATUS_STYLE.locked).border },
                  ]}
                >
                  <Text style={styles.modalBadgeSymbol}>
                    {(STATUS_STYLE[selectedNode.status] || STATUS_STYLE.locked).symbol}
                  </Text>
                </View>
                <Text style={styles.modalTitle}>{selectedNode.label}</Text>
                <Text
                  style={[
                    styles.modalStatus,
                    { color: (STATUS_STYLE[selectedNode.status] || STATUS_STYLE.locked).border },
                  ]}
                >
                  {STATUS_LABEL[selectedNode.status] || 'Chưa mở khóa'}
                </Text>
                <Text style={styles.modalDesc}>
                  {NODE_DETAILS[selectedNode.id] || 'Nội dung học của node này sẽ sớm được cập nhật.'}
                </Text>
                <Text style={styles.modalMeta}>
                  Yêu cầu mở khóa: Rank {selectedNode.unlockRank}
                </Text>
                {selectedNode.status === 'locked' ? (
                  <View style={[styles.modalActionBtn, styles.modalActionBtnLocked]}>
                    <Text style={styles.modalActionTextLocked}>
                      🔒 Đạt Rank {selectedNode.unlockRank} để mở khóa
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={() => {
                      setSelectedNode(null);
                      navigation.navigate('HomeDashboard');
                    }}
                  >
                    <Text style={styles.modalActionText}>Bắt đầu học nhiệm vụ hôm nay</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedNode(null)}
                >
                  <Text style={styles.modalCloseText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Bar Navigation — Skill Tree active */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Trang Chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PvpLobby')}>
          <Text style={styles.navIcon}>⚔️</Text>
          <Text style={styles.navLabel}>PvP Battle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navIcon, styles.activeNavText]}>🌳</Text>
          <Text style={[styles.navLabel, styles.activeNavText]}>Skill Tree</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guild')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Guild</Text>
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
    padding: 24,
  },
  errorText: {
    color: '#ffb4ab',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: 'rgba(210, 187, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#d2bbff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#d2bbff',
    fontWeight: '700',
  },
  rankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  rankIcon: {
    fontSize: 28,
  },
  rankLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  rankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  kpText: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  pathLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  pathLabelListening: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d2bbff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pathLabelReading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4edea3',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mapBody: {
    paddingTop: 24,
    paddingBottom: 96,
    paddingHorizontal: 16,
    gap: 36,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  branchCol: {
    width: '48%',
    alignItems: 'center',
  },
  nodeWrap: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  nodeGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  nodeSymbol: {
    fontSize: 20,
    fontWeight: '700',
  },
  nodeLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#e3e0f1',
    textAlign: 'center',
    maxWidth: 96,
  },
  nodeLabelMuted: {
    color: '#94A3B8',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1c1c2b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 24,
    alignItems: 'center',
  },
  modalBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalBadgeSymbol: {
    fontSize: 26,
    color: '#f8fafc',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F1F5F9',
    textAlign: 'center',
  },
  modalStatus: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 14,
  },
  modalMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 12,
  },
  modalActionBtn: {
    marginTop: 20,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalActionBtnLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalActionText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  modalActionTextLocked: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 13,
  },
  modalCloseBtn: {
    marginTop: 10,
    paddingVertical: 8,
  },
  modalCloseText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});

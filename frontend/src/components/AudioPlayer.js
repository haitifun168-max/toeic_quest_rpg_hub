/**
 * AudioPlayer.js
 * Component trình phát âm thanh cho các bài nghe TOEIC Listening (Part 1 - 4).
 *
 * Phát audio THẬT bằng Text-To-Speech (không cần file audio đi kèm):
 *   - Web  : Web Speech API (window.speechSynthesis) — có sẵn trình duyệt.
 *   - Native: expo-speech nếu cài đặt được; nếu không, nút phát bị vô hiệu hóa
 *             kèm thông báo thay vì giả lập.
 *
 * Ưu tiên đọc `text` (transcript câu nghe). Hỗ trợ Play/Pause, Replay và đổi
 * tốc độ đọc (1x / 1.25x / 1.5x) đúng FR-5.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

// Nạp expo-speech (native) một cách an toàn — không vỡ nếu chưa cài.
let ExpoSpeech = null;
if (Platform.OS !== 'web') {
  try {
    ExpoSpeech = require('expo-speech');
  } catch (e) {
    ExpoSpeech = null;
  }
}

const SPEEDS = [1.0, 1.25, 1.5];

export default function AudioPlayer({ text, title = 'Nội dung bài nghe TOEIC' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const speedRef = useRef(playbackSpeed);
  speedRef.current = playbackSpeed;

  const webUtteranceRef = useRef(null);

  // Web Speech khả dụng?
  const webSpeechAvailable =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined';

  const canPlay = !!text && (webSpeechAvailable || !!ExpoSpeech);

  const stop = () => {
    if (webSpeechAvailable) {
      window.speechSynthesis.cancel();
    } else if (ExpoSpeech) {
      ExpoSpeech.stop();
    }
    setIsPlaying(false);
  };

  // Dừng đọc khi đổi câu (text thay đổi) hoặc unmount.
  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const play = () => {
    if (!canPlay) return;

    if (webSpeechAvailable) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speedRef.current;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      webUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else if (ExpoSpeech) {
      ExpoSpeech.stop();
      ExpoSpeech.speak(text, {
        language: 'en-US',
        rate: speedRef.current,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  const changeSpeed = () => {
    const nextIndex = (SPEEDS.indexOf(playbackSpeed) + 1) % SPEEDS.length;
    const newSpeed = SPEEDS[nextIndex];
    setPlaybackSpeed(newSpeed);
    // Nếu đang đọc, phát lại với tốc độ mới.
    if (isPlaying) {
      stop();
      // speedRef cập nhật ở lần render kế; dùng giá trị mới trực tiếp.
      speedRef.current = newSpeed;
      setTimeout(play, 50);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>🎧</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle}>
            {!canPlay
              ? 'Trình phát âm thanh không khả dụng trên thiết bị này'
              : isPlaying
              ? `Đang phát (${playbackSpeed}x)`
              : 'Nhấn để nghe'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.speedBtn, !canPlay && styles.disabled]}
          onPress={changeSpeed}
          disabled={!canPlay}
        >
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.replayBtn, !canPlay && styles.disabled]}
          onPress={play}
          disabled={!canPlay}
        >
          <Text style={styles.replayBtnText}>↻ Nghe lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, !canPlay && styles.disabled]}
          onPress={togglePlay}
          disabled={!canPlay}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <View style={styles.replayBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconBadgeText: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  speedBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  speedText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  replayBtn: {
    minWidth: 90,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  replayBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

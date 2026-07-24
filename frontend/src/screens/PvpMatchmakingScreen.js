/**
 * PvpMatchmakingScreen.js
 * Màn hình chờ ghép cặp đấu PvP Ranked.
 * Tích hợp kết nối Socket.io thời gian thực và đếm ngược 15 giây.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';

import SecureStore from '../utils/storage';
import { showAlert } from '../utils/alertHelper';

import { BACKEND_URL } from '../config';

export default function PvpMatchmakingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { elo } = route.params || { elo: 1000 };

  const [statusText, setStatusText] = useState('Đang kết nối đấu trường...');
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  const socketRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    // Spin animation for circular loader
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Establish WebSocket Connection
    connectToMatchmaking();

    // Local timer to keep track of elapsed seconds
    timerRef.current = setInterval(() => {
      setSecondsWaiting(prev => {
        const nextSec = prev + 1;
        if (nextSec >= 15) {
          setStatusText('Đang khởi tạo trận đấu giả lập...');
        }
        return nextSec;
      });
    }, 1000);

    return () => {
      // Cleanup WebSocket and timer
      if (timerRef.current) clearInterval(timerRef.current);
      if (socketRef.current) {
        socketRef.current.emit('leaveMatchmaking');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectToMatchmaking = async () => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      
      // Establish Socket connection
      const socket = io(BACKEND_URL, {
        transports: ['polling', 'websocket'],
        forceNew: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setStatusText('Đang tìm kiếm đối thủ xứng tầm...');
        socket.emit('joinMatchmaking', { token });
      });

      socket.on('matchmakingJoined', () => {
        console.log('[Matchmaking] Joined queue successfully.');
      });

      socket.on('matchmakingError', (data) => {
        showAlert('Lỗi ghép trận', data.message, () => {
          navigation.goBack();
        });
      });

      socket.on('matchFound', (data) => {
        // Match found!
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Navigate to Battle Screen with the active socket still joined to the room
        const battleSocket = socketRef.current;
        socketRef.current = null;
        navigation.navigate('PvpBattle', {
          roomId: data.roomId,
          isBotMatch: data.isBotMatch,
          players: data.players,
          existingSocket: battleSocket
        });
      });

      socket.on('connect_error', (err) => {
        console.log('Socket.io connection error, utilizing local BOT fallback:', err.message);
        // Utilise local offline fallback for visual testing
        setStatusText('Môi trường Offline - Đang ghép với BOT...');
        
        // Simulate BOT matching after 3 seconds for seamless visual audit
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          navigation.navigate('PvpBattle', {
            roomId: 'offline_mock_room',
            isBotMatch: true,
            players: {
              playerA: { id: 'offline_player', elo: elo },
              playerB: { id: 'bot_opponent_id', display_name: 'Phù Thủy Từ Vựng (BOT)', avatar_id: 'mage', elo: elo + 20, isBot: true }
            }
          });
        }, 3000);
      });

    } catch (err) {
      console.log('Matchmaking connect err:', err.message);
    }
  };

  const handleCancel = () => {
    if (socketRef.current) {
      socketRef.current.emit('leaveMatchmaking');
      socketRef.current.disconnect();
    }
    navigation.goBack();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Animated Loader Circle */}
        <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]}>
          <View style={styles.loaderInner} />
        </Animated.View>

        <Text style={styles.heading}>ĐANG GHÉP CẶP</Text>
        <Text style={styles.subText}>{statusText}</Text>
        <Text style={styles.timerText}>{secondsWaiting} giây</Text>
        <Text style={styles.eloRangeText}>Phạm vi ELO: ±100</Text>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>HỦY TÌM TRẬN</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  loader: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#7c3aed',
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loaderInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: '#c084fc',
    borderBottomColor: 'transparent',
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  subText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fb923c',
  },
  eloRangeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  cancelBtn: {
    marginTop: 32,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: '#f87171',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

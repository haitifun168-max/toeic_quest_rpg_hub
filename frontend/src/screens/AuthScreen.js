import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import SecureStore from '../utils/storage';

import { BACKEND_URL } from '../config'; // Default API Host

/**
 * Cross-platform alert helper: uses window.alert on web, Alert.alert on native
 */
function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    // Web: use native browser alert/confirm
    window.alert(`${title}\n\n${message}`);
    // auto-call the first button's onPress if available
    if (buttons && buttons[0] && buttons[0].onPress) {
      buttons[0].onPress();
    }
  } else {
    Alert.alert(title, message, buttons);
  }
}

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation: minimum 8 characters, at least 1 uppercase, 1 special character
  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(pass);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu');
      return;
    }

    if (!isLogin && !displayName) {
      showAlert('Lỗi', 'Vui lòng nhập Tên hiển thị');
      return;
    }

    if (!isLogin && !validatePassword(password)) {
      showAlert(
        'Mật khẩu không hợp lệ',
        'Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ hoa, và 1 ký tự đặc biệt'
      );
      return;
    }

    setLoading(true);
    let endpoint = '';
    let body = {};
    try {
      endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      body = isLogin 
        ? { email, password } 
        : { displayName, email, password };

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Đã có lỗi xảy ra');
      }

      if (!isLogin) {
        // Đăng ký thành công -> Chuyển sang màn đăng nhập
        showAlert(
          'Đăng ký thành công',
          'Tài khoản của bạn đã được khởi tạo thành công! Hãy nhập lại mật khẩu để đăng nhập.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setIsLogin(true); // Chuyển sang tab Đăng nhập
                setPassword('');  // Xóa mật khẩu để nhập lại
              } 
            }
          ]
        );
      } else {
        // Đăng nhập thành công -> Chuyển vào MainHub
        const { token, user } = result.data;
        
        // Save Token securely
        await SecureStore.setItemAsync('user_token', token);
        await SecureStore.setItemAsync('user_profile', JSON.stringify(user));

        showAlert(
          'Đăng nhập thành công',
          `Chào mừng ${user.display_name} đến với TOEIC Quest!`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (navigation) {
                  navigation.replace('MainHub');
                } else {
                  console.log('Navigation trigger: MainHub');
                }
              } 
            }
          ]
        );
      }
    } catch (error) {
      console.error('=== AUTH ERROR ===');
      console.error('endpoint:', endpoint);
      console.error('body:', JSON.stringify(body));
      console.error('error name:', error.name);
      console.error('error message:', error.message);
      console.error('error stack:', error.stack);
      showAlert('Thất bại', error.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    try {
      // Simulate mobile local OAuth login returning user info
      const mockEmail = `${provider}.user@gmail.com`;
      const mockName = `${provider === 'google' ? 'Google' : 'Facebook'} Challenger`;

      const response = await fetch(`${BACKEND_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mockEmail,
          displayName: mockName,
          provider
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'OAuth2 authentication failed');
      }

      const { token, user } = result.data;
      await SecureStore.setItemAsync('user_token', token);
      await SecureStore.setItemAsync('user_profile', JSON.stringify(user));

      showAlert(
        'Liên kết thành công',
        `Đăng nhập qua ${provider === 'google' ? 'Google' : 'Facebook'} thành công!`,
        [
          { text: 'Bắt đầu', onPress: () => navigation?.replace('MainHub') }
        ]
      );
    } catch (error) {
      showAlert('Thất bại', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>TOEIC QUEST</Text>
            <Text style={styles.subtitle}>Chinh phục đỉnh cao tri thức</Text>
          </View>

          {/* Glass Panel */}
          <View style={styles.glassPanel}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, isLogin && styles.activeTabButton]} 
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, !isLogin && styles.activeTabButton]} 
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Tên hiển thị</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Hiệp sĩ TOEIC"
                      placeholderTextColor="#958da1"
                      value={displayName}
                      onChangeText={setDisplayName}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="example@gmail.com"
                    placeholderTextColor="#958da1"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#958da1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
                {!isLogin && (
                  <Text style={styles.passwordHint}>
                    ≥ 8 ký tự · 1 chữ hoa (A-Z) · 1 ký tự đặc biệt (!@#$%...)
                  </Text>
                )}
              </View>

              {/* Submit CTA */}
              <TouchableOpacity style={styles.submitButton} onPress={handleAuth} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#3f008e" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Forgot Password (Login mode only) */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Authentication */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuth('google')} disabled={loading}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoeIgqPK92DWG4iiKk0UaT4rnZUZr9De8mUQurzGIGovyXSRzEbQFk2v5U5L3zexGpPeAaoLL-_wkMm22AztDHGiBGZunDagCKnHn8ERNXfbBOfHnGM4wLxkdzOkGUQSw7jxUExKVcwRHhwqC9m1DsQRWOyW3eIzDWbmmUt9vOJiYRNKOGkU8i6aTRq6-d-KT9_h_amT6DP6BT1UBKGvOcKwyK7qPnTIded8k1C2lKzBz_RELL2jU_d2lRguQqfi-ZEhxWOA-eenJA' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuth('facebook')} disabled={loading}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcS7l9fiEFZkIFzFS8zCySul4Jgl-JfBShjnM9O1O_xx7XwFQW3g0GHVpUiF1VkeZFzYQG5mXii5hStRBuBsrY0oXged-mIZPgef_8p2BX6mu07KtI7hg6TQ1y1U526kbM6abX1F_ED8TZozpTNVw_qOpFxMXPW4gnl-3HlA84crGW3imMCR8_j6lif50jjI8HlkfhTYg507ouKQPbpDv_Jh7Nf5y4GNe0iIoqHrHXeBtBtK0h-COY1HxDLj_tLD-ORfCoYohTNyX6' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Note */}
          <Text style={styles.footerText}>
            Bằng cách tiếp tục, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi.
          </Text>

          {/* Hiển thị URL Backend để debug */}
          <Text style={[styles.footerText, { color: '#7c3aed', marginTop: 10, fontWeight: 'bold' }]}>
            Đang kết nối: {BACKEND_URL}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121d',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#d2bbff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc3d8',
    marginTop: 6,
  },
  glassPanel: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#d2bbff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc3d8',
  },
  activeTabText: {
    color: '#d2bbff',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#ccc3d8',
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#e3e0f1',
    fontSize: 14,
  },
  passwordHint: {
    fontSize: 11,
    color: '#a78fd4',
    marginTop: 6,
    paddingLeft: 4,
    opacity: 0.9,
  },
  eyeButton: {
    padding: 4,
  },
  eyeText: {
    color: '#d2bbff',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ede0ff',
  },
  forgotButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  forgotText: {
    fontSize: 12,
    color: '#d2bbff',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    fontSize: 12,
    color: '#ccc3d8',
    marginHorizontal: 12,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  socialButtonText: {
    color: '#e3e0f1',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 11,
    color: '#ccc3d8',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
    lineHeight: 16,
    opacity: 0.7,
  },
});

import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';

const API = "http://192.168.0.102:5000/accounts";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const router = useRouter();

  const saveAuthData = async (token: string, userId: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    let valid = true;

    if (!email) {
      setEmailError('Vui lòng nhập email');
      valid = false;
    }
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      const { token, user } = res.data;

      await saveAuthData(token, user._id);

      router.push({
        pathname: '/(tabs)/home',
        params: { userId: user._id }
      });
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />

          <Text style={styles.title}>Chào mừng đến EduHub</Text>
          <Text style={styles.subtitle}>
            Truy cập hàng trăm khóa học lập trình từ cơ bản đến nâng cao
          </Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
              <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#1877F2' }]}
              onPress={() => alert('Login with Facebook')}
            >
              <FontAwesome name="facebook" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialCircle, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc' }]}
              onPress={() => alert('Login with Google')}
            >
              <FontAwesome name="google" size={28} color="#DB4437" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12121B' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 120, height: 120, borderRadius: 30, marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#B0B0FF', fontSize: 16, textAlign: 'center', marginVertical: 10, paddingHorizontal: 20 },
  form: { width: '100%', marginTop: 20 },
  input: {
    backgroundColor: '#1E1E2A',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerButton: { marginTop: 12, alignItems: 'center' },
  registerText: { color: '#6C63FF', fontWeight: '600' },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    gap: 16,
  },
  socialCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  errorText: { color: '#FF4D4F', marginBottom: 8, marginLeft: 12 },
});
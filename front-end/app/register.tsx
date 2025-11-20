import { API_BASE_URL } from '@/src/api';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_ACCOUNT = `${API_BASE_URL}/accounts`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const [sending, setSending] = useState(false);

  const sendOtp = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Vui lòng nhập họ tên');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email không hợp lệ');
      hasError = true;
    }
    const exists = await checkEmailExists();
    if (exists) {
      setEmailError("Email đã tồn tại");
      return;
    }
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
      hasError = true;
    }

    if (hasError) return;

    setSending(true);
    try {
      const res = await axios.post(`${API_ACCOUNT}/send-otp`, { email, type: 'register' });

      if (res.data.success) {
        Alert.alert('Đã gửi OTP', 'Kiểm tra email để nhận mã OTP');
        router.push({
          pathname: '/verify-otp',
          params: { name, email, password }
        });
      } else {
        setEmailError(res.data.message || 'Không thể gửi mã');
      }
    } catch (err: any) {
      setEmailError(err.response?.data?.message || 'Lỗi gửi mã');
    } finally {
      setSending(false);
    }
  };

  const checkEmailExists = async () => {
    const response = await axios.get(`${API_ACCOUNT}/check-email`, {
      params: { email }
    });
    return response.data.exists;
  };



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />

          <Text style={styles.title}>Đăng ký tài khoản EduHub</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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

            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

            <TouchableOpacity
              style={[styles.registerButton, sending && { opacity: 0.7 }]}
              onPress={sendOtp}
              disabled={sending}
            >
              {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Gửi OTP</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/login')} style={styles.registerButton1}>
              <Text style={styles.registerText}>Bạn đã có tài khoản? Đăng nhập ngay</Text>
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
  title: { color: '#fff', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  form: { width: '100%', alignItems: 'center' },
  input: {
    backgroundColor: '#1E1E2A',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 12,
    fontSize: 16,
    width: '100%',
  },
  registerButton1: { marginTop: 12, alignItems: 'center' },
  registerText: { color: '#6C63FF', fontWeight: '600' },
  registerButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  orText: { color: '#B0B0FF', fontWeight: '600', marginVertical: 12 },
  socialGroup: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 16 },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: { marginTop: 12, alignItems: 'center' },
  loginLinkText: { color: '#6C63FF', fontWeight: '600' },
  errorText: { color: 'red', marginBottom: 8, marginLeft: 10, alignSelf: 'flex-start' }
});

import { API_BASE_URL } from '@/src/api';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_ACCOUNT = `${API_BASE_URL}/accounts`;

export default function VerifyOtpScreen() {
    const params = useLocalSearchParams();
    const name = params.name;
    const email = params.email;
    const password = params.password;

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otpError, setOtpError] = useState('');

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setOtpError('Mã OTP phải đủ 6 chữ số');
            return;
        }
        setLoading(true);
        setOtpError('');
        try {
            const res = await axios.post(`${API_ACCOUNT}/verify-otp`, { email, otp });
            if (res.data.verified) {
                await axios.post(`${API_ACCOUNT}/register`, { name, email, password });
                Alert.alert('Thành công', 'Tài khoản đã được tạo!');
                router.replace('/login');
            } else {
                setOtpError(res.data.message || 'OTP không hợp lệ');
            }
        } catch (err: any) {
            setOtpError(err.response?.data?.message || 'Lỗi xác thực OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setResendLoading(true);
        try {
            await axios.post(`${API_ACCOUNT}/send-otp`, { email, type: 'register' });
            setCountdown(30);
        } catch (err: any) {
            Alert.alert('Lỗi', err.response?.data?.message || 'Không thể gửi OTP');
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Xác thực OTP</Text>
                <Text style={styles.subtitle}>
                    Mã xác thực đã được gửi đến email của bạn
                </Text>

                <TextInput
                    placeholder="Nhập mã OTP (6 số)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    maxLength={6}
                    value={otp}
                    onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                    style={[
                        styles.input,
                        otp.length > 0 && styles.inputWithSpacing,
                    ]}
                />

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Xác nhận OTP</Text>
                    )}
                </TouchableOpacity>

                {otpError !== '' && (
                    <Text style={styles.errorText}>{otpError}</Text>
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.resendButton,
                        (resendLoading || countdown > 0) && styles.disabledButton,
                    ]}
                    onPress={handleResendOtp}
                    disabled={resendLoading || countdown > 0}
                >
                    {resendLoading ? (
                        <ActivityIndicator color="#aaa" size="small" />
                    ) : countdown > 0 ? (
                        <Text style={[styles.buttonText, { color: '#aaa' }]}>
                            Đã gửi mã ({countdown})
                        </Text>
                    ) : (
                        <Text style={[styles.buttonText, { color: '#6C63FF' }]}>
                            Gửi lại mã OTP
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#0A0A0F',
        borderRadius: 24,
        padding: 32,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',

        elevation: 15,
    },
    errorText: {
        color: '#FF4B4B',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#B0B0FF',
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
    },
    input: {
        backgroundColor: '#1E1E2A',
        color: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 30,
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    inputWithSpacing: {
        letterSpacing: 8,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        minHeight: 56,
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#6C63FF',
    },
    resendButton: {
        backgroundColor: '#1E1E2A',
        borderWidth: 1,
        borderColor: '#333',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
});
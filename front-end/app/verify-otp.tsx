import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VerifyOtpScreen() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleResendOtp = () => {
        if (countdown > 0) return;

        setResendLoading(true);
        setCountdown(30);

        setTimeout(() => {
            setResendLoading(false);
        }, 1500);
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
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
                    onPress={() => {
                        setLoading(true);
                        setTimeout(() => setLoading(false), 2000);
                    }}
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Xác nhận OTP</Text>
                    )}
                </TouchableOpacity>

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
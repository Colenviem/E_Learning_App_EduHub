import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
    primary: '#2D67F6',
    success: '#5CB85C',
    textPrimary: '#333333',
    textSecondary: '#666666',
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
};

const FONT_SIZES = {
    title: 20,
    subtitle: 14,
    button: 16,
};

interface SuccessPaymentProps {
    onGoBack: () => void;
    onGoToSettings: () => void;
}


const SuccessPayment: React.FC<SuccessPaymentProps> = ({
    onGoBack,
    onGoToSettings,
}) => {
    const router = useRouter();

    const handleStartLearning = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={onGoBack} style={styles.headerIcon}>
                    <Icon name="chevron-left" size={30} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <TouchableOpacity onPress={onGoToSettings} style={styles.headerIcon}>
                    <Icon name="cog-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.iconWrapper}>
                    <Icon
                        name="check-circle-outline"
                        size={80}
                        color={COLORS.success}
                    />
                </View>

                <Text style={styles.title}>Thanh toán thành công!</Text>
                <Text style={styles.subtitle}>
                    Bạn đã đăng ký thành công gói Pro. Hãy bắt đầu học ngay để nâng cao trình độ.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleStartLearning}
                    activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Bắt đầu học ngay</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    headerIcon: {
        padding: 5,
    },

    cardContainer: {
        backgroundColor: COLORS.cardBackground,
        margin: 20,
        paddingHorizontal: 20,
        paddingVertical: 40,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconWrapper: {
        marginBottom: 25,
    },
    title: {
        fontSize: FONT_SIZES.title,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.subtitle,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
        lineHeight: 20,
    },

    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.background,
        fontSize: FONT_SIZES.button,
        fontWeight: '600',
    },

    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        padding: 5,
    }
});

export default SuccessPayment;
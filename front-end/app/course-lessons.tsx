import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';

import EnrollmentModal from '../src/components/EnrollmentModal';
import { Lesson, LessonItem } from '../src/components/LessonItem';
import PaymentModal from '../src/components/PaymentModal';

const { width } = Dimensions.get('window');

const COLORS = {
    background: '#FFFFFF',
    primary: '#A78BFA',
    secondary: '#C4B5FD',
    textPrimary: '#1E1E2A',
    textSecondary: '#6A6A6A',
    cardBg: '#F5F5F8',
    border: '#E0E0E0',
    star: '#FFC107',
    priceOriginal: '#E53935',
    heartActive: '#FF6B9D',
    success: '#4CAF50',
};

export default function SourceLesson() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [isEnrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState('premium');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;
    const heartScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        Animated.spring(tabAnim, {
            toValue: activeTab === 'lessons' ? 0 : 1,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

    const course = {
        id,
        name: 'Lớp học chính về React Native',
        image: 'https://i.imgur.com/gK2gYt9.png',
    };

    const lessons: Lesson[] = [
        { id: 'a', name: 'Giới thiệu về React Native', duration: 268 },
        { id: 'b', name: 'Cài đặt môi trường', duration: 377 },
        { id: 'c', name: 'Khởi tạo dự án', duration: 2638 },
        { id: 'd', name: 'Components và Props', duration: 900 },
    ];

    const handleGoBack = () => router.push('./home');

    const toggleFavorite = () => {
        Animated.sequence([
            Animated.spring(heartScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
            Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
        setIsFavorite((prev) => !prev);
    };

    const handleRegisterPress = () => setEnrollmentModalVisible(true);

    const handleConfirmEnrollment = () => {
        setEnrollmentModalVisible(false);
        setPaymentModalVisible(true);
    };

    const handlePaymentContinue = (paymentMethod: string) => {
        console.log(`Người dùng chọn gói: ${selectedPackage} và thanh toán bằng: ${paymentMethod}`);
        setPaymentModalVisible(false);
        // TODO: chuyển sang màn hình chi tiết thanh toán
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* Header */}
                <View style={[styles.lessonHeaderContainer, { backgroundColor: COLORS.primary }]}>
                    <View style={styles.lessonHeader}>
                        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
                            <FeatherIcon size={24} color={COLORS.background} name="arrow-left" />
                        </TouchableOpacity>
                        <Text style={styles.lessonCourseTitle} numberOfLines={1}>{course.name}</Text>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
                            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                <IonIcon size={24} color={isFavorite ? COLORS.heartActive : COLORS.background} name={isFavorite ? 'heart' : 'heart-outline'} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Animated.View style={[styles.courseImageWrapper, { opacity: fadeAnim }]}>
                        <Image source={{ uri: course.image }} style={styles.courseImage} resizeMode="cover" />
                    </Animated.View>

                    <View style={styles.detailsSection}>
                        <Text style={[styles.courseNameLarge, { color: COLORS.textPrimary }]}>{course.name}</Text>
                        <View style={styles.metaRow}>
                            <Text style={[styles.metaText, { color: COLORS.textSecondary }]}>6h 30 phút</Text>
                            <Text style={[styles.metaText, { color: COLORS.textSecondary }]}>• 28 bài học</Text>
                            <View style={styles.ratingWrapper}>
                                <IonIcon name="star" size={14} color={COLORS.star} />
                                <Text style={[styles.metaText, { color: COLORS.textSecondary, marginLeft: 2 }]}>4.9</Text>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity onPress={() => setActiveTab('lessons')} style={styles.tabItem}>
                            <Text style={activeTab === 'lessons' ? styles.tabTextActive : styles.tabTextInactive}>Bài học</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('description')} style={styles.tabItem}>
                            <Text style={activeTab === 'description' ? styles.tabTextActive : styles.tabTextInactive}>Mô tả</Text>
                        </TouchableOpacity>
                        <Animated.View
                            style={[styles.tabIndicator, {
                                transform: [{ translateX: tabAnim.interpolate({ inputRange: [0, 1], outputRange: [20, width / 2 + 10] }) }],
                            }]}
                        />
                    </View>
                    <View style={styles.tabDivider} />

                    {activeTab === 'lessons' ? (
                        <FlatList
                            data={lessons}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => <LessonItem lesson={item} index={index} />}
                            scrollEnabled={false}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.descriptionContentWrapper}>
                            <Text style={styles.descriptionText}>
                                Đây là khóa học React Native từ cơ bản đến nâng cao, giúp bạn xây dựng ứng dụng di động đa nền tảng với hiệu suất cao.
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.priceTextOriginal, { color: COLORS.textSecondary, textDecorationLine: 'line-through' }]}>499.000 VNĐ</Text>
                        <Text style={[styles.priceTextCurrent, { color: COLORS.primary }]}>299.000 VNĐ</Text>
                    </View>
                    <TouchableOpacity style={[styles.registerButton, { backgroundColor: COLORS.primary }]} onPress={handleRegisterPress}>
                        <Text style={styles.registerButtonText}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modals */}
            <EnrollmentModal
                visible={isEnrollmentModalVisible}
                selected={selectedPackage}
                onSelect={setSelectedPackage}
                onConfirm={handleConfirmEnrollment}
                onClose={() => setEnrollmentModalVisible(false)}
            />
            <PaymentModal
                visible={isPaymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                onContinue={handlePaymentContinue}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    lessonHeaderContainer: { paddingTop: 50, paddingBottom: 15, elevation: 4 },
    lessonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    lessonCourseTitle: { fontSize: 18, fontWeight: '700', color: COLORS.background, flex: 1, textAlign: 'center' },
    headerButton: { padding: 4 },
    courseImageWrapper: { paddingHorizontal: 20, paddingVertical: 15 },
    courseImage: { width: '100%', height: 180, borderRadius: 12, backgroundColor: COLORS.cardBg },
    detailsSection: { paddingHorizontal: 20, paddingVertical: 10 },
    courseNameLarge: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 14, fontWeight: '600' },
    ratingWrapper: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    tabBar: { flexDirection: 'row', paddingHorizontal: 20, position: 'relative', height: 40 },
    tabItem: { paddingVertical: 8, paddingHorizontal: 15, marginRight: 20 },
    tabTextActive: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
    tabTextInactive: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
    tabDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 20 },
    tabIndicator: { position: 'absolute', bottom: 0, width: 60, height: 3, borderRadius: 2, backgroundColor: COLORS.primary },
    listContent: { paddingHorizontal: 20, paddingTop: 10 },
    descriptionContentWrapper: { paddingHorizontal: 20, paddingVertical: 15 },
    descriptionText: { fontSize: 16, lineHeight: 24, color: COLORS.textPrimary },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: COLORS.border },
    priceContainer: { alignItems: 'flex-start' },
    priceTextOriginal: { fontSize: 14, fontWeight: '500' },
    priceTextCurrent: { fontSize: 22, fontWeight: '900' },
    registerButton: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
    registerButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '700' },
});

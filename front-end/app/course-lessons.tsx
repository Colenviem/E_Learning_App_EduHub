import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import axios from 'axios';

import EnrollmentModal from '../src/components/EnrollmentModal';
import { LessonItem } from '../src/components/LessonItem';
import PaymentModal from '../src/components/PaymentModal';

const API_COURSES = 'http://localhost:5000/courses';
const API_LESSONS = 'http://localhost:5000/lessons';

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
    heartActive: '#FF6B9D',
};

export default function SourceLesson() {
    const { courseId } = useLocalSearchParams();
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [isEnrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState('premium');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;

    // Fetch data
    const fetchCourses = useCallback(async () => {
        try {
        const res = await axios.get(API_COURSES);
        setCourses(res.data);
        } catch (err) {
        console.error('Lỗi lấy courses:', err);
        }
    }, []);

    const fetchLessons = useCallback(async () => {
        try {
        const res = await axios.get(API_LESSONS);
        setLessons(res.data);
        } catch (err) {
        console.error('Lỗi lấy lessons:', err);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
        fetchLessons();
    }, [fetchCourses, fetchLessons]);

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        Animated.spring(tabAnim, {
        toValue: activeTab === 'lessons' ? 0 : 1,
        useNativeDriver: true,
        }).start();
    }, [activeTab]);

    const handleGoBack = () => router.push('/home');

    const handleRegisterPress = () => setEnrollmentModalVisible(true);

    const handleConfirmEnrollment = () => {
        setEnrollmentModalVisible(false);
        setPaymentModalVisible(true);
    };

    const handlePaymentContinue = (paymentMethod: string) => {
        console.log(`Người dùng chọn gói: ${selectedPackage} và thanh toán bằng: ${paymentMethod}`);
        setPaymentModalVisible(false);
    };

    // Format thời gian: 520 -> "8h 40p"
    const formatTime = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ''}`;
        return `${minutes} phút`;
    };

    // Lấy đúng course đang chọn
    const currentCourse = courses.find((c) => c._id === courseId);
    const courseLessons = lessons.filter((l) => l.courseId === courseId);

    if (!currentCourse) {
        return (
        <View style={styles.loadingContainer}>
            <Text style={{ color: COLORS.textSecondary }}>Đang tải khóa học...</Text>
        </View>
        );
    }

    const totalMinutes = parseInt(String(currentCourse.time).replace(' phút', ''), 10) || 0;
    const displayTime = formatTime(totalMinutes);
    const finalPrice = currentCourse.price
        ? currentCourse.price * (1 - (currentCourse.discount || 0) / 100)
        : 0;

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
                <Text style={styles.lessonCourseTitle} numberOfLines={1}>
                {currentCourse.title}
                </Text>
            </View>
            </View>

            {/* Body */}
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image */}
            <Animated.View style={[styles.courseImageWrapper, { opacity: fadeAnim }]}>
                <Image
                source={{ uri: currentCourse.image }}
                style={styles.courseImage}
                resizeMode="cover"
                />
            </Animated.View>

            {/* Details */}
            <View style={styles.detailsSection}>
                <Text style={[styles.courseNameLarge, { color: COLORS.textPrimary }]}>
                {currentCourse.title}
                </Text>
                <View style={styles.metaRow}>
                <Text style={[styles.metaText, { color: COLORS.textSecondary }]}>{displayTime}</Text>
                <Text style={[styles.metaText, { color: COLORS.textSecondary }]}>
                    {currentCourse.numberOfLessons} bài học
                </Text>
                <View style={styles.ratingWrapper}>
                    <IonIcon name="star" size={14} color={COLORS.star} />
                    <Text
                    style={[
                        styles.metaText,
                        { color: COLORS.textSecondary, marginLeft: 2 },
                    ]}
                    >
                    {currentCourse.rating?.toFixed(1)}
                    </Text>
                </View>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => setActiveTab('lessons')} style={styles.tabItem}>
                <Text
                    style={
                    activeTab === 'lessons'
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }
                >
                    Bài học
                </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('description')} style={styles.tabItem}>
                <Text
                    style={
                    activeTab === 'description'
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }
                >
                    Mô tả
                </Text>
                </TouchableOpacity>
                <Animated.View
                style={[
                    styles.tabIndicator,
                    {
                    transform: [
                        {
                        translateX: tabAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, width / 2 + 10],
                        }),
                        },
                    ],
                    },
                ]}
                />
            </View>
            <View style={styles.tabDivider} />

            {/* Tab content */}
            {activeTab === 'lessons' ? (
                <FlatList
                data={courseLessons}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <LessonItem
                        lesson={item}
                        index={index}
                        onPress={() =>
                            router.push(`/lesson-details?lessonId=${item._id}`)
                        }
                    />
                )}
                />
            ) : (
                <View style={styles.descriptionContentWrapper}>
                <Text style={styles.descriptionText}>
                    {currentCourse.description ||
                    'Không có mô tả cho khóa học này.'}
                </Text>
                </View>
            )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
            <View style={styles.priceContainer}>
                {currentCourse.discount ? (
                <Text
                    style={[
                    styles.priceTextOriginal,
                    {
                        color: COLORS.textSecondary,
                        textDecorationLine: 'line-through',
                    },
                    ]}
                >
                    {currentCourse.price?.toLocaleString()}₫
                </Text>
                ) : null}
                <Text style={[styles.priceTextCurrent, { color: COLORS.primary }]}>
                {finalPrice ? `${finalPrice.toLocaleString()}₫` : 'Miễn phí'}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.registerButton, { backgroundColor: COLORS.primary }]}
                onPress={handleRegisterPress}
            >
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    lessonHeaderContainer: { paddingTop: 50, paddingBottom: 15, elevation: 4 },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    lessonCourseTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.background,
        flex: 1,
        textAlign: 'center',
    },
    headerButton: { padding: 4 },
    courseImageWrapper: { paddingHorizontal: 20, paddingVertical: 15 },
    courseImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        backgroundColor: COLORS.cardBg,
    },
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
    descriptionContentWrapper: { paddingHorizontal: 20, paddingVertical: 15 },
    descriptionText: { fontSize: 16, lineHeight: 24, color: COLORS.textPrimary },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    priceContainer: { alignItems: 'flex-start' },
    priceTextOriginal: { fontSize: 14, fontWeight: '500' },
    priceTextCurrent: { fontSize: 22, fontWeight: '900' },
    registerButton: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
    registerButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '700' },
});
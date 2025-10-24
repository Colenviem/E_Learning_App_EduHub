import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // <-- Đã thêm SafeAreaView
import { getCourseData } from '../(tabs)/index';
import RegistrationModal from '../../components/RegistrationModal';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

interface Course {
    id: string;
    title: string;
    lessons: number;
    duration: string;
    rating: number;
    imageUri: string;
}

interface Lesson {
    id: string;
    title: string;
    duration: string;
}

const mockLessons: Lesson[] = [
    { id: 'l1', title: 'Giới thiệu về React Native', duration: '04:28 phút' },
    { id: 'l2', title: 'Cài đặt môi trường', duration: '06:17 phút' },
    { id: 'l3', title: 'Khởi tạo dự án', duration: '43:58 phút' },
    { id: 'l4', title: 'Component và Props', duration: '15:30 phút' },
    { id: 'l5', title: 'Styling cơ bản', duration: '12:05 phút' },
];

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleRegister = (packageId: string) => {
        console.log(`Đăng ký khóa học ${course?.title} với gói: ${packageId}`);
        setIsModalVisible(false);

        router.push({
            pathname: '/CoursePayment',
            params: { id, packageId },
        });
    };


    const allCourses: Course[] = getCourseData();
    const course = allCourses.find(c => c.id === id);

    if (!course) {
        return (
            // Dùng SafeAreaView cho màn hình lỗi
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ padding: 20, color: colors.textPrimary }}>
                    Không tìm thấy khóa học này (ID: {id || 'Không có ID'}).
                </Text>
            </SafeAreaView>
        );
    }

    return (
        // BƯỚC 1: Dùng SafeAreaView bao ngoài cùng
        <SafeAreaView style={styles.safeAreaWrapper}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* BƯỚC 2: CUSTOM HEADER - Đưa ra ngoài ScrollView */}
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Overview</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="heart-outline" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                // BƯỚC 3: Xoá padding top thừa trong ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <Image
                    source={{ uri: course.imageUri.replace('/200/120', '/400/250') }}
                    style={styles.courseImage}
                    resizeMode="cover"
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.mainTitle}>{course.title}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{course.duration} • {course.lessons} bài học</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFC300" />
                            <Text style={styles.ratingText}>{course.rating}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('lessons')} style={[styles.tabButton, activeTab === 'lessons' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'lessons' && styles.activeTabText]}>Bài học</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('description')} style={[styles.tabButton, activeTab === 'description' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>Mô tả</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentSection}>
                    {activeTab === 'lessons' ? (
                        <View>
                            {mockLessons.map((lesson, index) => (
                                <View key={lesson.id} style={[styles.lessonItem, index === mockLessons.length - 1 && { borderBottomWidth: 0 }]}>
                                    <Ionicons name="play-circle-outline" size={20} color={colors.primaryBlue} />
                                    <View style={styles.lessonDetails}>
                                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.descriptionText}>
                            Đây là mô tả chi tiết về khóa học {course.title}. Khóa học này sẽ giúp bạn làm chủ các kiến thức nền tảng và nâng cao trong lĩnh vực lập trình di động, từ cơ bản đến nâng cao. Khóa học được thiết kế theo lộ trình rõ ràng, dễ hiểu và bao gồm nhiều bài tập thực hành.
                        </Text>
                    )}
                </View>
                {/* Giảm khoảng cách Spacer để tính toán cho Footer cố định */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* FOOTER - Cố định ở dưới cùng */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceOld}>499.000 VNĐ</Text>
                    <Text style={styles.priceNew}>299.000 VNĐ</Text>
                </View>
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.registerText}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL ĐĂNG KÝ */}
            {isModalVisible && course && (
                <RegistrationModal
                    onCancel={() => setIsModalVisible(false)}
                    onRegister={handleRegister}
                    courseTitle={course.title}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // STYLE MỚI CHO SAFEAREAVIEW
    safeAreaWrapper: {
        flex: 1,
        backgroundColor: colors.background,
    },
    // fullScreen đã bị loại bỏ vì được thay thế bằng safeAreaWrapper
    scrollContent: {
        // paddingBottom: spacing.md đã được thay thế bằng View height: 80
    },
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
        // Đã xóa paddingTop cố định (spacing.md + 10) để SafeAreaView xử lý
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: typography.body.fontSize,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    iconButton: {
    },
    courseImage: {
        width: '100%',
        height: 200,
    },
    infoContainer: {
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        ...typography.caption,
        color: colors.grayText,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        ...typography.caption,
        fontWeight: '600',
        marginLeft: 4,
        color: colors.textPrimary,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightBorder,
        marginHorizontal: spacing.screenPadding,
    },
    tabButton: {
        paddingVertical: spacing.sm,
        marginRight: spacing.lg,
    },
    tabText: {
        ...typography.body,
        fontSize: typography.body.fontSize,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primaryBlue,
    },
    activeTabText: {
        color: colors.primaryBlue,
        fontWeight: '700',
    },
    contentSection: {
        paddingHorizontal: spacing.screenPadding,
        paddingTop: spacing.md,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightBorder,
    },
    lessonDetails: {
        marginLeft: spacing.md,
    },
    lessonTitle: {
        ...typography.body,
        fontWeight: '500',
        fontSize: typography.body.fontSize,
        color: colors.textPrimary,
    },
    lessonDuration: {
        ...typography.caption,
        color: colors.grayText,
        marginTop: 2,
    },
    descriptionText: {
        ...typography.body,
        lineHeight: 22,
        color: colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.lightBorder,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    priceOld: {
        ...typography.caption,
        color: colors.grayText,
        textDecorationLine: 'line-through',
    },
    priceNew: {
        ...typography.h2,
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    registerButton: {
        backgroundColor: colors.primaryBlue,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.button,
    },
    registerText: {
        ...typography.body,
        color: colors.textLight,
        fontWeight: '700',
    },
});
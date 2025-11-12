import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';

import EnrollmentModal from '../src/components/EnrollmentModal';
import PaymentModal from '../src/components/PaymentModal';

// Bật LayoutAnimation trên Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// --- API CONFIG ---
const API_BASE_URL = 'http://192.168.0.102:5000';
const API_COURSES = `${API_BASE_URL}/courses`;
const API_LESSONS = `${API_BASE_URL}/lessons`;

// Gói khóa học mặc định
const MOCK_COURSE_ID = 'COURSE001';
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
    lightPurple: '#EDE9FE',
    dotColor: '#F59E0B',
};

export default function SourceLesson() {
    const courseId = MOCK_COURSE_ID;
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [isEnrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState('premium');

    // Collapse sections
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set(['SEC001']));

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, lessonsRes] = await Promise.all([
                    fetch(API_COURSES),
                    fetch(API_LESSONS),
                ]);

                if (!coursesRes.ok || !lessonsRes.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu từ server');
                }

                const coursesData = await coursesRes.json();
                const lessonsData = await lessonsRes.json();

                setCourses(coursesData);
                setLessons(lessonsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Animation
    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        Animated.spring(tabAnim, {
            toValue: activeTab === 'lessons' ? 0 : 1,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

    const toggleLesson = (sectionId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedLessons((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const handleGoBack = () => router.push('/home');
    const handleRegisterPress = () => setEnrollmentModalVisible(true);
    const handleConfirmEnrollment = () => {
        setEnrollmentModalVisible(false);
        setPaymentModalVisible(true);
    };
    const handlePaymentContinue = (paymentMethod: string) => {
        console.log(`Gói: ${selectedPackage}, Thanh toán: ${paymentMethod}`);
        setPaymentModalVisible(false);
    };

    const formatTime = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) return `${hours}h ${minutes > 0 ? `${minutes}p` : ''}`;
        return `${minutes} phút`;
    };

    const currentCourse = useMemo(() => courses.find((c) => c._id === courseId), [courses, courseId]);
    const courseSections = useMemo(() => lessons.filter((l) => l.courseId === courseId), [lessons, courseId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Đang tải dữ liệu khóa học...</Text>
            </View>
        );
    }

    if (!currentCourse) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Không tìm thấy khóa học</Text>
            </View>
        );
    }

    const totalMinutes = parseInt(String(currentCourse.time).replace(' phút', ''), 10) || 0;
    const displayTime = formatTime(totalMinutes);
    const finalPrice = currentCourse.price
        ? currentCourse.price * (1 - (currentCourse.discount || 0) / 100)
        : 0;

    const indicatorTranslateX = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, width / 2 - 80],
    });

    // --- RENDER ITEM ---
    const renderSectionItem = ({ item }: { item: any }) => {
        const section = item;
        const isExpanded = expandedLessons.has(section._id);
        const hasDetails = section.lesson_details && section.lesson_details.length > 0;

        return (
            <View style={styles.sectionWrapper}>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => hasDetails && toggleLesson(section._id)} 
                    style={styles.sectionHeaderTouchable}
                >
                    <View style={styles.sectionHeaderContent}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionCount}>{section.lesson_details?.length || 0} bài học</Text>
                    </View>
                    {hasDetails && (
                        <Animated.View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }], padding: 4 }}>
                            <FeatherIcon name="chevron-down" size={20} color={COLORS.primary} />
                        </Animated.View>
                    )}
                </TouchableOpacity>

                {isExpanded && hasDetails && (
                    <View style={styles.detailsContainer}>
                        {section.lesson_details.map((detail: any) => {
                            const IconComponent = detail.is_file
                                ? <FeatherIcon name="file-text" size={14} color={COLORS.textSecondary} />
                                : <View style={styles.subLessonDot} />;
                            return (
                                <TouchableOpacity 
                                    key={detail._id}
                                    style={styles.subLessonItem}
                                    onPress={() => router.push(`/lesson-details?lessonId=${detail._id}`)}
                                >
                                    <View style={styles.subLessonContent}>
                                        {IconComponent}
                                        <Text style={styles.subLessonTitle} numberOfLines={1}>{detail.name}</Text>
                                    </View>
                                    <Text style={styles.subLessonDuration}>{detail.time}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <FeatherIcon name="arrow-left" size={26} color={COLORS.background} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{currentCourse.title}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <FlatList
                    data={activeTab === 'lessons' ? courseSections : []}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
                                <Image source={{ uri: currentCourse.image }} style={styles.courseImage} resizeMode="cover" />
                                <View style={styles.imageOverlay} />
                            </Animated.View>

                            <View style={styles.infoSection}>
                                <Text style={styles.courseTitle}>{currentCourse.title}</Text>
                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <FeatherIcon name="clock" size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.metaText}>{displayTime}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <FeatherIcon name="book-open" size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.metaText}>{currentCourse.numberOfLessons} bài</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <IonIcon name="star" size={14} color={COLORS.star} />
                                        <Text style={styles.metaText}>{currentCourse.rating?.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.tabBar}>
                                <TouchableOpacity onPress={() => setActiveTab('lessons')} style={styles.tab}>
                                    <Text style={activeTab === 'lessons' ? styles.tabActive : styles.tabInactive}>Bài học</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('description')} style={styles.tab}>
                                    <Text style={activeTab === 'description' ? styles.tabActive : styles.tabInactive}>Mô tả</Text>
                                </TouchableOpacity>
                                <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: indicatorTranslateX }] }]} />
                            </View>
                            <View style={styles.tabDivider} />

                            {activeTab === 'description' && (
                                <View style={styles.descriptionWrapper}>
                                    <Text style={styles.descriptionText}>{currentCourse.description || 'Chưa có mô tả cho khóa học này.'}</Text>
                                </View>
                            )}
                        </>
                    }
                    renderItem={renderSectionItem}
                />

    
                <View style={styles.footer}>
                    <View style={styles.priceSection}>
                        {currentCourse.discount > 0 && (
                            <Text style={styles.originalPrice}>{currentCourse.price?.toLocaleString()}₫</Text>
                        )}
                        <Text style={styles.finalPrice}>{finalPrice > 0 ? `${finalPrice.toLocaleString()}₫` : 'Miễn phí'}</Text>
                    </View>
                    <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterPress}>
                        <Text style={styles.registerBtnText}>Đăng ký ngay</Text>
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

// === STYLES ===
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: COLORS.textSecondary, fontSize: 16 },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: COLORS.primary, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.background, flex: 1, textAlign: 'center', marginRight: 40 },

    imageWrapper: { paddingHorizontal: 16, paddingTop: 16 },
    courseImage: { width: '100%', height: 200, borderRadius: 16, backgroundColor: COLORS.cardBg },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 16 },

    infoSection: { paddingHorizontal: 16, paddingVertical: 12 },
    courseTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },

    tabBar: { flexDirection: 'row', paddingHorizontal: 16, position: 'relative', marginTop: 16 },
    tab: { paddingVertical: 10, paddingHorizontal: 20 },
    tabActive: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
    tabInactive: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
    tabIndicator: { position: 'absolute', bottom: 0, left: 0, width: 80, height: 3, backgroundColor: COLORS.primary, borderRadius: 2 },
    tabDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16, marginTop: 8 },

    descriptionWrapper: { paddingHorizontal: 16, paddingVertical: 16 },
    descriptionText: { fontSize: 15.5, lineHeight: 23, color: COLORS.textPrimary },

    sectionWrapper: { marginTop: 10 },
    sectionHeaderTouchable: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.cardBg, marginHorizontal: 16, borderRadius: 8 },
    sectionHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    sectionCount: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
    detailsContainer: { marginTop: 4 },

    subLessonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.background, marginHorizontal: 16 },
    subLessonContent: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    subLessonDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.dotColor, marginRight: 12, marginLeft: 4 },
    subLessonTitle: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500', flexShrink: 1 },
    subLessonDuration: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },

    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff' },
    priceSection: { gap: 4 },
    originalPrice: { fontSize: 14, color: COLORS.textSecondary, textDecorationLine: 'line-through' },
    finalPrice: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
    registerBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, elevation: 2 },
    registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { useTheme } from './_layout';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const API_BASE_URL = 'http://192.168.0.102:5000';
const API_COURSES = `${API_BASE_URL}/courses`;
const API_LESSONS = `${API_BASE_URL}/lessons`;
const API_ORDERS = `${API_BASE_URL}/orders`;

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
    success: '#4CAF50',
};

export default function SourceLesson() {
    const { courseId } = useLocalSearchParams();

    const [userId, setUserId] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set(['SEC001']));
    const [isEnrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState('premium');
    const [selectedPackagePrice, setSelectedPackagePrice] = useState(0);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;
    const { isDarkMode } = useTheme();
    const [isSaved, setIsSaved] = useState(false);

    const colors = useMemo(() => ({
        background: isDarkMode ? '#121212' : '#FFFFFF',
        primary: '#A78BFA',
        secondary: '#C4B5FD',
        textPrimary: isDarkMode ? '#FFFFFF' : '#1E1E2A',
        textSecondary: isDarkMode ? '#AAA' : '#6A6A6A',
        cardBg: isDarkMode ? '#1E1E1E' : '#F5F5F8',
        border: isDarkMode ? '#333' : '#E0E0E0',
        star: '#FFC107',
        heartActive: '#FF6B9D',
        lightPurple: '#EDE9FE',
        dotColor: '#F59E0B',
    }), [isDarkMode]);


    useEffect(() => {
        const loadSaved = async () => {
            const saved = await AsyncStorage.getItem("savedCourses");
            const savedList = saved ? JSON.parse(saved) : [];
            setIsSaved(savedList.includes(courseId));
        };
        loadSaved();
    }, [courseId]);

    useEffect(() => {
        const loadUserId = async () => {
            const id = await AsyncStorage.getItem("userId");
            setUserId(id);

        };
        loadUserId();
    }, []);


    useEffect(() => {
        const checkSaved = async () => {
            try {
                if (!userId || !courseId) return;

                const res = await axios.get(`${API_BASE_URL}/users/byAccount/${userId}`);
                const user = res.data;

                const exist = user.coursesInProgress?.find((c: any) =>
                    String(c.courseId) === String(courseId)
                );

                setIsSaved(exist ? !!exist.isFavorite : false);
            } catch (err) {
                console.log("Error checking saved:", err);
            }
        };

        checkSaved();
    }, [userId, courseId]);



    const fetchCourses = useCallback(async () => {
        const res = await axios.get(API_COURSES);
        setCourses(res.data);
    }, []);

    const fetchLessons = useCallback(async () => {
        const res = await axios.get(API_LESSONS);
        setLessons(res.data);
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(API_ORDERS);
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, []);

    const fetchUserByIdOrAccount = useCallback(async (id: string | null) => {
        if (!id) throw new Error('No userId provided');
        const candidates = [
            `${API_BASE_URL}/users/byAccount/${id}`,
            `${API_BASE_URL}/users/byAccount?account=${id}`,
            `${API_BASE_URL}/users/${id}`,
        ];

        for (const url of candidates) {
            try {
                console.log('Trying user fetch URL:', url);
                const res = await axios.get(url);
                return res.data;
            } catch (err: any) {
                const status = err?.response?.status;
                console.warn(`Request to ${url} failed with status`, status);
                if (status && status !== 404) throw err;
            }
        }

        throw new Error('User not found on any tested endpoints');
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchCourses(), fetchLessons(), fetchOrders()]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [fetchCourses, fetchLessons, fetchOrders]);

    useEffect(() => {
        const reload = async () => {
            await Promise.all([fetchOrders(), fetchCourses(), fetchLessons()]);
        };
        reload();
    }, [refreshFlag]);


    useEffect(() => {
        if (userId && courseId && orders.length > 0) {
            const hasPurchased = orders.some(order =>
                order.userId === userId &&
                order.courseId === courseId &&
                order.status === 'completed'
            );
            setIsPurchased(hasPurchased);
        }
    }, [userId, courseId, orders]);

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

    const handleGoBack = () => router.back();
    const handleRegisterPress = () => setEnrollmentModalVisible(true);
    const handleConfirmEnrollment = (pkgKey: string, price: number) => {
        setSelectedPackage(pkgKey);
        setSelectedPackagePrice(price);
        setEnrollmentModalVisible(false);
        setTimeout(() => setPaymentModalVisible(true), 300);
    };

    const handlePaymentSuccess = async () => {
        try {
            const user = await fetchUserByIdOrAccount(userId);
            console.log('Fetched user for payment success:', user?._id || user);

            let list = user.coursesInProgress || [];

            const exist = list.find((c: any) => c.courseId === courseId);

            if (!exist) {
                list.push({
                    courseId: courseId,
                    image: currentCourse.image,
                    progress: 0,
                    completedLessons: 0,
                    totalLessons: currentCourse.numberOfLessons,
                    lastAccessed: new Date().toISOString(),
                    isFavorite: true
                });
            }

            const patchUrl = `${API_BASE_URL}/users/byAccount/${user._id || userId}`;
            await axios.patch(patchUrl, {
                coursesInProgress: list
            });

            setIsSaved(true);
            setIsPurchased(true);
            fetchOrders();

            setRefreshFlag(prev => !prev);

        } catch (err) {
            console.log(err);
        }
    };


    const toggleSaveCourse = async () => {
        try {
            const user = await fetchUserByIdOrAccount(userId);

            let list = user.coursesInProgress || [];

            let existing = list.find((item: any) => item.courseId === courseId);

            if (existing) {
                if (existing.isFavorite === undefined) {
                    existing.isFavorite = false;
                }
                existing.isFavorite = !existing.isFavorite;
            } else {
                list.push({
                    courseId: courseId,
                    image: currentCourse.image,
                    progress: 0,
                    completedLessons: 0,
                    totalLessons: currentCourse.numberOfLessons,
                    lastAccessed: new Date().toISOString(),
                    isFavorite: true,
                });
            }

            await axios.patch(`${API_BASE_URL}/users/${user._id}`, {
                coursesInProgress: list,
            });

            setIsSaved((prev) => !prev);
        } catch (error) {
            console.error("Error saving course:", error);
        }
    };


    const formatTime = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}p` : ''}` : `${minutes} phút`;
    };

    const currentCourse = useMemo(() => courses.find((c) => c._id === courseId), [courses, courseId]);
    const courseSections = useMemo(() => lessons.filter((l) => l.courseId === courseId), [lessons, courseId]);

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Đang tải dữ liệu khóa học...</Text>
            </View>
        );
    }

    if (!currentCourse) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Không tìm thấy khóa học</Text>
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

    const renderSectionItem = ({ item }: { item: any }) => {
        const section = item;
        const isExpanded = expandedLessons.has(section._id);
        const hasDetails = section.lesson_details?.length > 0;

        return (
            <View style={styles.sectionWrapper}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => hasDetails && toggleLesson(section._id)}
                    style={[styles.sectionHeaderTouchable, { backgroundColor: colors.cardBg }]}
                >
                    <View style={styles.sectionHeaderContent}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
                        <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{section.lesson_details?.length || 0} bài học</Text>
                    </View>
                    {hasDetails && (
                        <Animated.View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }], padding: 4 }}>
                            <FeatherIcon name="chevron-down" size={20} color={colors.primary} />
                        </Animated.View>
                    )}
                </TouchableOpacity>

                {isExpanded && hasDetails && section.lesson_details.map((detail: any) => {
                    const IconComponent = detail.is_file
                        ? <FeatherIcon name="file-text" size={14} color={colors.textSecondary} />
                        : <View style={[styles.subLessonDot, { backgroundColor: colors.dotColor }]} />;

                    return (
                        <TouchableOpacity
                            key={detail._id}
                            style={[styles.subLessonItem, { backgroundColor: colors.background }]}
                            onPress={() => {
                                if (isPurchased) {
                                    router.push({ pathname: "/lesson-details", params: { id: detail._id, courseId: currentCourse._id } });
                                } else {
                                    Alert.alert("Khóa học", "Bạn cần đăng ký khóa học để xem bài này.");
                                }
                            }}
                        >
                            <View style={styles.subLessonContent}>
                                {IconComponent}
                                <Text style={[styles.subLessonTitle, { color: colors.textPrimary }]} numberOfLines={1}>{detail.name}</Text>
                            </View>
                            <Text style={[styles.subLessonDuration, { color: colors.textSecondary }]}>{detail.time}</Text>
                            {!isPurchased && <FeatherIcon name="lock" size={14} color={COLORS.textSecondary} style={{ marginRight: 8 }} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.primary }]}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <FeatherIcon name="arrow-left" size={26} color={colors.background} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: colors.background }]} numberOfLines={1}>
                        {currentCourse.title}
                    </Text>

                    <TouchableOpacity onPress={toggleSaveCourse} style={styles.saveButton}>
                        <IonIcon
                            name={isSaved ? "bookmark" : "bookmark-outline"}
                            size={26}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>


                <FlatList
                    data={activeTab === 'lessons' ? courseSections : []}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
                                <Image source={{ uri: currentCourse.image }} style={styles.courseImage} resizeMode="cover" />
                                <View style={[styles.imageOverlay, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} />
                            </Animated.View>

                            <View style={styles.infoSection}>
                                <Text style={[styles.courseTitle, { color: colors.textPrimary }]}>{currentCourse.title}</Text>
                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <FeatherIcon name="clock" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{displayTime}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <FeatherIcon name="book-open" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{currentCourse.numberOfLessons} bài</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <IonIcon name="star" size={14} color={colors.star} />
                                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{currentCourse.rating?.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.tabBar}>
                                <TouchableOpacity onPress={() => setActiveTab('lessons')} style={styles.tab}>
                                    <Text style={activeTab === 'lessons' ? [styles.tabActive, { color: colors.primary }] : [styles.tabInactive, { color: colors.textSecondary }]}>
                                        Bài học
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('description')} style={styles.tab}>
                                    <Text style={activeTab === 'description' ? [styles.tabActive, { color: colors.primary }] : [styles.tabInactive, { color: colors.textSecondary }]}>
                                        Mô tả
                                    </Text>
                                </TouchableOpacity>
                                <Animated.View style={[styles.tabIndicator, { backgroundColor: colors.primary, transform: [{ translateX: indicatorTranslateX }] }]} />
                            </View>
                            <View style={[styles.tabDivider, { backgroundColor: colors.border }]} />

                            {activeTab === 'description' && (
                                <View style={styles.descriptionWrapper}>
                                    <Text style={[styles.descriptionText, { color: colors.textPrimary }]}>{currentCourse.description || 'Chưa có mô tả cho khóa học này.'}</Text>
                                </View>
                            )}
                        </>
                    }
                    renderItem={renderSectionItem}
                />

                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    {isPurchased ? (
                        <TouchableOpacity style={styles.startLearningBtn}>
                            <Text style={styles.startLearningText}>Vào học ngay</Text>
                            <FeatherIcon name="play-circle" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <>
                            <View style={styles.priceSection}>
                                {currentCourse.discount > 0 ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={styles.originalPrice}>{currentCourse.price?.toLocaleString()}₫</Text>
                                        <Text style={styles.finalPrice}>{finalPrice.toLocaleString()}₫</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.finalPrice}>{finalPrice > 0 ? `${finalPrice.toLocaleString()}₫` : 'Miễn phí'}</Text>
                                )}
                            </View>
                            <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterPress}>
                                <Text style={styles.registerBtnText}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <EnrollmentModal
                    visible={isEnrollmentModalVisible}
                    selected={selectedPackage}
                    onSelect={setSelectedPackage}
                    onConfirm={handleConfirmEnrollment}
                    onClose={() => setEnrollmentModalVisible(false)}
                    price={currentCourse.price || 0}
                    discount={currentCourse.discount || 0}
                />

                <PaymentModal
                    visible={isPaymentModalVisible}
                    onClose={() => setPaymentModalVisible(false)}
                    onContinue={handlePaymentSuccess}
                    amount={selectedPackagePrice}
                    courseId={currentCourse._id}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginRight: 40 },
    imageWrapper: { paddingHorizontal: 16, paddingTop: 16 },
    courseImage: { width: '100%', height: 200, borderRadius: 16, backgroundColor: '#F5F5F8' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 16 },
    infoSection: { paddingHorizontal: 16, paddingVertical: 12 },
    courseTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 14, fontWeight: '600' },
    tabBar: { flexDirection: 'row', paddingHorizontal: 16, position: 'relative', marginTop: 16 },
    tab: { paddingVertical: 10, paddingHorizontal: 20 },
    tabActive: { fontSize: 16, fontWeight: '700' },
    tabInactive: { fontSize: 16, fontWeight: '600' },
    tabIndicator: { position: 'absolute', bottom: 0, left: 0, width: 80, height: 3, borderRadius: 2 },
    tabDivider: { height: 1, marginHorizontal: 16, marginTop: 8 },
    descriptionWrapper: { paddingHorizontal: 16, paddingVertical: 16 },
    descriptionText: { fontSize: 15.5, lineHeight: 23 },
    sectionWrapper: { marginTop: 10 },
    sectionHeaderTouchable: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, borderRadius: 8 },
    sectionHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    sectionCount: { fontSize: 14, fontWeight: '500' },
    subLessonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, marginHorizontal: 16 },
    subLessonContent: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
    subLessonDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12, marginLeft: 4 },
    subLessonTitle: { fontSize: 15, fontWeight: '500', flexShrink: 1 },
    subLessonDuration: { fontSize: 14, fontWeight: '500' },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1 },
    priceSection: { gap: 4 },
    originalPrice: { fontSize: 14, color: COLORS.textSecondary, textDecorationLine: 'line-through' },
    finalPrice: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
    registerBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, elevation: 2 },
    registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    startLearningBtn: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
    startLearningText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    discountBadge: { backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    discountText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    saveButton: {
        padding: 8,
        marginLeft: 4,
    },

});

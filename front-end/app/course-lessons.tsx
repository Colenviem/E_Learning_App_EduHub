import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';

import EnrollmentModal from '../src/components/EnrollmentModal';
import PaymentModal from '../src/components/PaymentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// --- API CONFIG ---
// Lưu ý: Nhớ đổi localhost thành IP máy nếu chạy máy thật
const API_BASE_URL = 'http://localhost:5000'; 
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
    success: '#4CAF50', // Thêm màu thành công
};

export default function SourceLesson() {
    const { courseId } = useLocalSearchParams();
    
    // --- STATE ---
    const [userId, setUserId] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]); // Thêm state orders
    const [loading, setLoading] = useState(true);
    
    // Logic check mua hàng
    const [isPurchased, setIsPurchased] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
    
    // Modal State
    const [isEnrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    
    const [selectedPackage, setSelectedPackage] = useState('premium');
    const [selectedPackagePrice, setSelectedPackagePrice] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(0)).current;

    // --- 1. FETCH USER ID ---
    useEffect(() => {
        const fetchUser = async () => {
            const id = await AsyncStorage.getItem('userId');
            // Nếu chưa login, tạm fix cứng để test logic (hoặc để null)
            setUserId(id || 'USER002'); 
        };
        fetchUser();
    }, []);
    
    // --- 2. FETCH DATA (Sửa fetchOrders) ---
    const fetchCourses = useCallback(async () => {
        const res = await axios.get(API_COURSES);
        setCourses(res.data);
    }, []);

    const fetchLessons = useCallback(async () => {
        const res = await axios.get(API_LESSONS);
        setLessons(res.data);
    }, []);

    // SỬA LẠI HÀM NÀY: Gọi đúng API orders và setOrders
    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(API_ORDERS);
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchCourses(), fetchLessons(), fetchOrders()]);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [fetchCourses, fetchLessons, fetchOrders]);

    // --- 3. KIỂM TRA ĐÃ MUA HAY CHƯA ---
    useEffect(() => {
        if (userId && courseId && orders.length > 0) {
            // Tìm trong list orders xem có đơn hàng nào khớp userId + courseId + status completed không
            const hasPurchased = orders.some(order => 
                order.userId === userId && 
                order.courseId === courseId && 
                order.status === 'completed'
            );
            setIsPurchased(hasPurchased);
            
            if (hasPurchased) {
                console.log(`User ${userId} đã mua khóa học ${courseId}`);
            }
        }
    }, [userId, courseId, orders]);

    // --- ANIMATIONS ---
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

    // --- HANDLERS ---
    const toggleLesson = (sectionId: string) => {
        // Nếu chưa mua thì có thể chặn xem chi tiết ở đây (Optional)
        // if (!isPurchased) return Alert.alert("Thông báo", "Vui lòng đăng ký khóa học để xem bài học.");

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedLessons((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const handleGoBack = () => router.push('/(tabs)/home');
    const handleRegisterPress = () => setEnrollmentModalVisible(true);

    const handleConfirmEnrollment = (pkgKey: string, price: number) => {
        setSelectedPackage(pkgKey);
        setSelectedPackagePrice(price);
        setEnrollmentModalVisible(false);
        setTimeout(() => {
            setPaymentModalVisible(true);
        }, 300);
    };

    const handlePaymentSuccess = () => {
        // Sau khi thanh toán thành công, reload lại orders hoặc set cứng state để cập nhật UI ngay lập tức
        setIsPurchased(true); 
        fetchOrders(); // Fetch lại để đồng bộ dữ liệu mới nhất
    };

    // --- HELPERS ---
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

    // --- RENDER ---
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
                                    onPress={() => {
                                        if (isPurchased) {
                                            router.push({ 
                                                pathname: "/lesson-details",
                                                params: { id: detail._id, courseId: currentCourse._id }
                                            });
                                        } else {
                                            Alert.alert("Khóa học", "Bạn cần đăng ký khóa học để xem bài này.");
                                        }
                                    }}
                                >
                                    <View style={styles.subLessonContent}>
                                        {IconComponent}
                                        <Text style={styles.subLessonTitle} numberOfLines={1}>{detail.name}</Text>
                                    </View>
                                    {!isPurchased && <FeatherIcon name="lock" size={14} color={COLORS.textSecondary} style={{marginRight: 8}} />}
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
                                {/* Các thông tin meta khác... */}
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
                                    <Text style={styles.descriptionText}>{currentCourse.description || 'Chưa có mô tả.'}</Text>
                                </View>
                            )}
                        </>
                    }
                    renderItem={renderSectionItem}
                />

                {/* --- 4. FOOTER LOGIC --- */}
                <View style={styles.footer}>
                    {isPurchased ? (
                        // GIAO DIỆN KHI ĐÃ MUA
                        <TouchableOpacity style={styles.startLearningBtn}>
                            <Text style={styles.startLearningText}>Vào học ngay</Text>
                            <FeatherIcon name="play-circle" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        // GIAO DIỆN KHI CHƯA MUA (Hiện giá tiền + nút Đăng ký)
                        <>
                            <View style={styles.priceSection}>
                                {currentCourse.discount > 0 ? (
                                    <>
                                        <Text style={styles.originalPrice}>
                                            {currentCourse.price?.toLocaleString()}₫
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.finalPrice}>{finalPrice.toLocaleString()}₫</Text>
                                            <View style={styles.discountBadge}>
                                                <Text style={styles.discountText}>-{currentCourse.discount}%</Text>
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={styles.finalPrice}>
                                        {finalPrice > 0 ? `${finalPrice.toLocaleString()}₫` : 'Miễn phí'}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterPress}>
                                <Text style={styles.registerBtnText}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
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
                onContinue={handlePaymentSuccess} // Gọi hàm cập nhật state khi thành công
                amount={selectedPackagePrice}
                courseId={currentCourse._id}
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
    discountBadge: { backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    discountText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    registerBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, elevation: 2 },
    registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    startLearningBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    startLearningText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
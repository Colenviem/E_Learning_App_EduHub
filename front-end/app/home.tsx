import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    FlatList, 
    SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dữ liệu giả định cho các khóa học
const popularCourses = [
    { 
        id: '1', 
        title: 'Lớp học chính về React Native', 
        lessons: 28, 
        duration: '6h 30 phút', 
        rating: 4.9,
        image: 'https://placehold.co/150x100/6A5ACD/ffffff?text=React+Native', // Tím nhạt
        color: '#6A5ACD' 
    },
    { 
        id: '2', 
        title: 'Lớp học về Figma UI Design', 
        lessons: 31, 
        duration: '7h 30 phút', 
        rating: 4.8,
        image: 'https://placehold.co/150x100/FF5733/ffffff?text=Figma+Design', // Cam đỏ
        color: '#FF5733'
    },
    { 
        id: '3', 
        title: 'Lập trình JavaScript cơ bản', 
        lessons: 20, 
        duration: '5h 00 phút', 
        rating: 4.7,
        image: 'https://placehold.co/150x100/33FF57/ffffff?text=JavaScript', // Xanh lá
        color: '#33FF57'
    },
];

// Component Card Khóa học
const CourseCard = ({ item, isNew }) => (
    <View style={styles.courseCard}>
        <View style={[styles.courseImageContainer, {backgroundColor: item.color}]}>
            <Image 
                source={{ uri: item.image }} 
                style={styles.courseImage} 
                resizeMode="contain"
            />
            <TouchableOpacity style={styles.heartIcon}>
                <Ionicons 
                    name="heart-outline" 
                    size={20} 
                    color="#fff" 
                />
            </TouchableOpacity>
        </View>
        <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.courseMeta}>
            <Ionicons name="book-outline" size={14} color="#666" style={{marginRight: 4}} />
            <Text style={styles.courseMetaText}>{item.lessons} bài học</Text>
        </View>
        <View style={styles.courseMeta}>
            <Ionicons name="time-outline" size={14} color="#666" style={{marginRight: 4}} />
            <Text style={styles.courseMetaText}>{item.duration}</Text>
        </View>
        <View style={styles.courseRating}>
            <Ionicons name="star" size={16} color="#FFD700" style={{marginRight: 4}} />
            <Text style={styles.courseRatingText}>{item.rating}</Text>
        </View>
    </View>
);


export default function ElearningApp() {
    // Để giữ cho Bottom Tab Bar luôn cố định, tôi sẽ đặt nó bên ngoài ScrollView
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Xin chào, Hoàng Anh!</Text>
                        <Text style={styles.subText}>Tìm bài học của bạn ngay hôm nay!</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <Ionicons name="search-outline" size={20} color="#666" />
                        <TextInput 
                            placeholder="Tìm kiếm..." 
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                         <Ionicons name="list-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                {/* Discovery Section (Khám phá) */}
                <View style={styles.discoveryCard}>
                    <View>
                        <Text style={styles.discoveryTitle}>Khám phá những lựa chọn hàng đầu</Text>
                        <Text style={styles.discoveryCount}>100 + bài học</Text>
                        <TouchableOpacity style={styles.discoveryButton}>
                            <Text style={styles.discoveryButtonText}>Khám phá thêm</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://res.cloudinary.com/dixzxzdrd/image/upload/v1761483864/app_dev_icon_c04d_n.png' }} // Icon đại diện
                        style={styles.discoveryImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressItem}>
                        <Ionicons name="book-outline" size={20} color="#4A90E2" style={{marginRight: 8}} />
                        <Text style={styles.progressLabel}>Khóa học đang học</Text>
                        <Text style={styles.progressValue}>3</Text>
                    </View>
                    <View style={styles.progressItem}>
                        <Text style={styles.progressLabel}>Tiến độ tuần này</Text>
                        <View style={styles.progressBarWrapper}>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: '75%' }]} />
                            </View>
                            <Text style={styles.progressPercentage}>75%</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="arrow-forward" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Popular Courses Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Bài học phổ biến</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={popularCourses}
                    renderItem={({ item }) => <CourseCard item={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContainer}
                />

                {/* New Courses Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Bài học mới</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={popularCourses} // Dùng lại dữ liệu, có thể thay bằng dữ liệu mới
                    renderItem={({ item }) => <CourseCard item={item} isNew={true} />}
                    keyExtractor={item => item.id + '-new'}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.flatListContainer, { marginBottom: 20 }]}
                />
            </ScrollView>
            
            {/* Bottom Tab Bar (fixed) */}
            <View style={styles.bottomTabBar}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="book-outline" size={24} color="#666" />
                </TouchableOpacity>
                 <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="document-text-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#666',
    },
    notificationButton: {
        padding: 5,
    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#4A90E2', // Màu xanh dương
        borderRadius: 10,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Discovery Card
    discoveryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E6E6FA', // Màu tím nhạt
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
        overflow: 'hidden',
    },
    discoveryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF', // Updated color
        marginBottom: 5,
    },
    discoveryCount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 10,
    },
    discoveryButton: {
        backgroundColor: '#3B82F6', // Updated color
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    discoveryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12, // Updated font size
    },
    discoveryImage: {
        width: 100,
        height: 100,
        opacity: 0.8,
        transform: [{ rotate: '10deg' }],
    },
    // Progress
    progressContainer: {
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 20,
    },
    progressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    progressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
        marginLeft: 20,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginRight: 10,
    },
    progressBarFill: {
        height: 8,
        backgroundColor: '#4A90E2',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '600',
        marginRight: 10,
    },
    // Sections
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '600',
    },
    flatListContainer: {
        paddingBottom: 10,
    },
    // Course Card
    courseCard: {
        width: 180, // Chiều rộng cố định cho mỗi card
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseImageContainer: {
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    courseImage: {
        width: '80%',
        height: '80%',
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
        padding: 4,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    courseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    courseMetaText: {
        fontSize: 12,
        color: '#666',
    },
    courseRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    courseRatingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    // Bottom Tab Bar
    bottomTabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    tabItem: {
        padding: 5,
    },
});

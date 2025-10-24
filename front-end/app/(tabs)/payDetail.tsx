import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const reactNativeCourseImage = 'https://res.cloudinary.com/dibguk5n6/image/upload/v1761295939/reactSource_czvo74.png';
const figmaCourseImage = 'https://res.cloudinary.com/dibguk5n6/image/upload/v1761295939/reactSource_czvo74.png';

const enrolledCourses = [
  {
    title: 'Lớp học chính về React Native',
    lessons: 28,
    progress: 65,
    imageUri: reactNativeCourseImage,
  },
  {
    title: 'Lớp học chính về React Native',
    lessons: 28,
    progress: 65,
    imageUri: reactNativeCourseImage,
  },
];

const popularLessons = [
  {
    title: 'Lớp học chính về React Native',
    lessons: 28,
    duration: '8h 30 phút',
    rating: 4.8,
    imageUri: reactNativeCourseImage,
  },
  {
    title: 'Lớp học về Figma UI Design',
    lessons: 31,
    duration: '7h 30 phút',
    rating: 4.1,
    imageUri: figmaCourseImage,
  },
];

const EnrolledCourseCard = ({ title, lessons, progress, imageUri }: typeof enrolledCourses[0]) => (
  <View style={styles.enrolledCard}>
    <Image source={{ uri: imageUri }} style={styles.enrolledImage} />
    <View style={styles.enrolledDetails}>
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseSubtitle}>({lessons} bài học)</Text>
      <Text style={styles.progressText}>Tiến độ</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressValue}>{progress}%</Text>
    </View>
  </View>
);

const PopularLessonCard = ({ title, lessons, duration, rating, imageUri }: typeof popularLessons[0]) => (
  <TouchableOpacity style={styles.popularCard} activeOpacity={0.8}>
    <Image source={{ uri: imageUri }} style={styles.popularImage} />
    <TouchableOpacity style={styles.favoriteButton}>
        <Text style={{ color: 'white' }}>❤️</Text>
    </TouchableOpacity>
    <View style={styles.popularDetails}>
      <Text style={styles.courseTitleSmall}>{title}</Text>
      <Text style={styles.courseSubtitleSmall}>({lessons} bài học)</Text>
      <View style={styles.lessonInfoRow}>
        <Text style={styles.infoText}>⏱️ {duration}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.infoText}>⭐ {rating}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const PayDetail: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <Text style={styles.sectionTitle}>Các khóa học đã đăng ký</Text>
        <View style={styles.enrolledList}>
          {enrolledCourses.map((course, index) => (
            <EnrolledCourseCard key={index} {...course} />
          ))}
        </View>

        <View style={styles.popularHeader}>
          <Text style={styles.sectionTitle}>Bài học phổ biến</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
          {popularLessons.map((lesson, index) => (
            <PopularLessonCard key={index} {...lesson} />
          ))}
        </ScrollView>

      </ScrollView>

      <View style={styles.bottomNav}>
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={styles.navIcon}>📖</Text>
        <View style={styles.activeNavIconWrapper}>
            <Text style={styles.activeNavIcon}>📄</Text>
        </View>
        <Text style={styles.navIcon}>👤</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  enrolledList: {
    marginBottom: 30,
  },
  enrolledCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  enrolledImage: {
    width: 100,
    height: 100,
  },
  enrolledDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginTop: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 3,
    marginBottom: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    color: '#007bff',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    bottom: 5,
    opacity: 0,
  },

  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#007bff',
    fontSize: 14,
  },
  popularList: {
  },
  popularCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  popularImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 5,
  },
  popularDetails: {
    padding: 10,
  },
  courseTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  courseSubtitleSmall: {
    fontSize: 11,
    color: '#777',
    marginBottom: 8,
  },
  lessonInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 10,
  },
  navIcon: {
    fontSize: 24,
    color: '#ccc',
    padding: 10,
  },
  activeNavIconWrapper: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 5,
  },
  activeNavIcon: {
    fontSize: 24,
    color: '#007bff',
    padding: 5,
  }
});

export default PayDetail;
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';
import Course from '../Course';

interface CourseItem {
  _id: string;
  title: string;
  image: string;
  rating: number;
  numberOfParticipants: number;
  numberOfLessons: number;
  time: string;
  price?: number;
  discount?: number;
}

interface Props {
  courses: CourseItem[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 2; 
const GAP = 12;
const PADDING_HORIZONTAL = spacing.md * 2;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL - GAP) / NUM_COLUMNS;

export default function CoursesGrid({ courses }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconBg}>
            <MaterialIcons name="explore" size={18} color="#9333EA" />
          </View>
          <Text style={styles.sectionTitle}>Khám phá</Text>
        </View>
      </View>

      <View style={styles.coursesGrid}>
        {courses.map((item) => (
          <Animated.View key={item._id} style={[styles.courseCardWrapper, { width: CARD_WIDTH }]}>
            <Course
              item={item}
            />
          </Animated.View>
        ))}

        {courses.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <MaterialIcons name="search-off" size={40} color="#CCC" />
            </View>
            <Text style={styles.emptyTitle}>Không tìm thấy khóa học</Text>
            <Text style={styles.emptyText}>Thử tìm kiếm với từ khóa khác</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIconBg: {
    width: 34,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  courseCardWrapper: {
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: spacing.md,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: typography.caption.fontSize,
  },
});
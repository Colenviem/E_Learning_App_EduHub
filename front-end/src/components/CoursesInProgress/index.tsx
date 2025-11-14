import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

interface CourseInProgress {
  courseId: string;
  image: string;
  progress: number;
}

interface Props {
  courses: CourseInProgress[];
}

export default function CoursesInProgress({ courses }: Props) {
  const router = useRouter();
  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIconBg}>
            <MaterialIcons name="play-circle-filled" size={18} color={colors.secondaryAccent} />
          </View>
          <Text style={styles.sectionTitle}>Đang học</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <MaterialIcons name="arrow-forward" size={14} color={colors.secondaryAccent} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={courses}
        keyExtractor={(item) => item.courseId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: SCREEN_WIDTH * 0.65 }]}
            onPress={() => router.push({
              pathname: '/course-lessons',
              params: { id: item.courseId }
            })}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: 32,
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: colors.secondaryAccent,
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  progressText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 13,
  },
});
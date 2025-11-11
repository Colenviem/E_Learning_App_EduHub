import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, SCREEN_CONSTANTS, spacing, typography } from '../../constants/theme';

interface Course {
  id: string;
  name: string;
  image: any;
  rating: number;
  reviews: number;
  progress: number;
}

interface Props {
  courses: Course[];
}

export default function CoursesInProgress({ courses }: Props) {
  const router = useRouter();
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
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.progressCard}
            activeOpacity={0.9}
            onPress={() => {
              router.push({
                pathname: '../course-lessons',
                params: {
                  id: item.id,
                  name: item.name,
                  image: typeof item.image === 'number' ? undefined : item.image.uri,
                  progress: item.progress.toString(),
                },
              });
            }}
          >
            <View style={styles.progressImageContainer}>
              <Image source={item.image} style={styles.progressImage} resizeMode="cover" />
              <View style={styles.progressOverlay}>
                <View style={styles.playButton}>
                  <MaterialIcons name="play-arrow" size={24} color={colors.textPrimary} />
                </View>
              </View>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressCourseName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]} />
                </View>
                <Text style={styles.progressPercentage}>{Math.round(item.progress * 100)}%</Text>
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
  progressCard: {
    width: SCREEN_CONSTANTS.SCREEN_WIDTH * 0.65,
    backgroundColor: colors.background,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  progressImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  progressImage: {
    width: '100%',
    height: '100%',
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    padding: spacing.md,
  },
  progressCourseName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondaryAccent,
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondaryAccent,
    minWidth: 36,
    textAlign: 'right',
  },
});

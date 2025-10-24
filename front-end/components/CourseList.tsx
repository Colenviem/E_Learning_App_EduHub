import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- 1. Thêm import useRouter
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

interface Course {
  id: string;
  title: string;
  lessons: number;
  duration: string;
  rating: number;
  imageUri: string;
}

interface CourseListProps {
  title: string;
  data: Course[];
}

const CourseCard: React.FC<{ item: Course }> = ({ item }) => {
  const router = useRouter();

  const handlePress = () => {

    router.push(`../course/${item.id}`); 
  };

  return (
    <TouchableOpacity style={courseCardStyles.cardContainer} onPress={handlePress}>
      <View style={courseCardStyles.imageWrapper}>
        <Image source={{ uri: item.imageUri }} style={courseCardStyles.image} resizeMode="cover" />
        <TouchableOpacity style={courseCardStyles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      <Text style={courseCardStyles.title} numberOfLines={2}>{item.title}</Text>
      <View style={courseCardStyles.detailsRow}>
        <Text style={courseCardStyles.detailText}>{item.lessons} bài học</Text>
        <View style={courseCardStyles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFC300" />
          <Text style={courseCardStyles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const courseCardStyles = StyleSheet.create({
  cardContainer: {
    width: 180,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 120,
    width: '100%',
    marginBottom: spacing.sm,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 4,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: 4,
    color: colors.textSecondary,
  },
});

const CourseList: React.FC<CourseListProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => <CourseCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true} 
        decelerationRate="fast" 
        bounces={true} 
        directionalLockEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenPadding, 
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    ...typography.h2,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.primaryBlue,
    fontWeight: '600',
  },
});

export default CourseList;
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

interface SearchResult {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  duration: string;
  rating: number;
  imageUri: string;
  isBestPractice?: boolean;
}

const mockSearchResults: SearchResult[] = [
  { id: 's1', title: 'Java basic', level: 'Intermediate', lessons: 28, duration: '4h 20 phút', rating: 4.9, imageUri: 'https://picsum.photos/seed/java/60/60' },
  { id: 's2', title: 'Java website', level: 'Beginner', lessons: 24, duration: '4h', rating: 4.7, imageUri: 'https://picsum.photos/seed/javaweb/60/60' },
  { id: 's3', title: 'Java Best Practices', level: 'Intermediate', lessons: 42, duration: '6h 23 phút', rating: 4.8, imageUri: 'https://picsum.photos/seed/javabest/60/60', isBestPractice: true },
  { id: 's4', title: 'Java master', level: 'Intermediate', lessons: 39, duration: '5h 12 phút', rating: 4.9, imageUri: 'https://picsum.photos/seed/javamaster/60/60' },
  { id: 's5', title: 'Java master', level: 'Beginner', lessons: 24, duration: '4h', rating: 4.7, imageUri: 'https://picsum.photos/seed/javamaster2/60/60' },
  { id: 's6', title: 'Java master', level: 'Beginner', lessons: 24, duration: '4h', rating: 4.7, imageUri: 'https://picsum.photos/seed/javamaster3/60/60' },
  { id: 's7', title: 'Java master', level: 'Beginner', lessons: 24, duration: '4h', rating: 4.7, imageUri: 'https://picsum.photos/seed/javamaster4/60/60' },
];

const mockSearchTags = ['Java', 'Java Web', 'Java basic', 'Spring Boot', 'OOP'];

const TagButton: React.FC<{ title: string, isSelected: boolean, onPress: () => void }> = ({ title, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[tagStyles.tagContainer, isSelected && tagStyles.selectedTagContainer]} 
    onPress={onPress}
  >
    <Text style={[tagStyles.tagText, isSelected && tagStyles.selectedTagText]}>{title}</Text>
    {isSelected && <Ionicons name="close" size={16} color={colors.textLight} style={{ marginLeft: 4 }} />}
  </TouchableOpacity>
);

const tagStyles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.button,
    marginRight: spacing.sm,
    backgroundColor: colors.lightBorder,
  },
  selectedTagContainer: {
    backgroundColor: colors.primaryBlue,
  },
  tagText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedTagText: {
    color: colors.textLight,
  },
});

const SearchResultCard: React.FC<{ item: SearchResult, onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity 
    style={[searchCardStyles.cardContainer, item.isBestPractice && searchCardStyles.highlightedCard]} 
    onPress={onPress}
  >
    <View style={searchCardStyles.leftContent}>
      <Image source={{ uri: item.imageUri }} style={searchCardStyles.image} resizeMode="cover" />
      <View style={searchCardStyles.infoWrapper}>
        <Text style={searchCardStyles.title}>{item.title}</Text>
        <View style={searchCardStyles.metaRow}>
          <Text style={searchCardStyles.metaText}>{item.level} / {item.lessons} bài học</Text>
        </View>
        <View style={searchCardStyles.ratingDurationRow}>
          <Ionicons name="star" size={14} color="#FFC300" style={{ marginRight: 4 }} />
          <Text style={searchCardStyles.metaText}>{item.rating}</Text>
          <Text style={searchCardStyles.metaText}> • {item.duration}</Text>
        </View>
      </View>
    </View>
    
    {item.isBestPractice ? (
      <View style={searchCardStyles.chatIconWrapper}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.textLight} />
      </View>
    ) : (
      <Ionicons name="heart-outline" size={20} color={colors.grayText} />
    )}
  </TouchableOpacity>
);

const searchCardStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  highlightedCard: {
    backgroundColor: colors.primaryBlue,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderBottomWidth: 0, 
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  infoWrapper: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconWrapper: {
    padding: spacing.sm,
    backgroundColor: colors.primaryBlue, 
    borderRadius: 20,
    alignSelf: 'flex-start',
  }
});


export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('Java'); 
  const [activeTags, setActiveTags] = useState(['Java']); 

  const handleTagPress = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const handleResultPress = (id: string) => {
      router.push(`./course/${id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} /> 

      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Search</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color={colors.grayText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.grayText}
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Feather name="send" size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
          {mockSearchTags.map(tag => (
            <TagButton
              key={tag}
              title={tag}
              isSelected={activeTags.includes(tag)}
              onPress={() => handleTagPress(tag)}
            />
          ))}
        </ScrollView>

        <View style={styles.resultsContainer}>
          {mockSearchResults.map(result => (
            <SearchResultCard 
                key={result.id} 
                item={result} 
                onPress={() => handleResultPress(result.id)}
            />
          ))}
        </View>
        
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: Platform.OS === 'android' ? spacing.md : 0, 
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  iconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    marginRight: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  resultsContainer: {
    paddingHorizontal: spacing.screenPadding,
  },
});
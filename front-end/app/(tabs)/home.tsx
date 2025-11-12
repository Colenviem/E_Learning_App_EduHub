import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BannerCarousel from '../../src/components/BannerCarousel';
import Categories from '../../src/components/Categories';
import CoursesGrid from '../../src/components/CoursesGrid';
import CoursesInProgress from '../../src/components/CoursesInProgress';

import { useSearchParams } from 'expo-router/build/hooks';
import { colors, spacing } from '../../src/constants/theme';

const API_COURSES = "http://192.168.2.6:5000/courses";
const API_CATEGORIES = "http://192.168.2.6:5000/categories";
const API_USERS = "http://192.168.2.6:5000/users";

const BANNERS = [
  "https://res.cloudinary.com/dixzxzdrd/image/upload/v1762585754/banner2_tlhzfa.jpg",
  "https://res.cloudinary.com/dixzxzdrd/image/upload/v1762585754/banner1_fh9q26.png"
];

function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("CAT001");
  const carouselRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(API_COURSES);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(API_CATEGORIES);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(API_USERS);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchUsers();
  }, [fetchCourses, fetchCategories, fetchUsers]);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'CAT001') {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchCategory =
        selectedCategory === 'CAT001' || course.categoryId === selectedCategory;
      const matchSearch = course.title.toLowerCase().includes(inputValue.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [courses, inputValue, selectedCategory]);

  const currentUser = users.find(u => u._id === userId);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>
            EduHub
          </Text>

          <TouchableOpacity onPress={() => router.push('../notifications')}>
            <FontAwesome name="bell-o" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <BannerCarousel banners={BANNERS} carouselRef={carouselRef} />

        {currentUser?.coursesInProgress?.length > 0 && (
          <CoursesInProgress courses={currentUser.coursesInProgress} />
        )}

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <CoursesGrid courses={filteredCourses} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: 20,
  },
  greeting: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#DDD6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollContainer: {
    paddingBottom: 100,
    backgroundColor: '#F3F4F6',
  },
});

export default Home;
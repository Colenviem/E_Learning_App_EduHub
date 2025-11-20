import { API_BASE_URL } from '@/src/api';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BannerCarousel from '../../src/components/BannerCarousel';
import Categories from '../../src/components/Categories';
import CoursesGrid from '../../src/components/CoursesGrid';
import CoursesInProgress from '../../src/components/CoursesInProgress';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { spacing, colors as themeColors } from '../../src/constants/theme';
import { useTheme } from '../_layout';

const API_COURSES = `${API_BASE_URL}/courses`;
const API_CATEGORIES = `${API_BASE_URL}/categories`;

const BANNERS = [
  "https://res.cloudinary.com/dixzxzdrd/image/upload/v1762585754/banner2_tlhzfa.jpg",
  "https://res.cloudinary.com/dixzxzdrd/image/upload/v1762585754/banner1_fh9q26.png"
];

function Home() {
  const { isDarkMode } = useTheme();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("CAT001");
  const [userId, setUserId] = useState<string | null>(null);
  const carouselRef = useRef<any>(null);
  const router = useRouter();

  const colors = {
    background: isDarkMode ? '#121212' : '#F3F4F6',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
    text: isDarkMode ? '#FFF' : '#1A1A1A',
    textLight: '#FFFFFF',
    subText: isDarkMode ? '#CCC' : '#555',
    primary: themeColors.primary,
    accent: themeColors.primary,
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          // Fetch the specific user data if needed
          const userResponse = await axios.get(`${API_BASE_URL}/users/byAccount/${storedUserId}`);
          setCurrentUser(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching userId or user data from AsyncStorage:', error);
      }
    };
    getUserId();
  }, []);

  // ✅ Refresh data khi quay lại home screen
  useFocusEffect(
    useCallback(() => {
      const refreshUserData = async () => {
        if (userId) {
          try {
            const userResponse = await axios.get(`${API_BASE_URL}/users/byAccount/${userId}`);
            setCurrentUser(userResponse.data);
          } catch (error) {
            console.error('Error refreshing user data:', error);
          }
        }
      };
      refreshUserData();
    }, [userId])
  );

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

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

 useEffect(() => {
  if (categories.length > 0) {
    const programming = categories.find(
      c => c.name?.toLowerCase() === "programming"
    );

    if (programming) {
      setSelectedCategory(programming._id);
    }
  }
}, [categories]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchCategory = selectedCategory === 'CAT001' || course.categoryId === selectedCategory;
      const matchSearch = course.title.toLowerCase().includes(inputValue.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [courses, inputValue, selectedCategory]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#000' : colors.primary }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.greeting, { color: colors.textLight }]}>EduHub</Text>
          <TouchableOpacity onPress={() => router.push('../notifications')}>
            <FontAwesome name="bell-o" size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F4F4F5' }]}>
          <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
            style={[styles.searchInput, { color: colors.text }]}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
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
    fontSize: 26,
    fontWeight: '900',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
  },
});

export default Home;

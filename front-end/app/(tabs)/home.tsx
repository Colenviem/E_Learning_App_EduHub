import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

import BannerCarousel from '../../src/components/BannerCarousel';
import Categories from '../../src/components/Categories';
import CoursesGrid from '../../src/components/CoursesGrid';
import CoursesInProgress from '../../src/components/CoursesInProgress';

import { colors, spacing } from '../../src/constants/theme';

const API_COURSES = "http://localhost:5000/courses";
const API_CATEGORIES = "http://localhost:5000/categories";
const API_USERS = "http://localhost:5000/users";
const USERID = "USER001";
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

  const currentUser = users.find(u => u._id === USERID);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: spacing.xxl,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
            marginTop: 20,
          }}
        >
          <Text style={{ color: '#7C3AED', fontSize: 26, fontWeight: '900' }}>
            EduHub
          </Text>

          <TouchableOpacity onPress={() => router.push('../notifications')}>
            <FontAwesome name="bell-o" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F4F4F5',
            borderRadius: 14,
            paddingHorizontal: spacing.md,
            height: 46,
          }}
        >
          <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 10 }} />

          <TextInput
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
            style={{ flex: 1, fontSize: 14, color: '#1A1A1A' }}
          />

          <TouchableOpacity
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#DDD6FE',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <MaterialIcons name="tune" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, backgroundColor: '#F3F4F6' }}
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

export default Home;
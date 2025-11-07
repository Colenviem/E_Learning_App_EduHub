import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BannerCarousel from '../../src/components/BannerCarousel';
import Categories from '../../src/components/Categories';
import CoursesGrid from '../../src/components/CoursesGrid';
import CoursesInProgress from '../../src/components/CoursesInProgress';

import { colors, spacing } from '../../src/constants/theme';



const DUMMY_COURSES = [
  { id: '1', name: 'React Native Cơ Bản', image: require('../../assets/images/tets.jpg'), rating: 5, reviews: 120, progress: 0.6 },
  { id: '2', name: 'React Nâng Cao', image: require('../../assets/images/tets.jpg'), rating: 4, reviews: 80, progress: 0.3 },
  { id: '3', name: 'JavaScript Hiện Đại', image: require('../../assets/images/tets.jpg'), rating: 4, reviews: 50, progress: 0 },
  { id: '4', name: 'TypeScript Cần Thiết', image: require('../../assets/images/tets.jpg'), rating: 5, reviews: 60, progress: 0 },
  { id: '5', name: 'Node.js cho Người Mới', image: require('../../assets/images/tets.jpg'), rating: 3, reviews: 30, progress: 0 },
  { id: '6', name: 'CSS Flexbox & Grid', image: require('../../assets/images/tets.jpg'), rating: 4, reviews: 40, progress: 0 },
];

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'apps' },
  { id: 'react', name: 'React', icon: 'code' },
  { id: 'js', name: 'JavaScript', icon: 'loyalty' },
  { id: 'node', name: 'Node', icon: 'cloud' },
  { id: 'css', name: 'CSS', icon: 'palette' },
  { id: 'ts', name: 'TypeScript', icon: 'build' },
];

const BANNERS = [
  require('../../assets/images/banner1.png'),
  require('../../assets/images/banner2.jpg')
];

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const carouselRef = useRef<any>(null);
  const router = useRouter();
  const coursesInProgress = useMemo(() => {
    return DUMMY_COURSES.filter(course => course.progress && course.progress > 0);
  }, []);

  const filteredCourses = useMemo(() => {
    return DUMMY_COURSES.filter(course => {
      const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || '';
      const matchCategory = selectedCategory === 'all' || course.name.toLowerCase().includes(categoryName.toLowerCase());
      const matchSearch = course.name.toLowerCase().includes(inputValue.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [inputValue, selectedCategory]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ backgroundColor: '#000000', paddingTop: spacing.xxl, paddingHorizontal: spacing.md, paddingBottom: spacing.md, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md,  marginTop: 20, }}>
          <Text style={{ color: colors.textLight, fontSize: 24, fontWeight: '900',}}>EduHub</Text>
          <TouchableOpacity onPress={() => router.push('../notifications')}>
            <FontAwesome name="bell-o" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: spacing.md, height: 46 }}>
          <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
            style={{ flex: 1, fontSize: 14 }}
          />
          <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#A78BFA', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
            <MaterialIcons name="tune" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <BannerCarousel banners={BANNERS} carouselRef={carouselRef} />

        <Categories
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {coursesInProgress.length > 0 && <CoursesInProgress courses={coursesInProgress} />}

        <CoursesGrid courses={filteredCourses} />
      </ScrollView>
    </>
  );
}

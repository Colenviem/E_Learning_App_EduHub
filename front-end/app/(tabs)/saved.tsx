import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../src/constants/theme';
import { useTheme } from '../_layout';

import { API_BASE_URL } from '@/src/api';

interface Course {
  id: string;
  name: string;
  progress: number;
  image: string;
  isFavorite: boolean;
}

interface CourseCardProps {
  item: Course;
  isGridMode: boolean;
  onLongPress: (course: Course) => void;
  onPress?: (course: Course) => void;
  toggleFavorite: (course: Course) => void;
  colors: any;
}

const CourseCard: React.FC<CourseCardProps> = ({ item, isGridMode, onLongPress, onPress, toggleFavorite, colors }) => (
  <TouchableOpacity
    style={[isGridMode ? styles.cardGrid : styles.cardList, { backgroundColor: colors.cardBg, borderColor: isGridMode ? 'transparent' : colors.border }]}
    activeOpacity={0.8}
    onLongPress={() => onLongPress(item)}
    onPress={() => onPress && onPress(item)}
  >
    <View style={isGridMode ? styles.imageContainerGrid : styles.imageContainerList}>
      <Image
        source={{ uri: item.image && item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}` }}
        style={{ width: '100%', height: '100%', borderRadius: isGridMode ? 14 : 10 }}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={() => {
          toggleFavorite(item);
          onPress && onPress(item);
        }}
        style={styles.bookmarkIcon}
      >

        <Ionicons name="bookmark" size={24} color={item.isFavorite ? '#FFFFFF' : colors.placeholder} />
      </TouchableOpacity>
    </View>

    <View style={styles.infoContainer}>
      <Text style={[styles.courseTitle, { color: colors.textPrimary }]}>{item.name}</Text>
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.placeholder }]}>{Math.round(item.progress * 100)}% hoàn thành</Text>
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function SavedScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isGridMode, setIsGridMode] = useState(true);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = useMemo(() => ({
    primary: '#A78BFA',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#1A1A1A',
    placeholder: isDarkMode ? '#CCC' : '#666',
    border: isDarkMode ? '#333' : '#E0E0E0',
    background: isDarkMode ? '#121212' : '#F8F8F8',
    textLight: '#FFFFFF',
  }), [isDarkMode]);

  const fetchSavedCourses = useCallback(async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return console.warn('Chưa lưu userId');

      const res = await fetch(`${API_BASE_URL}/users/byAccount/${userId}`);
      const userData = await res.json();

      const favoriteCourses = userData.coursesInProgress
        .filter((c: any) => c.isFavorite)
        .map((c: any) => ({
          id: c.courseId,
          name: c.name || 'Khóa học',
          image: c.image,
          progress: c.progress,
          isFavorite: c.isFavorite,
        }));
      setSavedCourses(favoriteCourses);
    } catch (err) {
      console.log('Lỗi load khóa học đã lưu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const toggleViewMode = () => setIsGridMode(prev => !prev);

  const handleRemoveCourse = useCallback((course: Course) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn xóa khóa học "${course.name}" khỏi danh sách đã lưu?`,
      [
        { text: "Hủy", style: "cancel" },

        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem("userId");
              if (!userId) return;

              const res = await fetch(`${API_BASE_URL}/users/${userId}`);
              const user = await res.json();

              let list = user.coursesInProgress || [];

              const existing = list.find((c: any) => c.courseId === course.id);
              if (existing) {
                existing.isFavorite = false;
              }

              await fetch(`${API_BASE_URL}/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coursesInProgress: list }),
              });


              setSavedCourses(prev => prev.filter(c => c.id !== course.id));

            } catch (err) {
              console.log("Lỗi xóa khóa học:", err);
            }
          },
        },
      ]
    );
  }, []);


  const toggleFavorite = useCallback(async (course: Course) => {
    const updated = savedCourses.map(c => c.id === course.id ? { ...c, isFavorite: !c.isFavorite } : c);
    setSavedCourses(updated.filter(c => c.isFavorite));

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      await fetch(`${API_BASE_URL}/users/byAccount/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coursesInProgress: updated }),
      });
    } catch (err) {
      console.log('Lỗi update server:', err);
    }
  }, [savedCourses]);

  const filteredCourses = useMemo(() => savedCourses.filter(course => course.name.toLowerCase().includes(inputValue.toLowerCase())), [inputValue, savedCourses]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header + Search */}
      <View style={{ backgroundColor: isDarkMode ? '#000' : colors.primary, paddingTop: spacing.xxl, paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: 20 }}>
          <Text style={{ color: colors.textLight, fontSize: 24, fontWeight: '900' }}>EduHub</Text>
          <TouchableOpacity onPress={() => router.push('../notifications')}>
            <FontAwesome name="bell-o" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: 14, paddingHorizontal: spacing.md, height: 46 }}>
          <FontAwesome name="search" size={16} color={colors.placeholder} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor={colors.placeholder}
            value={inputValue}
            onChangeText={setInputValue}
            style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}
          />
          <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
            <MaterialIcons name="tune" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.controlBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.listTitle, { color: colors.textPrimary }]}>Khóa học đã lưu ({filteredCourses.length})</Text>
        <TouchableOpacity onPress={toggleViewMode} style={styles.iconButton}>
          <Ionicons name={isGridMode ? 'list-outline' : 'grid-outline'} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
      ) : filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id + (isGridMode ? 'grid' : 'list')}
          key={isGridMode ? 'grid' : 'list'}
          numColumns={isGridMode ? 2 : 1}
          renderItem={({ item }) => (
            <CourseCard
              item={item}
              isGridMode={isGridMode}
              onLongPress={handleRemoveCourse}
              onPress={course => router.push({ pathname: '../course-lessons', params: { courseId: course.id } })}
              toggleFavorite={toggleFavorite}
              colors={colors}
            />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={isGridMode ? styles.columnWrapper : undefined}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="bookmark" size={60} color={colors.placeholder} />
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>Danh sách đã lưu trống</Text>
          <Text style={[styles.emptySubText, { color: colors.placeholder }]}>Hãy tìm kiếm và lưu khóa học bạn quan tâm.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controlBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1 },
  listTitle: { fontSize: 18, fontWeight: '700' },
  iconButton: { padding: spacing.md },
  listContent: { padding: spacing.md, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between' },
  cardGrid: { width: '48%', borderRadius: 14, marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  cardList: { flexDirection: 'row', borderRadius: 12, marginBottom: spacing.sm, padding: spacing.sm, borderWidth: 1 },
  imageContainerGrid: { height: 120, borderTopLeftRadius: 14, borderTopRightRadius: 14, justifyContent: 'center', alignItems: 'center' },
  imageContainerList: { width: 90, height: 90, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  bookmarkIcon: { position: 'absolute', top: 6, right: 6 },
  infoContainer: { padding: spacing.md, flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '700' },
  progressContainer: { marginTop: 6 },
  progressText: { fontSize: 12, marginBottom: 4 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xxl },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubText: { fontSize: 14, marginTop: 4, textAlign: 'center' },
});

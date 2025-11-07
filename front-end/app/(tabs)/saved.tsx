import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { colors, spacing } from '../../src/constants/theme';

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primary: '#A78BFA',
  dark: '#000000',
  background: '#F8F8F8',
  cardBg: '#FFFFFF',
  textLight: '#FFFFFF',
  textPrimary: '#1A1A1A',
  placeholder: '#666',
  border: '#E0E0E0',
  danger: '#ff4d4f',
};

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const INITIAL_SAVED_COURSES = [
  { id: '1', name: 'React Native Cơ Bản', image: 'https://via.placeholder.com/150/5E72E4/FFFFFF?text=RN', progress: 60 },
  { id: '2', name: 'Spring Boot Nâng Cao', image: 'https://via.placeholder.com/150/FFA726/FFFFFF?text=SB', progress: 0 },
  { id: '3', name: 'Thiết Kế UI/UX', image: 'https://via.placeholder.com/150/66BB6A/FFFFFF?text=UI', progress: 100 },
  { id: '4', name: 'Python Cho Người Mới', image: 'https://via.placeholder.com/150/EF5350/FFFFFF?text=Py', progress: 25 },
  { id: '5', name: 'Kubernetes Essentials', image: 'https://via.placeholder.com/150/42A5F5/FFFFFF?text=K8s', progress: 75 },
];

interface Course {
  id: string;
  name: string;
  progress: number;
}

interface CourseCardProps {
  item: Course;
  isGridMode: boolean;
  onLongPress: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ item, isGridMode, onLongPress }) => {
  return (
    <TouchableOpacity
      style={isGridMode ? styles.cardGrid : styles.cardList}
      activeOpacity={0.8}
      onLongPress={() => onLongPress(item)}
    >
      <View style={isGridMode ? styles.imageContainerGrid : styles.imageContainerList}>
        <Ionicons name="bookmark" size={24} color={COLORS.primary} style={styles.bookmarkIcon} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.courseTitle}>{item.name}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{item.progress}% hoàn thành</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default function SavedScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridMode, setIsGridMode] = useState(true);
  const [savedCourses, setSavedCourses] = useState(INITIAL_SAVED_COURSES);
  const [inputValue, setInputValue] = useState('');
  const filteredCourses = useMemo(
    () => savedCourses.filter(course => course.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, savedCourses]
  );

  const toggleViewMode = () => setIsGridMode(prev => !prev);

  const handleRemoveCourse = useCallback((course: Course) => {
  Alert.alert(
    'Xác nhận Xóa',
    `Bạn có muốn xóa khóa học "${course.name}" khỏi danh sách đã lưu?`,
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setSavedCourses(prevCourses =>
            prevCourses.filter(item => item.id !== course.id)
          );
          Alert.alert('Thành công', `Đã xóa "${course.name}".`);
        },
      },
    ]
  );
}, []);

  const handleSortFilter = () => {
    Alert.alert('Chức năng Lọc/Sắp xếp', 'Sắp xếp theo Ngày lưu, Tên (A-Z) hoặc Danh mục.');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ backgroundColor: '#000000', paddingTop: spacing.xxl, paddingHorizontal: spacing.md, paddingBottom: spacing.md, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: 20, }}>
          <Text style={{ color: colors.textLight, fontSize: 24, fontWeight: '900', }}>EduHub</Text>
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

      <View style={styles.controlBar}>
        <Text style={styles.listTitle}>Khóa học đã lưu ({filteredCourses.length})</Text>
        <TouchableOpacity onPress={toggleViewMode} style={styles.iconButton}>
          <Ionicons name={isGridMode ? 'list-outline' : 'grid-outline'} size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          keyExtractor={item => item.id + (isGridMode ? 'grid' : 'list')}
          key={isGridMode ? 'grid' : 'list'}
          numColumns={isGridMode ? 2 : 1}
          renderItem={({ item }) => (
            <CourseCard item={item} isGridMode={isGridMode} onLongPress={handleRemoveCourse} />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={isGridMode ? styles.columnWrapper : null}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="bookmark" size={60} color={COLORS.placeholder} />
          <Text style={styles.emptyText}>Danh sách đã lưu trống</Text>
          <Text style={styles.emptySubText}>Hãy tìm kiếm và lưu khóa học bạn quan tâm.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.dark,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appTitle: { color: COLORS.textLight, fontSize: 26, fontWeight: '900' },
  iconButton: { padding: SPACING.md },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textLight,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },

  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  listTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },

  listContent: { padding: SPACING.md, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between' },

  cardGrid: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardList: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainerGrid: {
    height: 120,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainerList: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  imagePlaceholder: { color: COLORS.textLight, fontWeight: 'bold' },
  bookmarkIcon: { position: 'absolute', top: 6, right: 6 },

  infoContainer: { padding: SPACING.md, flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  progressContainer: { marginTop: 6 },
  progressText: { fontSize: 12, color: COLORS.placeholder, marginBottom: 4 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xxl },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16 },
  emptySubText: { fontSize: 14, color: COLORS.placeholder, marginTop: 4, textAlign: 'center' },
});

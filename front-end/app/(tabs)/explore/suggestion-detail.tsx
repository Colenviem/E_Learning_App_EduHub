import { API_BASE_URL } from '@/src/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export const TAB_BAR_STYLE = {
  height: 60,
  paddingBottom: 10,
  paddingTop: 8,
  position: 'absolute',
  bottom: 25,
  left: 10,
  right: 10,
  borderRadius: 15,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
};

interface Course {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  rating: number;
  numberOfParticipants: number;
  time: string;
  price: number;
  discount: number;
}

const SuggestionDetailList: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [newsItem, setNewsItem] = useState<Course | null>(null);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

    navigation.setOptions({
      headerTitle: 'Chi tiết khóa học nổi bật',
      headerLeft: () => (
        <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      ),
    });

    return () => {
      parent?.setOptions({ tabBarStyle: TAB_BAR_STYLE });
    };
  }, [navigation, newsItem]);



  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Course }) => {
    const finalPrice = item.price - (item.price * item.discount) / 100;
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`../../course-lessons?courseId=${item._id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <View style={styles.infoRow}>
          <Text>⭐ {item.rating}</Text>
          <Text>{item.numberOfParticipants} học viên
            {"\n"}
            ⏱ {item.time}</Text>
        </View>
        <View style={styles.priceRow}>
          {item.discount > 0 && <Text style={styles.oldPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>}
          <Text style={styles.price}>{finalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={courses}
      numColumns={2}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: '48%',
    marginRight: 8,
  },
  image: { width: '100%', height: 120, borderRadius: 12, marginBottom: 8 },
  title: { fontWeight: '700', fontSize: 16, color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  oldPrice: { textDecorationLine: 'line-through', color: '#9CA3AF', fontSize: 12 },
  price: { fontWeight: '800', color: '#EF4444', fontSize: 16 },
});

export default SuggestionDetailList;

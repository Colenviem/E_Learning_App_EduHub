import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const CATEGORY_COLORS: Record<string, string> = {
  'Công nghệ': '#E0E7FF',
  'Văn hóa': '#FFE0E0',
  'Xã hội': '#E0FFE0',
  'Giáo dục': '#FFF0E0',
  'Môi trường': '#E0FFF7',
  'Khoa học': '#F0E0FF',
};

interface NewsItem {
  _id: string;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
}

interface NewsCardProps {
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  onPress?: () => void;
  style?: any;
}
const NewsCard: React.FC<NewsCardProps> = ({ title, date, imageUrl, category, onPress, style }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.card,
      style,
      pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
    ]}
  >
    <View style={{ position: 'relative' }}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={[styles.categoryBadge, {
        backgroundColor: CATEGORY_COLORS[category] || '#E0E7FF',
        position: 'absolute',
        top: 8,
        left: 8,
      }]}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  </Pressable>
);

export default function TinTuc() {
  const navigation = useNavigation();
  const router = useRouter();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const handleGoBack = () => router.back();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

    navigation.setOptions({
      headerTitle: 'Tin Tức',
      headerLeft: () => (
        <Pressable onPress={handleGoBack} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#ffff" />
        </Pressable>
      ),
    });

    return () => {
      parent?.setOptions({ tabBarStyle: TAB_BAR_STYLE });
    };
  }, [navigation]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://192.168.0.102:5000/news');
        const data: NewsItem[] = await res.json();
        setNewsData(data);

        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(['Tất cả', ...uniqueCategories]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const filteredNews = selectedCategory === 'Tất cả'
    ? newsData
    : newsData.filter(n => n.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 20 }}
      >

        {categories.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              minWidth: 80,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              marginRight: 12,
              flexShrink: 0,
              backgroundColor: selectedCategory === cat ? '#4F46E5' : '#E5E7EB',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
              height: 36,
            }}
          >
            <Text
              style={{
                color: selectedCategory === cat ? '#fff' : '#111827',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.newsGrid}>
          {filteredNews.map((news, index) => (
            <NewsCard
              key={news._id}
              {...news}
              style={{

              }}
              onPress={() =>
                router.push({
                  pathname: './tintuc-detail',
                  params: { id: news._id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  newsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  image: { width: '100%', height: 150, backgroundColor: '#E5E7EB' },
  cardContent: { padding: 12 },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryText: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4, lineHeight: 22 },
  date: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
});

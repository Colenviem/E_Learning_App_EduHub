import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const NEWS_DATA = [
  { id: '1', title: 'JavaScript ES2025: Những tính năng mới', date: '5 tháng 11, 2025', imageUrl: 'https://picsum.photos/id/201/400/250', category: 'Công nghệ' },
  { id: '2', title: 'React Native 0.76: Hooks và Navigation nâng cao', date: '3 tháng 11, 2025', imageUrl: 'https://picsum.photos/id/202/400/250', category: 'Công nghệ' },
  { id: '3', title: 'Spring Boot 3.5.7: Tối ưu REST API', date: '1 tháng 11, 2025', imageUrl: 'https://picsum.photos/id/203/400/250', category: 'Công nghệ' },
  { id: '4', title: 'AI & ML cho Dev: ChatGPT tích hợp vào workflow', date: '30 tháng 10, 2025', imageUrl: 'https://picsum.photos/id/204/400/250', category: 'Công nghệ' },
  { id: '5', title: 'Docker & Kubernetes: Tips deploy hiệu quả', date: '28 tháng 10, 2025', imageUrl: 'https://picsum.photos/id/205/400/250', category: 'Công nghệ' },
  { id: '6', title: 'VS Code Extensions Devs nên biết', date: '25 tháng 10, 2025', imageUrl: 'https://picsum.photos/id/206/400/250', category: 'Công nghệ' },
];


const CATEGORY_COLORS: Record<string, string> = {
  'Công nghệ': '#E0E7FF',
  'Văn hóa': '#FFE0E0',
  'Xã hội': '#E0FFE0',
  'Giáo dục': '#FFF0E0',
  'Môi trường': '#E0FFF7',
  'Khoa học': '#F0E0FF',
};

interface NewsCardProps {
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  onPress?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, date, imageUrl, category, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.card,
      pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
    ]}
  >
    <Image source={{ uri: imageUrl }} style={styles.image} />
    <View style={styles.cardContent}>
      <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[category] || '#E0E7FF' }]} >
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  </Pressable>
);

export default function TinTuc() {
  const navigation = useNavigation();
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.newsGrid}>
          {NEWS_DATA.map(news => (
            <NewsCard
              key={news.id}
              {...news}
              onPress={() =>
                router.push({
                  pathname: './tintuc-detail',
                  params: { newsItem: JSON.stringify(news) },
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
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4, lineHeight: 22 },
  date: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
});

import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const NEWS_DATA = [
  {
    id: '1',
    title: 'TSMC will build a second factory in Japan',
    date: '24 tháng 10, 2025',
    imageUrl: 'https://picsum.photos/id/101/200/150'
  },
  {
    id: '2',
    title: 'Louvre reopens after French crown jewel...',
    date: '22 tháng 10, 2025',
    imageUrl: 'https://picsum.photos/id/102/200/150'
  },
  {
    id: '3',
    title: 'Gen Z project around the world',
    date: '15 tháng 10, 2025',
    imageUrl: 'https://picsum.photos/id/103/200/150'
  },
];
interface NewsCardProps {
  title: string;
  date: string;
  imageUrl: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, date, imageUrl }) => (
  <TouchableOpacity style={newsStyles.card}>
    <Image source={{ uri: imageUrl }} style={newsStyles.image} />
    <Text style={newsStyles.title} numberOfLines={2}>{title}</Text>
    <Text style={newsStyles.date}>{date}</Text>
  </TouchableOpacity>
);

const NewsSection: React.FC = () => {
  const router = useRouter();

  const handleShowAll = () => {
    router.push('../explore/tintuc');
  };

  const handleNewsPress = (newsItem: any) => {
    console.log('Đã chọn tin:', newsItem.title);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin tức</Text>
        <TouchableOpacity onPress={handleShowAll}>
          <Text style={styles.linkText}>Hiển thị tất cả &gt;</Text>
        </TouchableOpacity>

      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {NEWS_DATA.map(news => (
          <NewsCard key={news.id} {...news} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  linkText: {
    fontSize: 14,
    color: '#3F83F8',
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: 5,
  }
});

const newsStyles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F7F7F7',
  },
  image: {
    width: '100%',
    height: 90,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    marginBottom: 4,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    paddingHorizontal: 8,
    paddingBottom: 8,
  }
});

export default NewsSection;
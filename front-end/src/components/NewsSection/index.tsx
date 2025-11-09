import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NEWS_DATA = [
  {
    id: '1',
    title: 'JavaScript ES2025: Những tính năng mới bạn cần biết',
    date: '5 tháng 11, 2025',
    imageUrl: 'https://picsum.photos/id/105/200/150'
  },
  {
    id: '2',
    title: 'Hướng dẫn sử dụng React Native Navigation nâng cao',
    date: '3 tháng 11, 2025',
    imageUrl: 'https://picsum.photos/id/106/200/150'
  },
  {
    id: '3',
    title: 'Spring Boot 3.5.7: Tối ưu hoá REST API và bảo mật',
    date: '1 tháng 11, 2025',
    imageUrl: 'https://picsum.photos/id/107/200/150'
  },
];


interface NewsCardProps {
  title: string;
  date: string;
  imageUrl: string;
  onPress?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, date, imageUrl, onPress }) => (
  <TouchableOpacity style={newsStyles.card} onPress={onPress}>
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
    router.push({
      pathname: '../explore/tintuc-detail',
      params: { newsItem: JSON.stringify(newsItem) },
    });
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
          <NewsCard
            key={news.id}
            {...news}
            onPress={() => handleNewsPress(news)}
          />
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

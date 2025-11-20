import { API_BASE_URL } from '@/src/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsCardProps {
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  likes: number;
  comments: any[];
  onPress?: () => void;
  colors?: {
    cardBg?: string;
    titleColor?: string;
    dateColor?: string;
    textColor?: string;
    badgeBg?: string;
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  title, 
  date, 
  imageUrl, 
  category, 
  likes, 
  comments, 
  onPress,
  colors = {},
}) => {
  const formatNumber = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  return (
    <TouchableOpacity 
      style={[newsStyles.card, { backgroundColor: colors.cardBg || '#FFFFFF', borderColor: colors.cardBg ? 'transparent' : '#F3F4F6' }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={newsStyles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={newsStyles.image} />
        <View style={[newsStyles.categoryBadge, { backgroundColor: colors.badgeBg || 'rgba(59,130,246,0.95)' }]}>
          <Text style={newsStyles.categoryText}>{category}</Text>
        </View>
      </View>
      
      <View style={newsStyles.content}>
        <Text style={[newsStyles.title, { color: colors.titleColor || '#1F2937' }]} numberOfLines={2}>{title}</Text>
        <Text style={[newsStyles.date, { color: colors.dateColor || '#6B7280' }]}>{date}</Text>
        
        <View style={newsStyles.statsRow}>
          <View style={newsStyles.statItem}>
            <Text style={newsStyles.statIcon}>❤️</Text>
            <Text style={[newsStyles.statText, { color: colors.textColor || '#6B7280' }]}>{formatNumber(likes)}</Text>
          </View>
          <View style={newsStyles.statItem}>
            <Text style={newsStyles.statIcon}>💬</Text>
            <Text style={[newsStyles.statText, { color: colors.textColor || '#6B7280' }]}>{comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewsSection: React.FC<{ colors?: { cardBg?: string; titleColor?: string; dateColor?: string; textColor?: string; badgeBg?: string } }> = ({ colors }) => {
  const router = useRouter();
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/news`);
        const data = await res.json();
        setNewsList(data);
      } catch (err) {
        console.error('Lỗi fetch news:', err);
      }
    };
    fetchNews();
  }, []);

  const handleShowAll = () => router.push('../explore/tintuc');
  const handleNewsPress = (newsItem: any) => router.push({ pathname: '../explore/tintuc-detail', params: { id: newsItem._id } });

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors?.titleColor || '#1F2937' }]}>Tin tức</Text>
        <TouchableOpacity onPress={handleShowAll} activeOpacity={0.7}>
          <Text style={[styles.linkText, { color: colors?.badgeBg || '#3B82F6' }]}>Hiển thị tất cả &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {newsList.map(news => (
          <NewsCard 
            key={news._id} 
            title={news.title} 
            date={news.date} 
            imageUrl={news.imageUrl}
            category={news.category}
            likes={news.likes}
            comments={news.comments}
            onPress={() => handleNewsPress(news)} 
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: 0.3 },
  linkText: { fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingVertical: 5 }
});

const newsStyles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  imageContainer: { position: 'relative', width: '100%', height: 120 },
  image: { width: '100%', height: '100%' },
  categoryBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  content: { padding: 12 },
  title: { fontSize: 14, fontWeight: '700', marginBottom: 6, lineHeight: 19 },
  date: { fontSize: 12, marginBottom: 10, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 14 },
  statText: { fontSize: 12, fontWeight: '600' },
});

export default NewsSection;

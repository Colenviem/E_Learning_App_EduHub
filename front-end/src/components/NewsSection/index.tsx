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
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  title, 
  date, 
  imageUrl, 
  category, 
  likes, 
  comments, 
  onPress 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <TouchableOpacity style={newsStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={newsStyles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={newsStyles.image} />
        <View style={newsStyles.categoryBadge}>
          <Text style={newsStyles.categoryText}>{category}</Text>
        </View>
      </View>
      
      <View style={newsStyles.content}>
        <Text style={newsStyles.title} numberOfLines={2}>{title}</Text>
        <Text style={newsStyles.date}>{date}</Text>
        
        <View style={newsStyles.statsRow}>
          <View style={newsStyles.statItem}>
            <Text style={newsStyles.statIcon}>❤️</Text>
            <Text style={newsStyles.statText}>{formatNumber(likes)}</Text>
          </View>
          <View style={newsStyles.statItem}>
            <Text style={newsStyles.statIcon}>💬</Text>
            <Text style={newsStyles.statText}>{comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NewsSection: React.FC = () => {
  const router = useRouter();
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://192.168.0.102:5000/news'); 
        const data = await res.json();
        setNewsList(data);
      } catch (err) {
        console.error('Lỗi fetch news:', err);
      }
    };
    fetchNews();
  }, []);

  const handleShowAll = () => router.push('../explore/tintuc');
  
  const handleNewsPress = (newsItem: any) => {
    router.push({ 
      pathname: '../explore/tintuc-detail', 
      params: { id: newsItem._id } 
    });
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin tức</Text>
        <TouchableOpacity onPress={handleShowAll} activeOpacity={0.7}>
          <Text style={styles.linkText}>Hiển thị tất cả &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: 5,
  }
});

const newsStyles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 19,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default NewsSection;
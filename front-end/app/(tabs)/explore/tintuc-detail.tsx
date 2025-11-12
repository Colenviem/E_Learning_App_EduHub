import { Entypo, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TAB_BAR_STYLE } from './tintuc';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
}

interface NewsItem {
  _id: string;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  comments: Comment[];
  likes: number;
  content?: string;
}



export default function TintucDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const newsId = params.id as string;

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  const API_BASE_URL = 'http://192.168.0.102:5000';

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

    navigation.setOptions({
      headerTitle: newsItem?.category || 'Chi tiết tin tức',
      headerLeft: () => (
        <Pressable onPress={() => router.push('/explore')} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      ),
    });

    return () => {
      parent?.setOptions({ tabBarStyle: TAB_BAR_STYLE });
    };
  }, [navigation, newsItem]);

  useEffect(() => {
    const fetchNewsById = async () => {
      try {
        const res = await fetch(`http://${API_BASE_URL}/news/${newsId}`);
        if (!res.ok) throw new Error('Không tìm thấy tin tức');
        const data: NewsItem = await res.json();
        setNewsItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (newsId) fetchNewsById();
  }, [newsId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!newsItem) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy tin tức.</Text>
      </View>
    );
  }
const handleLike = async () => {
  try {
    setLiked(prev => !prev);
    const res = await fetch(`http://${API_BASE_URL}/news/${newsId}/like`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Lỗi khi like');
    const updatedNews = await res.json();
    setNewsItem(updatedNews);
  } catch (err) {
    console.error(err);
  }
};

const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    const newComment = {
      _id: Date.now().toString(),
      text: commentText.trim(),
    };

    const res = await fetch(`http://${API_BASE_URL}/news/${newsId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });

    if (!res.ok) throw new Error('Lỗi khi thêm comment');

    const updatedNews: NewsItem = await res.json();
    setNewsItem(updatedNews);
    setCommentText('');
  } catch (err) {
    console.error(err);
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.category}>{newsItem.category}</Text>
      <Text style={styles.title}>{newsItem.title}</Text>
      <Text style={styles.date}>{newsItem.date}</Text>

      {newsItem.imageUrl && (
        <Image source={{ uri: newsItem.imageUrl }} style={styles.image} />
      )}

      <Text style={styles.content}>
        {newsItem.content || `Đây là nội dung chi tiết cho bài viết "${newsItem.title}".`}
      </Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#EF4444' : '#111'} />
          <Text style={styles.actionText}>{liked ? newsItem.likes + 1 : newsItem.likes} Likes</Text>
        </Pressable>

        <Pressable style={styles.actionButton} >
          <Entypo name="share" size={24} color="#111" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.commentBox}>
        <TextInput
          style={styles.commentInput}
          placeholder="Viết bình luận..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <Pressable onPress={handleAddComment} style={styles.commentSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>

      {newsItem.comments.map((cmt) => (
        <View key={cmt._id} style={styles.commentItem}>
          <Text style={styles.commentText}>{cmt.text}</Text>
          <Text style={styles.commentDate}>{new Date(cmt.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  category: { fontSize: 12, fontWeight: '700', color: '#4F46E5', marginBottom: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  date: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 12 },
  image: { width: '100%', height: 250, borderRadius: 16, marginBottom: 16 },
  content: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, fontSize: 14, color: '#111' },
  commentBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  commentInput: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  commentSend: { marginLeft: 8, backgroundColor: '#4F46E5', padding: 10, borderRadius: 12 },
  commentItem: { backgroundColor: '#fff', padding: 10, borderRadius: 12, marginBottom: 8 },
  commentText: { fontSize: 14, color: '#111' },
  commentDate: { fontSize: 10, color: '#888', marginTop: 2 },
});

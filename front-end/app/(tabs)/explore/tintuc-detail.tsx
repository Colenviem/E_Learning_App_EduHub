import { Entypo, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { TAB_BAR_STYLE } from './tintuc';

export default function TintucDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const newsItem = params.newsItem ? JSON.parse(params.newsItem as string) : null;

  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

    navigation.setOptions({
      headerTitle: newsItem?.title || 'Chi tiết tin tức',
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

  if (!newsItem) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#111', fontSize: 16 }}>Không tìm thấy tin tức.</Text>
      </View>
    );
  }

  const handleLike = () => setLiked(prev => !prev);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title}\n\nXem chi tiết tại app của bạn.`,
      });
    } catch (error) {
      console.log('Lỗi share:', error);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments(prev => [...prev, commentText.trim()]);
      setCommentText('');
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
        Đây là nội dung chi tiết cho bài viết "{newsItem.title}".
      </Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#EF4444' : '#111'} />
          <Text style={styles.actionText}>{liked ? 'Liked' : 'Like'}</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Entypo name="share" size={24} color="#111" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#111" />
          <Text style={styles.actionText}>{comments.length} Comment</Text>
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

      {comments.map((cmt, index) => (
        <View key={index} style={styles.commentItem}>
          <Text style={styles.commentText}>{cmt}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
});

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../_layout';

import FeatureCard from '../../../src/components/FeatureCard';
import NewsSection from '../../../src/components/NewsSection';
import SuggestionSection from '../../../src/components/SuggestionSection';

type PostType = {
  id: string;
  topic: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: string[];
};

export default function ExploreScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams() || {};
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    cardBg: isDarkMode ? '#1E1E1E' : '#F3F4F6',
    text: isDarkMode ? '#FFF' : '#000',
    subText: isDarkMode ? '#CCC' : '#444',
    accent: '#A78BFA',
  };

  useEffect(() => {
    if (searchParams.newPost) {
      const newPost = JSON.parse(searchParams.newPost as string);
      setPosts(prev => [newPost, ...prev]);
    }
  }, [searchParams.newPost]);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Khám phá</Text>

        <View style={styles.sectionContainer}>
          <FeatureCard
            title="Trò chuyện với bạn AI"
            subtitle="Trò chuyện về mọi thứ"
            iconName="user"
            onPress={() => router.push('/explore/chat-with-ai')}
            cardBg={colors.cardBg}
            textColor={colors.text}
          />
          <FeatureCard
            title="Tạo của riêng bạn"
            subtitle="Luyện tập tình huống thực tế"
            iconName="magic"
            onPress={() => router.push('/explore/discussion')}
            cardBg={colors.cardBg}
            textColor={colors.text}
          />
        </View>

        {posts.length > 0 && (
          <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bài viết mới</Text>
            {posts.map(post => (
              <TouchableOpacity
                key={post.id}
                style={[styles.postCard, { backgroundColor: colors.cardBg }]}
                onPress={() =>
                  router.push({
                    pathname: '/explore/discussion',
                    params: { post: JSON.stringify(post) },
                  })
                }
              >
                <Text style={[styles.postTopic, { color: colors.text }]}>{post.topic}</Text>
                <Text style={[styles.postContent, { color: colors.subText }]} numberOfLines={2}>
                  {post.content}
                </Text>
                {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <NewsSection
          colors={{
            cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
            titleColor: isDarkMode ? '#FFF' : '#1F2937',
            dateColor: isDarkMode ? '#CCC' : '#6B7280',
            textColor: isDarkMode ? '#CCC' : '#6B7280',
            badgeBg: isDarkMode ? '#3B82F6AA' : 'rgba(59,130,246,0.95)',
          }}
        />

        <SuggestionSection
          colors={{
            cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
            titleColor: isDarkMode ? '#FFF' : '#1F2937',
            textColor: isDarkMode ? '#CCC' : '#6B7280',
            priceColor: isDarkMode ? '#EF4444' : '#EF4444',
            oldPriceColor: isDarkMode ? '#9CA3AF' : '#9CA3AF',
          }}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  postTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 6,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 6,
  },
});

import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FeatureCard from '../../../src/components/FeatureCard';
import NewsSection from '../../../src/components/NewsSection';
import SuggestionSection from '../../../src/components/SuggestionSection';

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Khám phá'
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Khám phá</Text>

        <View style={styles.sectionContainer}>
          <FeatureCard
            title="Trò chuyện với bạn AI"
            subtitle="Trò chuyện về mọi thứ"
            iconName="user"
            onPress={() => { router.push('/explore/chat-with-ai'); }}
          />
          <FeatureCard
            title="Trò chuyện với gia sư AI"
            subtitle="Hỏi câu hỏi, nhận câu trả lời"
            iconName="graduation-cap"
            onPress={() => { router.push('/explore/tutor-ai'); }}
          />
          <FeatureCard
            title="Tạo của riêng bạn"
            subtitle="Luyện tập tình huống thực tế"
            iconName="magic"
            onPress={() => { router.push('/explore/create-your-own'); }}
          />
        </View>

        <NewsSection />

        <SuggestionSection />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
import { Stack } from 'expo-router';
import React from 'react';

export default function ExploreStack() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#6C63FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat-with-ai" options={{ title: 'Trò chuyện với AI' }} />
      <Stack.Screen name="tutor-ai" options={{ title: 'Gia sư AI' }} />
      <Stack.Screen name="discussion" options={{ title: 'Thảo luận' }} />
      <Stack.Screen name="tintuc" options={{ title: 'Tin tức' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
    
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="settings/index" /> */}
      <Stack.Screen name="edit" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="history" />
      <Stack.Screen name="assessment" />
      {/* <Stack.Screen name="saved" />
      <Stack.Screen name="stats" /> */}
      <Stack.Screen name="completed" />
    </Stack>
  );
}

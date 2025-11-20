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
      <Stack.Screen name="edit" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="history" />
      <Stack.Screen name="assessment" />
      <Stack.Screen name="heatmapStats" />
      <Stack.Screen name="review" />
      <Stack.Screen name="completed" />
    </Stack>
  );
}

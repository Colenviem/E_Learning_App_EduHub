import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="CoursePayment" options={{ headerShown: false }} />
        <Stack.Screen name="SuccessPayment" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
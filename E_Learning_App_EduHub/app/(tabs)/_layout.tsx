import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../constants/theme';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const TAB_WIDTH = width * 0.8;
  const TAB_HEIGHT = 60;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.grayText,
        tabBarStyle: {
          position: 'absolute',
          top: (height - TAB_HEIGHT) / 2,   // căn giữa dọc
          left: (width - TAB_WIDTH) / 2,    // căn giữa ngang
          width: TAB_WIDTH,
          height: TAB_HEIGHT,
          borderRadius: TAB_HEIGHT / 2,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 20,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="course/[id]"
        options={{
          tabBarIcon: ({ color }) => <Feather name="bookmark" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="payDetail"
        options={{
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
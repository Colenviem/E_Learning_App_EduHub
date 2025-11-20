import { API_BASE_URL } from '@/src/api';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { spacing } from '../src/constants/theme';
import { useTheme } from './_layout';

const API = `${API_BASE_URL}/notifications`;

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isDarkMode } = useTheme();

  const themeColors = {
    background: isDarkMode ? '#000' : '#F7F7F7',
    cardBg: isDarkMode ? '#121212' : '#FFF',
    text: isDarkMode ? '#FFF' : '#333',
    subText: isDarkMode ? '#AAA' : '#555',
    border: isDarkMode ? '#222' : '#DDD',
    accent: '#A78BFA',
  };

  const fetch = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const response = await axios.get(`${API}/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const renderNotification = (item: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: themeColors.cardBg,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: item.unread ? 1 : 0,
        borderColor: item.unread ? themeColors.accent : 'transparent',
        shadowColor: '#000',
        shadowOpacity: item.unread ? 0.15 : 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ color: themeColors.accent, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
        {item.type === 'course' ? 'Khóa học' : 'Bài học'}
      </Text>

      <Text style={{ color: themeColors.text, fontSize: 15, marginBottom: 4 }}>
        {item.message}
      </Text>

      <Text style={{ color: themeColors.subText, fontSize: 12 }}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          paddingTop: 50,
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={22} color={themeColors.text} />
        </TouchableOpacity>

        <Text style={{ color: themeColors.text, fontSize: 18, fontWeight: '700' }}>
          Thông báo
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => renderNotification(item)}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <FontAwesome name="bell-o" size={60} color={themeColors.subText} />
            <Text style={{ color: themeColors.subText, marginTop: 12, fontSize: 16 }}>
              Không có thông báo nào
            </Text>
          </View>
        }
      />
    </View>
  );
}

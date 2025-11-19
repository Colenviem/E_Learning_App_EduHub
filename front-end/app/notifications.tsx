import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = "http://192.168.2.6:5000/notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);

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
        backgroundColor: '#121212',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: item.unread ? 1 : 0,
        borderColor: item.unread ? '#A78BFA' : 'transparent',
        shadowColor: '#000',
        shadowOpacity: item.unread ? 0.15 : 0,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      }}
      activeOpacity={0.8}
    >
      <Text
        style={{
          color: '#A78BFA',
          fontWeight: '700',
          fontSize: 14,
          marginBottom: 4,
        }}
      >
        {item.type === 'course' ? 'Khóa học' : 'Bài học'}
      </Text>
      <Text
        style={{
          color: colors.textLight,
          fontWeight: '400',
          fontSize: 15,
          marginBottom: 4,
        }}
      >
        {item.message}
      </Text>
      <Text style={{ color: '#777', fontSize: 12 }}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          paddingTop: 50,
          backgroundColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: '#222',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={22} color={colors.textLight} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.textLight,
            fontSize: 18,
            fontWeight: '700',
          }}
        >
          Thông báo
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => renderNotification(item)}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <FontAwesome name="bell-o" size={60} color="#555" />
            <Text style={{ color: '#777', marginTop: 12, fontSize: 16 }}>
              Không có thông báo nào
            </Text>
          </View>
        }
      />
    </View>
  );
}
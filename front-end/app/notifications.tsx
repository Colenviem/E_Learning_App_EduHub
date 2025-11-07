import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../src/constants/theme';

const NOTIFICATIONS = [
  {
    id: '1',
    title: '🎓 Khóa học mới: React Native Pro đã mở!',
    time: '2 giờ trước',
    unread: true,
  },
  {
    id: '2',
    title: '🔥 Bạn đã hoàn thành 50% khóa học “JavaScript Hiện Đại”',
    time: 'Hôm qua',
    unread: false,
  },
  {
    id: '3',
    title: '⚙️ Hệ thống đã cập nhật tính năng mới: Ghi nhớ tiến độ học!',
    time: '3 ngày trước',
    unread: true,
  },
  {
    id: '4',
    title: '📚 Đừng quên ôn lại kiến thức React Hooks!',
    time: '1 tuần trước',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.md,
          backgroundColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: '#222',
          paddingTop: 50,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={20} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={{ color: colors.textLight, fontSize: 18, fontWeight: '700' }}>
          Thông báo
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: item.unread ? '#111' : '#0A0A0A',
              padding: spacing.md,
              borderRadius: 16,
              marginBottom: spacing.sm,
              borderWidth: item.unread ? 1 : 0,
              borderColor: '#A78BFA',
              shadowColor: '#A78BFA',
              shadowOpacity: item.unread ? 0.2 : 0,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: colors.textLight,
                fontWeight: item.unread ? '700' : '400',
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              {item.title}
            </Text>
            <Text style={{ color: '#999', fontSize: 12 }}>{item.time}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <FontAwesome name="bell-o" size={50} color="#555" />
            <Text style={{ color: '#777', marginTop: 10 }}>
              Không có thông báo nào
            </Text>
          </View>
        }
      />
    </View>
  );
}

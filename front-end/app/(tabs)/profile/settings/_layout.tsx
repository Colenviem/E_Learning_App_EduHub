import { Stack } from 'expo-router';
import React from 'react';


export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Cài đặt',
        }}
      />

      <Stack.Screen
        name="account_type"
        options={{
          title: 'Loại tài khoản',
        }}
      />
      <Stack.Screen
        name="chat_settings"
        options={{
          title: 'Cài đặt Chat',
        }}
      />
      <Stack.Screen
        name="content_settings"
        options={{
          title: 'Cài đặt Nội dung',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Hỗ trợ & Trợ giúp',
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: 'Điều khoản Dịch vụ',
        }}
      />
      <Stack.Screen name="promo" options={{ title: 'Mã khuyến mãi' }} />
      <Stack.Screen name="restore" options={{ title: 'Khôi phục Mua hàng' }} />
      <Stack.Screen name="review" options={{ title: 'Đánh giá Ứng dụng' }} />
      <Stack.Screen name="upgrade" options={{ title: 'Nâng cấp Tài khoản' }} />

    </Stack>
  );
}
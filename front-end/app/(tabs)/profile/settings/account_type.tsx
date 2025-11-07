import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>Loại tài khoản</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Gói hiện tại: Cơ bản</Text>
        <Text style={{ marginTop: 10, fontSize: 14, color: '#999' }}>
          Nâng cấp lên Premium để mở khóa toàn bộ khóa học và tính năng nâng cao.
        </Text>
      </View>
    </View>
  );
}

import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountTypeScreen() {
  const router = useRouter();

  const [currentPlan, setCurrentPlan] = useState('Cơ bản');

  const plans = [
    {
      id: '1',
      name: 'Cơ bản',
      price: 'Miễn phí',
      features: ['Truy cập khóa học miễn phí', 'Giới hạn bài học mỗi ngày', 'Không có thống kê nâng cao'],
      icon: 'user',
      color: '#A78BFA',
    },
    {
      id: '2',
      name: 'Premium',
      price: '79.000đ / tháng',
      features: ['Truy cập toàn bộ khóa học', 'Lưu tiến độ học tập', 'Thống kê kỹ năng chi tiết'],
      icon: 'star',
      color: '#A78BFA',
    },
    {
      id: '3',
      name: 'Pro',
      price: '129.000đ / tháng',
      features: ['Toàn bộ tính năng Premium', 'AI Mentor hướng dẫn trực tiếp', 'Bài tập thử thách nâng cao'],
      icon: 'award',
      color: '#A78BFA',
    },
  ];

  const handleUpgrade = (plan : any) => {
    if (plan.name === currentPlan) {
      Alert.alert('Thông báo', `Bạn đang sử dụng gói ${plan.name}.`);
    } else {
      setCurrentPlan(plan.name);
      Alert.alert('Thành công', `Đã nâng cấp lên gói ${plan.name}!`);
    }
  };

  const renderPlan = ({ item } : any) => (
    <View style={[styles.planCard, { borderColor: item.color }]}>
      <View style={styles.planHeader}>
        <Feather name={item.icon} size={22} color={item.color} />
        <Text style={[styles.planName, { color: item.color }]}>{item.name}</Text>
      </View>

      <Text style={styles.planPrice}>{item.price}</Text>

      {item.features.map((f : any, idx : any) => (
        <View key={idx} style={styles.featureRow}>
          <Feather name="check" size={16} color="#48BB78" />
          <Text style={styles.featureText}>{f}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.upgradeBtn,
          { backgroundColor: item.name === currentPlan ? '#E2E8F0' : item.color },
        ]}
        onPress={() => handleUpgrade(item)}
        disabled={item.name === currentPlan}
      >
        <Text
          style={[
            styles.upgradeText,
            { color: item.name === currentPlan ? '#666' : '#FFF' },
          ]}
        >
          {item.name === currentPlan ? 'Đang sử dụng' : 'Nâng cấp ngay'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Loại tài khoản</Text>

      <View style={styles.currentPlanBox}>
        <Text style={styles.currentText}>Gói hiện tại: <Text style={styles.currentPlan}>{currentPlan}</Text></Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7', paddingTop: 30, paddingHorizontal: 20 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', marginVertical: 10, color: '#333' },
  currentPlanBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentText: { fontSize: 16, color: '#555' },
  currentPlan: { fontWeight: '700', color: '#A78BFA' },

  planCard: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  planName: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
  planPrice: { fontSize: 15, fontWeight: '500', color: '#666', marginBottom: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureText: { marginLeft: 8, color: '#555', fontSize: 14 },
  upgradeBtn: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeText: { fontWeight: '700', fontSize: 15 },
});

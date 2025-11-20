import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../_layout';

import { API_BASE_URL } from '@/src/api';

export default function AccountTypeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentPlan, setCurrentPlan] = useState('Cơ bản');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    card: isDarkMode ? '#633838ff' : '#FFF',
    text: isDarkMode ? '#FFF' : '#333',
    subText: isDarkMode ? '#CCC' : '#555',
    accent: '#A78BFA',
    success: '#48BB78',
  };

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem('userId');
      setStoredUserId(id);

      if (!id) return;


      try {
        const res = await fetch(`${API_BASE_URL}/users/byAccount/${id}`);
        if (!res.ok) throw new Error('Lấy dữ liệu thất bại');
        const data = await res.json();
        setCurrentPlan(data.preferences?.account_type || 'Cơ bản');
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  const plans = [
    { id: '1', name: 'Cơ bản', price: 'Miễn phí', features: ['Truy cập khóa học miễn phí'], icon: 'user', color: colors.accent },
    { id: '2', name: 'Premium', price: '79.000đ / tháng', features: ['Truy cập toàn bộ khóa học'], icon: 'star', color: colors.accent },
    { id: '3', name: 'Pro', price: '129.000đ / tháng', features: ['Toàn bộ tính năng Premium'], icon: 'award', color: colors.accent },
  ];

  const handlePressUpgrade = (plan: any) => {
    if (plan.name === currentPlan) {
      Alert.alert('Thông báo', `Bạn đang sử dụng gói ${plan.name}.`);
    } else {
      setSelectedPlan(plan);
      setModalVisible(true);
    }
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      const res = await fetch(`${API_BASE_URL}/users/${storedUserId}/account_type`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_type: selectedPlan.name }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');

      setCurrentPlan(selectedPlan.name);
      setModalVisible(false);
      Alert.alert('Thành công', `Bạn đã nâng cấp lên gói ${selectedPlan.name}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể nâng cấp, thử lại sau.');
    }
  };

  const renderPlan = ({ item }: any) => (
    <View style={[styles.planCard, { borderColor: item.color, backgroundColor: colors.card }]}>
      <View style={styles.planHeader}>
        <Feather name={item.icon} size={22} color={item.color} />
        <Text style={[styles.planName, { color: item.color }]}>{item.name}</Text>
      </View>
      <Text style={[styles.planPrice, { color: colors.subText }]}>{item.price}</Text>
      {item.features.map((f: any, idx: number) => (
        <View key={idx} style={styles.featureRow}>
          <Feather name="check" size={16} color={colors.success} />
          <Text style={[styles.featureText, { color: colors.subText }]}>{f}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={[styles.upgradeBtn, { backgroundColor: item.name === currentPlan ? '#E2E8F0' : item.color }]}
        onPress={() => handlePressUpgrade(item)}
        disabled={item.name === currentPlan}
      >
        <Text style={[styles.upgradeText, { color: item.name === currentPlan ? '#666' : '#FFF' }]}>
          {item.name === currentPlan ? 'Đang sử dụng' : 'Nâng cấp ngay'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>Loại tài khoản</Text>
      <View style={[styles.currentPlanBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.currentText, { color: colors.subText }]}>
          Gói hiện tại: <Text style={[styles.currentPlan, { color: colors.accent }]}>{currentPlan}</Text>
        </Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Xác nhận nâng cấp</Text>
            <Text style={[styles.modalText, { color: colors.subText }]}>
              Bạn có muốn nâng cấp lên gói {selectedPlan?.name} với giá {selectedPlan?.price}?
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#333', fontWeight: '600' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalConfirm, { backgroundColor: colors.accent }]} onPress={confirmUpgrade}>
                <Text style={{ color: '#FFF', fontWeight: '600' }}>Nâng cấp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, paddingHorizontal: 20 },
  backBtn: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', marginVertical: 10 },
  currentPlanBox: { borderRadius: 10, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  currentText: { fontSize: 16 },
  currentPlan: { fontWeight: '700' },
  planCard: { borderWidth: 1.5, borderRadius: 16, padding: 20, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  planName: { fontSize: 18, fontWeight: '700', marginLeft: 10 },
  planPrice: { fontSize: 15, fontWeight: '500', marginBottom: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureText: { marginLeft: 8, fontSize: 14 },
  upgradeBtn: { marginTop: 15, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  upgradeText: { fontWeight: '700', fontSize: 15 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { width: '85%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 16, marginRight: 10, borderRadius: 8, backgroundColor: '#E2E8F0' },
  modalConfirm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
});

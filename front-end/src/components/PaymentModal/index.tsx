import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

export const COLORS = {
  background: '#FFFFFF',
  primary: '#A78BFA',
  secondary: '#C4B5FD',
  textPrimary: '#1E1E2A',
  textSecondary: '#6A6A6A',
  cardBg: '#F5F5F8',
  border: '#E0E0E0',
  success: '#4CAF50',
};

// 1. Update Props Definition
type paymentMethodProps = {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void; // Changed signature to simple void, used on success
  amount: number;          // Received from parent
  courseId: string;        // Received from parent
};

const API = "http://localhost:5000/orders";

export default function PaymentModal({ 
  visible, 
  onClose, 
  onContinue, 
  amount, 
  courseId 
}: paymentMethodProps) {
  const [selected, setSelected] = useState('credit_card');
  const modalAnim = useRef(new Animated.Value(0)).current;
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start();
      fetchUser();
    } else {
      modalAnim.setValue(0);
    }
  }, [visible]);

  const fetchUser = async () => {
    const id = await AsyncStorage.getItem('userId');
    // Fallback for testing if no user logged in
    setUserId(id || 'USER002');
  };

  const methods = [
    { key: 'credit_card', name: 'Thẻ tín dụng', desc: 'Visa, MasterCard...', icon: 'credit-card-outline' },
    { key: 'e_wallet', name: 'Ví điện tử', desc: 'Momo, ZaloPay...', icon: 'wallet-outline' },
    { key: 'bank_transfer', name: 'Chuyển khoản ngân hàng', desc: 'Ngân hàng Việt Nam', icon: 'bank' },
  ];

  const handleCompletePayment = async () => {
    try {
      if (!userId) return Alert.alert('Lỗi', 'Bạn cần đăng nhập');

      const res = await axios.post(API, { userId, courseId, amount: Number(amount), paymentMethod: selected });

      if (res.status === 200 || res.status === 201) {
        // Thông báo thành công
        Alert.alert('Thành công', 'Thanh toán thành công!', [
          {
            text: 'OK',
            onPress: () => {
              onClose();      // Ẩn PaymentModal
              onContinue();   // Thực hiện xử lý tiếp theo (nếu cần)
            },
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'Thanh toán thất bại';
      Alert.alert('Lỗi', message);
    }
  };

  // Format currency for display
  const formattedAmount = amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0₫';

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalView,
            {
              opacity: modalAnim,
              transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            },
          ]}>
          <Text style={styles.modalTitle}>Thanh toán: {formattedAmount}</Text>
          
          {methods.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[
                styles.paymentRow,
                { borderColor: selected === m.key ? COLORS.primary : COLORS.border },
              ]}
              onPress={() => setSelected(m.key)}>
              <View style={styles.iconWrapper}>
                {m.key === 'credit_card' && <MaterialIcon name="credit-card-outline" size={24} color={COLORS.primary} />}
                {m.key === 'e_wallet' && <IonIcon name="wallet-outline" size={24} color={COLORS.success} />}
                {m.key === 'bank_transfer' && <MaterialIcon name="bank" size={24} color={COLORS.textPrimary} />}
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.paymentName}>{m.name}</Text>
                <Text style={styles.paymentDesc}>{m.desc}</Text>
              </View>
              {selected === m.key && <IonIcon name="checkmark-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleCompletePayment}>
            <Text style={styles.continueText}>Xác nhận thanh toán</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: COLORS.textPrimary, textAlign: 'center' },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: COLORS.cardBg,
  },
  iconWrapper: { paddingRight: 15 },
  textWrapper: { flex: 1 },
  paymentName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  paymentDesc: { fontSize: 13, color: COLORS.textSecondary },
  continueButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  continueText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
});
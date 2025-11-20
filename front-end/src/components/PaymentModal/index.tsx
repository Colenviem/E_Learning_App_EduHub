import { API_BASE_URL } from '@/src/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const API = `${API_BASE_URL}/orders`;

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

type paymentMethodProps = {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void; 
  amount: number;        
  courseId: string;       
};



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
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
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

      console.log({ userId, courseId, amount: Number(amount), paymentMethod: selected });

      // Basic validation for credit card flow
      if (selected === 'credit_card') {
        const raw = cardNumber.replace(/\s+/g, '');
        if (raw.length < 12) return Alert.alert('Lỗi', 'Số thẻ không hợp lệ');
        if (!/^[0-9]{2}\/\d{2,4}$/.test(cardExpiry) && cardExpiry.length < 3) return Alert.alert('Lỗi', 'Ngày hết hạn không hợp lệ (MM/YY)');
        if (cardCvv.replace(/\s+/g, '').length < 3) return Alert.alert('Lỗi', 'Mã CVV không hợp lệ');
      }

      // Prepare payload; include minimal metadata for card if available
      const payload: any = { userId, courseId, amount: Number(amount), paymentMethod: selected };
      if (selected === 'credit_card') {
        const raw = cardNumber.replace(/\s+/g, '');
        payload.paymentDetails = { cardLast4: raw.slice(-4) };
      }

      const res = await axios.post(API, payload);

      if (res.status === 200 || res.status === 201) {
        Alert.alert('Thành công', 'Thanh toán thành công!', [
          {
            text: 'OK',
            onPress: () => {
              onClose();  
              onContinue();  
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

          {/* Credit card form */}
          {selected === 'credit_card' && (
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Số thẻ"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: COLORS.cardBg }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, marginBottom: 8, marginRight: 8, backgroundColor: COLORS.cardBg }}
                />
                <TextInput
                  placeholder="CVV"
                  keyboardType="numeric"
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  style={{ width: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, marginBottom: 8, backgroundColor: COLORS.cardBg }}
                />
              </View>
            </View>
          )}

          {/* QR view for e-wallet payments */}
          {selected === 'e_wallet' && (
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ userId, courseId, amount }))}` }}
                style={styles.qrImage}
              />
              <Text style={styles.qrNote}>Mở ứng dụng ví (Momo, ZaloPay...) và quét mã QR để chuyển tiền. Sau khi chuyển xong, nhấn "Xác nhận thanh toán".</Text>
            </View>
          )}

          {/* Bank transfer instructions */}
          {selected === 'bank_transfer' && (
            <View style={{ marginTop: 12, paddingHorizontal: 8 }}>
              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Chuyển khoản ngân hàng</Text>
              <Text style={{ marginBottom: 4 }}>Ngân hàng: Ngân hàng Việt Nam</Text>
              <Text style={{ marginBottom: 4 }}>Số tài khoản: 0123456789</Text>
              <Text style={{ marginBottom: 6 }}>Chủ tài khoản: Công ty EduHub</Text>
              <Text style={{ color: COLORS.textSecondary }}>Vui lòng chuyển đúng số tiền. Sau khi chuyển, nhấn "Xác nhận thanh toán" để hoàn tất.</Text>
            </View>
          )}

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
  qrContainer: { alignItems: 'center', marginTop: 12, paddingHorizontal: 10 },
  qrTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  qrImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 8 },
  qrNote: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' },
});
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const COLORS = {
  background: '#FFFFFF',
  primary: '#A78BFA',
  secondary: '#C4B5FD',
  textPrimary: '#1E1E2A',
  textSecondary: '#6A6A6A',
  cardBg: '#F5F5F8',
  border: '#E0E0E0',
  star: '#FFC107',
  priceOriginal: '#E53935',
  heartActive: '#FF6B9D',
  success: '#4CAF50',
};


type PaymentModalProps = {
  visible: boolean;
  onClose: () => void;
  onContinue: (selected: string) => void;
};


export default function PaymentModal({ visible, onClose, onContinue }: PaymentModalProps) {
  const [selected, setSelected] = useState('credit_card');
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start();
    } else modalAnim.setValue(0);
  }, [visible]);

  const methods = [
    { key: 'credit_card', name: 'Thẻ tín dụng', desc: 'Visa, MasterCard...', icon: 'credit-card-outline' },
    { key: 'e_wallet', name: 'Ví điện tử', desc: 'Momo, ZaloPay...', icon: 'wallet-outline' },
    { key: 'bank_transfer', name: 'Chuyển khoản ngân hàng', desc: 'Ngân hàng Việt Nam', icon: 'bank' },
  ];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.modalView,
            {
              opacity: modalAnim,
              transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            },
          ]}>
          <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
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
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.continueButton} onPress={() => onContinue(selected)}>
            <Text style={styles.continueText}>Tiếp tục</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: COLORS.textPrimary },
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

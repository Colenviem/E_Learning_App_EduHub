import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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


type EnrollmentModalProps = {
  visible: boolean;
  onClose: () => void;
  selected: any;
  onSelect: (item: any) => void; 
  onConfirm: (selected: any) => void; 
};

export default function EnrollmentModal({
  visible,
  onClose,
  selected,
  onSelect,
  onConfirm,
}: EnrollmentModalProps) {
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start();
    } else modalAnim.setValue(0);
  }, [visible]);

  const packages = [
    { key: 'basic', name: 'Gói Cơ bản', description: 'Học 1 tháng', price: '250.000 VNĐ' },
    { key: 'premium', name: 'Gói Cao cấp', description: 'Học trọn đời', price: '500.000 VNĐ' },
    { key: 'pro', name: 'Gói Pro', description: 'Học trọn đời + hỗ trợ 1:1', price: '1.000.000 VNĐ' },
  ];

  const PackageRow = ({ pkg } : any) => (
    <TouchableOpacity
      style={[
        styles.packageRow,
        {
          borderColor: selected === pkg.key ? COLORS.primary : COLORS.border,
          borderWidth: selected === pkg.key ? 2 : 1,
        },
      ]}
      onPress={() => onSelect(pkg.key)}
      activeOpacity={0.8}>
      <View style={{ flex: 1 }}>
        <Text style={styles.packageName}>{pkg.name}</Text>
        <Text style={styles.packageDescription}>{pkg.description}</Text>
      </View>
      <View style={styles.priceColumn}>
        <Text style={styles.packagePrice}>{pkg.price}</Text>
        {pkg.key === 'premium' && (
          <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.badgeText}>Đề xuất</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.modalView,
            {
              opacity: modalAnim,
              transform: [
                {
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.modalTitle}>Hoàn thành đăng ký</Text>
          <Text style={styles.modalSubtitle}>Chọn gói phù hợp để học.</Text>
          {packages.map((pkg) => (
            <PackageRow key={pkg.key} pkg={pkg} />
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: {
    paddingTop: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: COLORS.textPrimary },
  modalSubtitle: { fontSize: 14, marginBottom: 20, textAlign: 'center', color: COLORS.textSecondary },
  packageRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 10, backgroundColor: COLORS.cardBg },
  packageName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  packageDescription: { fontSize: 13, color: COLORS.textSecondary },
  priceColumn: { alignItems: 'flex-end', justifyContent: 'center' },
  packagePrice: { fontSize: 16, fontWeight: '900' },
  badge: { borderRadius: 15, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '700', color: COLORS.background },
  buttonContainer: { flexDirection: 'row', marginTop: 20 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  confirmButton: { flex: 1, paddingVertical: 14, borderRadius: 12, marginLeft: 10, backgroundColor: COLORS.primary, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  confirmButtonText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
});

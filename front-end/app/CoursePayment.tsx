import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

const paymentMethods = [
  { id: 'credit', name: 'Thẻ Tín dụng / Ghi nợ', desc: 'Visa, Mastercard, JCB...', icon: 'card-outline' },
  { id: 'ewallet', name: 'Ví điện tử', desc: 'Momo, ZaloPay, ViettelPay...', icon: 'wallet-outline' },
  { id: 'bank', name: 'Chuyển khoản Ngân hàng', desc: 'Tất cả các ngân hàng Việt Nam', icon: 'business-outline' },
];

export default function CoursePayment() {
  const router = useRouter();
  const [selected, setSelected] = useState('credit');

  const handleContinue = () => {
    console.log(`Tiến hành thanh toán bằng phương thức: ${selected}`);
    
    router.push('/SuccessPayment'); 
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Phương thức thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>
        Vui lòng chọn một phương thức thanh toán để tiếp tục.
      </Text>

      {paymentMethods.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => setSelected(item.id)}
          style={[
            styles.methodItem,
            selected === item.id && styles.methodSelected,
          ]}
        >
          <Ionicons name={item.icon as any} size={24} color={colors.primaryBlue} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.methodName}>{item.name}</Text>
            <Text style={styles.methodDesc}>{item.desc}</Text>
          </View>
          {selected === item.id && (
            <Ionicons name="checkmark-circle" size={22} color={colors.primaryBlue} />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Tiếp tục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.grayText,
    marginBottom: spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    marginBottom: spacing.sm,
  },
  methodSelected: {
    borderColor: colors.primaryBlue,
  },
  methodName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  methodDesc: {
    ...typography.caption,
    color: colors.grayText,
  },
  continueBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryBlue,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: 'center',
  },
  continueText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textLight,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  isPopular?: boolean;
}

const packages: Package[] = [
  { id: 'basic', name: 'Gói Cơ bản', description: 'Học 1 tháng, giới hạn bài học.', price: '250.000đ' },
  { id: 'premium', name: 'Gói Cao cấp', description: 'Học trọn đời, tài liệu đầy đủ.', price: '500.000đ', isPopular: true },
  { id: 'pro', name: 'Gói Pro', description: 'Học trọn đời, hỗ trợ 1-1, chứng chỉ.', price: '1.000.000đ' },
];


interface PackageCardProps extends Package {
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ id, name, description, price, isPopular, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.packageCard,
      isSelected && styles.selectedCard,
    ]}
    onPress={() => onSelect(id)}
  >
    <View style={styles.packageHeader}>
      <Text style={[styles.packageName, isSelected && styles.selectedText]}>{name}</Text>
      {isPopular && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phổ biến</Text>
        </View>
      )}
    </View>
    <Text style={[styles.packagePrice, isSelected && styles.selectedText]}>{price}</Text>
    <Text style={[styles.packageDescription, isSelected && styles.selectedText]}>{description}</Text>
  </TouchableOpacity>
);

interface RegistrationModalProps {
  onCancel: () => void;
  onRegister: (packageId: string) => void;
  courseTitle: string; 
}

export default function RegistrationModal({ onCancel, onRegister, courseTitle }: RegistrationModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(packages[0].id); 

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Hoàn thành đăng ký</Text>
          <Text style={styles.modalSubtitle}>Chọn gói phù hợp để hoàn thành đăng ký khóa học.</Text>
        </View>

        <View style={styles.packageList}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              {...pkg}
              isSelected={selectedPackage === pkg.id}
              onSelect={setSelectedPackage}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRegister(selectedPackage)}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
modalContainer: {
  position: 'absolute',          
  top: 0, left: 0, right: 0, bottom: 0, 
  zIndex: 999,                  
  elevation: 20,                
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
},

  modalContent: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.grayText,
  },
  packageList: {
    marginBottom: spacing.lg,
  },
  packageCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lightBorder,
  },
  selectedCard: {
    borderColor: colors.primaryBlue,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  packagePrice: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  packageDescription: {
    ...typography.caption,
    color: colors.grayText,
  },
  selectedText: {
    color: colors.textPrimary, 
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textLight,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    marginRight: spacing.sm,
    backgroundColor: colors.lightBorder, 
  },
  cancelText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  registerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primaryBlue,
    marginLeft: spacing.sm,
  },
  registerText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textLight,
  },
});
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, gradients, spacing, typography } from '../constants/theme';

const FeaturedCard: React.FC = () => {
  return (
    <LinearGradient
      colors={gradients.featuredCard} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.content}>
        <Text style={styles.mainText}>
          Khám phá những lựa chọn hàng đầu
        </Text>
        <Text style={styles.subText}>
          <Text style={styles.countText}>100 +</Text> bài học
        </Text>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>Khám phá thêm</Text>
        <Ionicons name="arrow-forward-outline" size={16} color={colors.primaryBlue} style={styles.ctaIcon} />
      </TouchableOpacity>
      
      <View style={styles.graphicPlaceholder}>
        <Ionicons name="bulb-outline" size={40} color="rgba(255, 255, 255, 0.5)" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    height: 180,
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: 'hidden', 
  },
  content: {
    zIndex: 1, 
  },
  mainText: {
    ...typography.h2,
    color: colors.textLight,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  subText: {
    ...typography.body,
    color: colors.textLight,
    opacity: 0.8,
  },
  countText: {
    fontWeight: '700',
    fontSize: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    alignSelf: 'flex-start', 
    marginTop: spacing.md,
    zIndex: 1,
  },
  ctaText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryBlue,
    marginRight: spacing.sm / 2,
  },
  ctaIcon: {
    marginTop: 2,
  },
  graphicPlaceholder: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    opacity: 0.4,
    transform: [{ rotate: '-15deg' }],
  }
});

export default FeaturedCard;
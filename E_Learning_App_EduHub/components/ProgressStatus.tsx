import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

interface ProgressStatusProps {
  coursesInProgress: number;
  weeklyProgress: number; 
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({ coursesInProgress, weeklyProgress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusBlock}>
        <Text style={styles.valueText}>{coursesInProgress}</Text>
        <Text style={styles.labelText}>Khóa học đang học</Text>
      </View>
      <View style={styles.separator} />

      <View style={styles.statusBlock}>
        <Text style={styles.valueText}>{weeklyProgress}%</Text>
        <Text style={styles.labelText}>Tiến độ tuần này</Text>
      </View>


      <TouchableOpacity style={styles.navButton}>
        <Ionicons name="arrow-forward-sharp" size={24} color={colors.primaryBlue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  statusBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },
  valueText: {
    ...typography.h2,
    fontSize: 22,
    color: colors.primaryBlue,
  },
  labelText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: '70%',
    width: 1,
    backgroundColor: colors.lightBorder,
    marginHorizontal: spacing.lg,
  },
  navButton: {
    padding: spacing.sm,
    marginLeft: spacing.md,
  },
});

export default ProgressStatus;
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.profileHeader}>
          <Image 
            source={require('../../assets/images/avatar.png')} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hoàng Anh</Text>
            <Text style={styles.profileEmail}>hoanganh@gmail.com</Text>
            <Text style={styles.profileStatus}>Học viên Pro</Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Feather name="external-link" size={20} color={colors.primaryBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Khóa học hoàn thành</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Giờ học tích lũy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Đang học</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Chứng chỉ</Text>
          </View>
        </View>

  
        <Text style={styles.sectionTitle}>Khóa học gần đây</Text>
        <View style={styles.recentCourseCard}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/rnrecent/60/60' }}
            style={styles.recentCourseImage} 
          />
          <View style={styles.recentCourseDetails}>
            <Text style={styles.recentCourseTitle}>React Native Cơ bản</Text>
            <Text style={styles.recentCourseTime}>2 giờ trước</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarFill} />
            </View>
          </View>
          <Text style={styles.progressText}>65%</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.grayText} />
        </View>

        <Text style={styles.sectionTitle}>Thành tích</Text>
        <AchievementItem 
          iconName="trophy-outline" 
          title="Người học tích cực" 
          subtitle="Hoàn thành 10 khóa học" 
        />
        <AchievementItem 
          iconName="code-slash-outline" 
          title="Chuyên gia React" 
          subtitle="Thành thạo React Native" 
        />
        <AchievementItem 
          iconName="bulb-outline" 
          title="Thiết kế sáng tạo" 
          subtitle="Hoàn thành khóa Figma" 
        />

        <Text style={styles.sectionTitle}>Thao tác khác</Text>
        <OptionItem 
          iconName="book-outline" 
          title="Khóa học của tôi" 
        />
        <OptionItem 
          iconName="documents-outline" 
          title="Chứng chỉ" 
        />
        <OptionItem 
          iconName="time-outline" 
          title="Lịch sử học tập" 
        />
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

interface AchievementItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ iconName, title, subtitle }) => (
  <View style={styles.achievementItem}>
    <View style={styles.achievementIconWrapper}>
      <Ionicons name={iconName} size={24} color={colors.primaryBlue} />
    </View>
    <View style={styles.achievementTextContent}>
      <Text style={styles.achievementTitle}>{title}</Text>
      <Text style={styles.achievementSubtitle}>{subtitle}</Text>
    </View>
    <TouchableOpacity style={styles.achievedButton}>
      <Text style={styles.achievedButtonText}>Đạt được</Text>
    </TouchableOpacity>
  </View>
);

interface OptionItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
}

const OptionItem: React.FC<OptionItemProps> = ({ iconName, title }) => (
  <TouchableOpacity style={styles.optionItem}>
    <Ionicons name={iconName} size={24} color={colors.grayText} />
    <Text style={styles.optionTitle}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color={colors.grayText} />
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenPadding, 
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl, 
    marginTop: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.md, 
    backgroundColor: colors.lightBorder,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileEmail: {
    ...typography.body,
    color: colors.primaryBlue,
    marginBottom: 2,
  },
  profileStatus: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  editIcon: {
    padding: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%', 
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'flex-start', 
  },
  statNumber: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  recentCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  recentCourseImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  recentCourseDetails: {
    flex: 1,
  },
  recentCourseTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recentCourseTime: {
    ...typography.caption,
    color: colors.grayText,
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.lightBorder,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    width: '65%', // Example progress
    height: '100%',
    backgroundColor: colors.primaryBlue,
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryBlue,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  achievementIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementTextContent: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  achievementSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  achievedButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
  },
  achievedButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.md,
  },
});
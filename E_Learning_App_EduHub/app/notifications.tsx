import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

interface NotificationItem {
  id: string;
  type: 'course' | 'achievement' | 'reminder' | 'comment'; 
  category: 'all' | 'course' | 'achievement' | 'reminder'; 
  title: string;
  description: string;
  time: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'course',
    category: 'course',
    title: 'Bài học mới đã được thêm',
    description: 'Khóa học "React Native Cơ bản" có bài học mới: "Navigation Advanced"',
    time: '2 giờ trước',
  },
  {
    id: 'n2',
    type: 'achievement',
    category: 'achievement',
    title: 'Chúc mừng! Bạn đã hoàn thành khóa học',
    description: 'Bạn đã hoàn thành "Figma for Education Resources" và nhận được chứng chỉ',
    time: '1 ngày trước',
  },
  {
    id: 'n3',
    type: 'reminder',
    category: 'reminder',
    title: 'Nhắc nhở học tập',
    description: 'Bạn chưa học trong 2 ngày. Hãy tiếp tục với "JavaScript ES6+"',
    time: '1 ngày trước',
  },
  {
    id: 'n4',
    type: 'comment',
    category: 'all',
    title: 'Bình luận mới',
    description: 'Tân Hiển đã trả lời câu hỏi của bạn trong khóa "React Native"',
    time: '2 ngày trước',
  },
  {
    id: 'n5',
    type: 'course',
    category: 'course',
    title: 'Cập nhật khóa học',
    description: 'Bài học "State Management" đã được chỉnh sửa trong khóa "React Native Nâng cao"',
    time: '3 ngày trước',
  },
  {
    id: 'n6',
    type: 'reminder',
    category: 'reminder',
    title: 'Nhắc nhở hoàn thành',
    description: 'Bạn có 3 bài học đang chờ hoàn thành trong tuần này.',
    time: '3 ngày trước',
  },
];

const NotificationCard: React.FC<{ item: NotificationItem }> = ({ item }) => {
  let iconComponent;
  let iconColor = colors.primaryBlue;

  switch (item.type) {
    case 'course':
      iconComponent = <Feather name="book-open" size={24} color={iconColor} />;
      break;
    case 'achievement':
      iconComponent = <Ionicons name="trophy-outline" size={24} color={iconColor} />;
      break;
    case 'reminder':
      iconComponent = <Ionicons name="notifications-outline" size={24} color={iconColor} />;
      break;
    case 'comment':
      iconComponent = <Feather name="message-square" size={24} color={iconColor} />;
      break;
    default:
      iconComponent = <Ionicons name="information-circle-outline" size={24} color={iconColor} />;
  }

  return (
    <View style={notificationCardStyles.cardContainer}>
      <View style={notificationCardStyles.iconWrapper}>
        {iconComponent}
      </View>
      <View style={notificationCardStyles.textWrapper}>
        <Text style={notificationCardStyles.title}>{item.title}</Text>
        <Text style={notificationCardStyles.description}>{item.description}</Text>
        <Text style={notificationCardStyles.time}>{item.time}</Text>
      </View>
    </View>
  );
};

const notificationCardStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: spacing.sm / 2, 
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    ...typography.caption,
    color: colors.grayText,
    fontSize: 11,
  },
});

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'course' | 'achievement' | 'reminder'>('all');

  const filteredNotifications = mockNotifications.filter(notif => {
    if (activeTab === 'all') return true;
    return notif.category === activeTab;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <Text style={styles.unreadCount}>{mockNotifications.length} thông báo chưa đọc</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="share-2" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          <TabButton title="Tất cả" isActive={activeTab === 'all'} onPress={() => setActiveTab('all')} />
          <TabButton title="Khóa học" isActive={activeTab === 'course'} onPress={() => setActiveTab('course')} />
          <TabButton title="Thành tích" isActive={activeTab === 'achievement'} onPress={() => setActiveTab('achievement')} />
          <TabButton title="Nhắc nhở" isActive={activeTab === 'reminder'} onPress={() => setActiveTab('reminder')} />
        </ScrollView>
      </View>

      <ScrollView style={styles.notificationList} contentContainerStyle={{ paddingBottom: spacing.lg }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => (
            <NotificationCard key={notif.id} item={notif} />
          ))
        ) : (
          <Text style={styles.noNotificationsText}>Không có thông báo nào trong mục này.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[tabButtonStyles.button, isActive && tabButtonStyles.activeButton]}>
    <Text style={[tabButtonStyles.text, isActive && tabButtonStyles.activeText]}>{title}</Text>
  </TouchableOpacity>
);

const tabButtonStyles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    marginRight: spacing.sm,
    backgroundColor: colors.cardBackground,
  },
  activeButton: {
    backgroundColor: colors.primaryBlue, 
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeText: {
    color: colors.textLight, 
    fontWeight: '600',
  },
});


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: Platform.OS === 'android' ? spacing.md : 0, 
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  iconButton: {
    padding: spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  unreadCount: {
    ...typography.caption,
    color: colors.grayText,
    marginTop: 2,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  tabScrollContent: {
    paddingHorizontal: spacing.screenPadding,
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  noNotificationsText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
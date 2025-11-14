import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../_layout';

interface SettingItemData {
  title: string;
  icon?: React.ReactNode;
  action: string;
  isLogout?: boolean;
}

interface SettingsItemProps {
  item: SettingItemData;
  onPress: (action: string) => void;
  accountType?: string;
  colors: any;
}

const SETTINGS_DATA_TOP: SettingItemData[] = [
  { title: "Loại tài khoản:", icon: undefined, action: 'account_type' },
  { title: "Cài đặt thông báo và nhắc nhở", icon: <Feather name="calendar" size={20} color="#6C63FF" />, action: 'notifications' },
  { title: "Cài đặt nội dung", icon: <Feather name="book-open" size={20} color="#6C63FF" />, action: 'content_settings' },
];

const SETTINGS_DATA_BOTTOM: SettingItemData[] = [
  { title: "Nhận hỗ trợ", icon: <Feather name="headphones" size={20} color="#6C63FF" />, action: 'support' },
  { title: "Điều khoản Dịch vụ & Chính sách Bảo mật", icon: <Feather name="info" size={20} color="#6C63FF" />, action: 'terms' },
  { title: "Đánh giá", icon: <Feather name="edit-3" size={20} color="#6C63FF" />, action: 'review' },
  { title: "Tài khoản", icon: <Feather name="user" size={20} color="#6C63FF" />, action: 'account' },
  { title: "Đăng xuất", icon: <Feather name="log-out" size={20} color="#E53E3E" />, action: 'logout', isLogout: true },
];

const SettingsItem: React.FC<SettingsItemProps> = ({ item, onPress, accountType, colors }) => (
  <TouchableOpacity
    style={[
      settingsStyles.menuItem,
      item.action === 'account_type' && settingsStyles.menuItemNoIcon,
      { backgroundColor: colors.card }
    ]}
    onPress={() => onPress(item.action)}
    activeOpacity={0.7}
  >
    {item.icon && <View style={settingsStyles.iconContainer}>{item.icon}</View>}

    <Text style={[
      settingsStyles.menuTitle,
      item.isLogout && { color: colors.danger },
      !item.icon && settingsStyles.fullWidthTitle,
      { color: item.isLogout ? colors.danger : colors.textDark }
    ]}>
      {item.title}
    </Text>

    {item.action === 'account_type' && (
      <Text style={[settingsStyles.accountType, { color: colors.textSecondary }]}>{accountType || 'Cơ bản'}</Text>
    )}

    {!item.isLogout && <Feather name="chevron-right" size={18} color={colors.textSecondary} />}
  </TouchableOpacity>
);

const API_BASE_URL = 'http://192.168.0.102:5000';

const SettingsScreen = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = {
    primary: '#6C63FF',
    danger: '#E53E3E',
    textDark: isDarkMode ? '#FFF' : '#333',
    textSecondary: isDarkMode ? '#CCC' : '#666',
    background: isDarkMode ? '#121212' : '#F7F7F7',
    card: isDarkMode ? '#1E1E1E' : '#FFF',
  };

  const [accountType, setAccountType] = useState('Cơ bản');
  const [userId, setUserId] = useState<string | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const getUserId = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) setUserId(storedId);
      return storedId;
    } catch (err) {
      console.error('Lỗi lấy USER_ID từ AsyncStorage:', err);
      return null;
    }
  };

  const fetchAccountType = async () => {
    const id = userId || await getUserId();
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/byAccount/${id}`);
      const data = await res.json();
      setAccountType(data.preferences?.account_type || 'Cơ bản');
    } catch (err) {
      console.error('Lỗi fetch user:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccountType();
    }, [userId])
  );

  const handlePress = (action: string) => {
    switch (action) {
      case 'logout':
        setLogoutModalVisible(true);
        break;
      case 'toggle_dark_mode':
        toggleTheme();
        break;
      case 'account_type':
        router.push('./settings/account_type');
        break;
      case 'notifications':
        router.push('./settings/notifications');
        break;
      case 'content_settings':
        router.push('./settings/content_settings');
        break;
      case 'support':
        router.push('./settings/support');
        break;
      case 'terms':
        router.push('./settings/terms');
        break;
      case 'review':
        router.push('./settings/review');
        break;
      case 'account':
        router.push('./edit');
        break;
      default:
        console.warn('Unknown action:', action);
        break;
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await AsyncStorage.clear();
      setLogoutModalVisible(false);
      router.replace('/login');
    } catch (err) {
      console.error('Lỗi xóa AsyncStorage:', err);
    }
  };

  return (
    <View style={[settingsStyles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[settingsStyles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Feather name="x" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={[settingsStyles.headerTitle, { color: colors.textDark }]}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        <View style={settingsStyles.section}>
          {SETTINGS_DATA_TOP.map(item => (
            <SettingsItem key={item.title} item={item} onPress={handlePress} accountType={accountType} colors={colors} />
          ))}
        </View>

        <View style={settingsStyles.section}>
          {SETTINGS_DATA_BOTTOM.map(item => (
            <SettingsItem key={item.title} item={item} onPress={handlePress} colors={colors} />
          ))}
        </View>

        <View style={settingsStyles.footer}>
          <Text style={[settingsStyles.versionText, { color: colors.textSecondary }]}>v1.1.1</Text>
          <Text style={[settingsStyles.versionText, { color: colors.textSecondary }]}>ID hỗ trợ: 95GXLMD7K2B</Text>
        </View>
      </ScrollView>

      {/* Modal đăng xuất */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={settingsStyles.modalBackground}>
          <View style={[settingsStyles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[settingsStyles.modalTitle, { color: colors.textDark }]}>Đăng xuất</Text>
            <Text style={[settingsStyles.modalText, { color: colors.textSecondary }]}>
              Bạn có chắc chắn muốn đăng xuất?
            </Text>
            <View style={settingsStyles.modalBtns}>
              <TouchableOpacity style={settingsStyles.modalCancel} onPress={() => setLogoutModalVisible(false)}>
                <Text style={{ color: '#333', fontWeight: '600' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[settingsStyles.modalConfirm, { backgroundColor: colors.danger }]} onPress={handleLogoutConfirm}>
                <Text style={{ color: '#FFF', fontWeight: '600' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const settingsStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingTop: 50,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  section: {
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f7f7f7',
  },
  menuItemNoIcon: { paddingLeft: 15 },
  iconContainer: { width: 25, alignItems: 'center', marginRight: 10 },
  menuTitle: { flex: 1, fontSize: 16 },
  fullWidthTitle: { marginLeft: 0 },
  accountType: { fontSize: 14, marginRight: 10 },
  footer: { alignItems: 'center', paddingVertical: 30, marginBottom: 20 },
  versionText: { fontSize: 12, marginBottom: 3 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { width: '85%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 16, marginRight: 10, borderRadius: 8, backgroundColor: '#E2E8F0' },
  modalConfirm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
});

export default SettingsScreen;

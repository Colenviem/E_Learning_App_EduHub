import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingItemData {
    title: string;
    icon?: React.ReactNode;
    action: string;
    isLogout?: boolean;
}

interface SettingsItemProps {
    item: SettingItemData;
    onPress: (action: string) => void;
}
const COLORS = {
    primary: '#6C63FF',
    danger: '#E53E3E',  
    textDark: '#333',
    textSecondary: '#666',
    background: '#F7F7F7',
    card: '#fff',
};


const SETTINGS_DATA_TOP: SettingItemData[] = [
    { title: "Loại tài khoản:", icon: undefined, action: 'account_type' },
    { title: "Cài đặt thông báo và nhắc nhở", icon: <Feather name="calendar" size={20} color={COLORS.textDark} />, action: 'notifications' },
];

const SETTINGS_DATA_MAIN: SettingItemData[] = [
    { title: "Cài đặt hội thoại", icon: <Feather name="message-square" size={20} color={COLORS.textDark} />, action: 'chat_settings' },
    { title: "Cài đặt nội dung", icon: <Feather name="book-open" size={20} color={COLORS.textDark} />, action: 'content_settings' },
    { title: "Sử dụng mã khuyến mãi Toko Premium", icon: <MaterialCommunityIcons name="tag-outline" size={20} color={COLORS.textDark} />, action: 'promo' },
];

const SETTINGS_DATA_BOTTOM: SettingItemData[] = [
    { title: "Nhận hỗ trợ", icon: <Feather name="headphones" size={20} color={COLORS.textDark} />, action: 'support' },
    { title: "Điều khoản Dịch vụ & Chính sách Bảo mật", icon: <Feather name="info" size={20} color={COLORS.textDark} />, action: 'terms' },
    { title: "Đánh giá", icon: <Feather name="edit-3" size={20} color={COLORS.textDark} />, action: 'review' },
    { title: "Khôi phục mua hàng", icon: <Feather name="refresh-ccw" size={20} color={COLORS.textDark} />, action: 'restore' },
    { title: "Tài khoản", icon: <Feather name="user" size={20} color={COLORS.textDark} />, action: 'account' },
    { title: "Đăng xuất", icon: <Feather name="log-out" size={20} color={COLORS.danger} />, action: 'logout', isLogout: true },
];
const SettingsItem: React.FC<SettingsItemProps> = ({ item , onPress}) => (
    <TouchableOpacity style={[
        settingsStyles.menuItem,
        item.action === 'account_type' && settingsStyles.menuItemNoIcon 
    ]} 
    onPress={() => onPress(item.action)}
    activeOpacity={0.7}
    >
        {item.icon && (
            <View style={settingsStyles.iconContainer}>
                {item.icon}
            </View>
        )}
        
        <Text style={[
            settingsStyles.menuTitle, 
            item.isLogout && { color: COLORS.danger },
            !item.icon && settingsStyles.fullWidthTitle
        ]}>
            {item.title}
        </Text>
        
        {item.action === 'account_type' && <Text style={settingsStyles.accountType}>Cơ bản</Text>}

        {!item.isLogout && <Feather name="chevron-right" size={18} color="#C0C0C0" />}
    </TouchableOpacity>
);

const SettingsScreen = () => {
  const router = useRouter();

  const handlePress = (action: string) => {
    console.log(`Action: ${action}`);

    switch (action) {
      case 'logout':
        alert("Bạn có muốn đăng xuất không?");
        break;

      case 'account_type':
        router.push('./settings/account_type');
        break;

      case 'notifications':
        router.push('./settings/notifications');
        break;

      case 'chat_settings':
        router.push('./settings/chat_settings');
        break;

      case 'content_settings':
        router.push('./settings/content_settings');
        break;

      case 'promo':
        router.push('./settings/promo');
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

      case 'restore':
        router.push('./settings/restore');
        break;


      default:
        console.warn('Unknown action:', action);
        break;
    }
  };

  const handleLanguageSelect = () => {
    const lang = window.confirm("Chọn English?") ? 'English' : 'Tiếng Việt';
    alert(`Bạn đã chọn: ${lang}`);
  };

  return (
    <View style={settingsStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={settingsStyles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={settingsStyles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        <View style={settingsStyles.section}>
          {SETTINGS_DATA_TOP.map((item) => (
            <SettingsItem key={item.title} item={item} onPress={handlePress} />
          ))}
        </View>

        <View style={settingsStyles.section}>
          {SETTINGS_DATA_MAIN.map((item) => (
            <SettingsItem key={item.title} item={item} onPress={handlePress} />
          ))}
        </View>
        
        <View style={settingsStyles.section}>
          {SETTINGS_DATA_BOTTOM.map((item) => (
            <SettingsItem key={item.title} item={item} onPress={handlePress} />
          ))}
        </View>
        
        <View style={settingsStyles.footer}>
          <Text style={settingsStyles.versionText}>v1.1.874</Text>
          <Text style={settingsStyles.versionText}>ID hỗ trợ: 95GXLMD7K2B</Text>
          <TouchableOpacity style={settingsStyles.languageSelector} onPress={handleLanguageSelect}>
            <Feather name="globe" size={16} color={COLORS.primary} />
            <Text style={settingsStyles.languageText}>Chọn ngôn ngữ ∨</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


const settingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingTop: 50, 
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    section: {
        backgroundColor: COLORS.card,
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
    menuItemNoIcon: {
        paddingLeft: 15,
    },
    iconContainer: {
        width: 25,
        alignItems: 'center',
        marginRight: 10,
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
    },
    fullWidthTitle: {
        marginLeft: 0,
    },
    accountType: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginRight: 10,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 20,
    },
    versionText: {
        fontSize: 12,
        color: '#A0A0A0',
        marginBottom: 3,
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    languageText: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 5,
        fontWeight: '600',
    }
});

export default SettingsScreen;
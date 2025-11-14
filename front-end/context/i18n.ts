import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as i18n from 'i18n-js';

(i18n as any).translations = {
  en: {
    settings: "Settings",
    dark_mode: "Dark Mode",
    language: "Language",
    current_plan: "Current Plan",
    upgrade: "Upgrade Now",
    cancel: "Cancel",
    confirm: "Confirm",
    display_content: "Display Content",
  },
  vi: {
    settings: "Cài đặt",
    dark_mode: "Chế độ tối",
    language: "Ngôn ngữ",
    current_plan: "Gói hiện tại",
    upgrade: "Nâng cấp ngay",
    cancel: "Hủy",
    confirm: "Xác nhận",
    display_content: "Hiển thị nội dung",
  },
};

(i18n as any).locale = Localization.locale;
(i18n as any).fallbacks = true;

// Lưu và load ngôn ngữ
export const setAppLanguage = async (lang: string) => {
  (i18n as any).locale = lang;
  await AsyncStorage.setItem('appLanguage', lang);
};

export const getAppLanguage = async () => {
  const lang = await AsyncStorage.getItem('appLanguage');
  if (lang) (i18n as any).locale = lang;
  return lang || (i18n as any).locale;
};

export default i18n as any;

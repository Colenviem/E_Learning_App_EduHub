import { API_BASE_URL } from '@/src/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../_layout';

const DUCK_AVATARS = [
  { id: '1', source: { uri: 'https://res.cloudinary.com/dibguk5n6/image/upload/v1763627294/logo_ugxfdv.jpg' }},
  { id: '2', source: { uri: 'https://res.cloudinary.com/dibguk5n6/image/upload/v1763627294/avt2_pmv17a.avif' }},
  { id: '3', source: { uri: 'https://res.cloudinary.com/dibguk5n6/image/upload/v1763627294/avt1_wzcklx.avif' }},
  { id: '4', source: { uri: 'https://res.cloudinary.com/dibguk5n6/image/upload/v1763627294/avt3_j7pdtv.png' }},
];

type Avatar = { id: string; source: any };
const BACKGROUND_COLORS = ['#B3EBC8', '#E0E0FF', '#FFD6D6', '#FFE8B3', '#C0F7FF', '#F0F0F0'];

const EditProfileScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#BBBBBB' : '#666666',
    cardBg: isDarkMode ? '#1E1E1E' : '#F7F7F7',
    header: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    inputBg: isDarkMode ? '#222' : '#FFF',
    inputBorder: isDarkMode ? '#444' : '#CCC',
  };

  const [activeTab, setActiveTab] = useState('Icon');
  const [avatars, setAvatars] = useState<Avatar[]>(DUCK_AVATARS);
  const [selectedAvatar, setSelectedAvatar] = useState(DUCK_AVATARS[0].id);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_COLORS[0]);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedAvatarItem = avatars.find(a => a.id === selectedAvatar);

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) setUserId(storedUserId);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/byAccount/${userId}`);
        const raw = await res.text();

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          alert("Upload thất bại: server trả về không phải JSON.\n\n" + raw);
          return;
        }

        setName(data.name || '');
        setSelectedBg(data.backgroundColor || BACKGROUND_COLORS[0]);

        if (data.avatarUrl) {
          const serverAvatar = { id: 'server_avatar', source: { uri: data.avatarUrl } };
          setAvatars([...DUCK_AVATARS, serverAvatar]);
          setSelectedAvatar('server_avatar');
        } else {
          setAvatars(DUCK_AVATARS);
          setSelectedAvatar(DUCK_AVATARS[0].id);
        }
      } catch (err) {
        console.error("Lỗi fetch user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  // Chọn ảnh nhưng KHÔNG upload ngay
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("Cần cấp quyền thư viện ảnh");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    const fileUri = result.assets[0].uri;

    // Lưu URI tạm thời
    setPendingImageUri(fileUri);

    // Tạo avatar tạm để hiển thị preview
    const tempAvatar = { id: 'temp_avatar', source: { uri: fileUri } };
    setAvatars([...DUCK_AVATARS, tempAvatar]);
    setSelectedAvatar('temp_avatar');
  };

  // Hàm upload ảnh lên server
  const uploadAvatar = async (fileUri: string) => {
    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri: fileUri,
        type: "image/jpeg",
        name: "avatar.jpg"
      } as any);

      const res = await fetch(`${API_BASE_URL}/users/byAccount/${userId}/avatar`, {
        method: "POST",
        body: formData
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Server không trả JSON");
      }

      return data.user.avatarUrl;
    } catch (err: any) {
      throw new Error("Upload ảnh thất bại: " + err.message);
    }
  };

  const updateUserProfile = async () => {
    if (!userId) return;

    setIsSaving(true);

    try {
      if (pendingImageUri) {
        await uploadAvatar(pendingImageUri);
        setPendingImageUri(null);
      }

      const payload: any = {
        name,
        backgroundColor: selectedBg
      };

      if (!pendingImageUri) {
        const selected = avatars.find(a => a.id === selectedAvatar);
        if (selected && selected.source) {
          if (selected.source.uri) payload.avatarUrl = selected.source.uri;
        }
      }

      const res = await fetch(`${API_BASE_URL}/users/byAccount/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Server không trả JSON");
      }

      if (!res.ok) throw new Error(data.message || "Cập nhật lỗi");

      alert("Lưu thành công!");

      // Quay lại trang profile
      router.push('/profile');

    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderAvatarItem: ListRenderItem<Avatar> = ({ item }) => (
    <TouchableOpacity
      style={[
        editStyles.avatarItem,
        { backgroundColor: colors.cardBg },
        selectedAvatar === item.id && {
          borderColor: '#6C63FF',
          backgroundColor: isDarkMode ? "#2a2550" : "#F0F0FF"
        }
      ]}
      onPress={() => setSelectedAvatar(item.id)}
    >
      <Image source={item.source} style={editStyles.avatarImage} />
    </TouchableOpacity>
  );

  const renderBgItem = (color: string) => (
    <TouchableOpacity
      key={color}
      style={[
        editStyles.colorItem,
        { backgroundColor: color },
        selectedBg === color && { borderColor: '#6C63FF' }
      ]}
      onPress={() => setSelectedBg(color)}
    />
  );

  return (
    <View style={[editStyles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[editStyles.header, { backgroundColor: colors.header, borderBottomColor: colors.inputBorder }]}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[editStyles.headerTitle, { color: colors.text }]}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={editStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Preview */}
        <View style={[editStyles.previewArea, { backgroundColor: selectedBg }]}>
          <Text style={[editStyles.previewName, { color: '#000' }]}>{name}</Text>
          <Image
            source={selectedAvatarItem ? selectedAvatarItem.source : DUCK_AVATARS[0].source}
            style={editStyles.previewAvatar}
          />
        </View>

        <View style={editStyles.tabMenu}>
          {['Icon', 'Màu nền', 'Tên'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  editStyles.tabButton,
                  {
                    backgroundColor: isActive
                      ? isDarkMode ? '#3B305F' : '#E0E0FF'
                      : editStyles.tabButton.backgroundColor
                  }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    editStyles.tabText,
                    {
                      color: activeTab === tab
                        ? (isDarkMode ? '#A78BFA' : '#6C63FF')
                        : colors.subText
                    }
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        <View style={editStyles.tabContent}>
          {activeTab === 'Icon' && (
            <FlatList
              data={avatars}
              renderItem={renderAvatarItem}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={editStyles.avatarRow}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'Màu nền' && (
            <View style={editStyles.colorGrid}>
              {BACKGROUND_COLORS.map(renderBgItem)}
            </View>
          )}

          {activeTab === 'Tên' && (
            <TextInput
              style={[
                editStyles.nameInput,
                { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên mới"
              placeholderTextColor={colors.subText}
            />
          )}
        </View>

        {activeTab === 'Icon' && (
          <TouchableOpacity
            style={editStyles.pickImageButton}
            onPress={pickImage}
            disabled={isSaving}
          >
            <Text style={editStyles.pickImageButtonText}>
              {pendingImageUri ? '✓ Đã chọn ảnh mới' : 'Chọn ảnh từ thư viện'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[editStyles.saveButton, isSaving && { opacity: 0.6 }]}
          onPress={updateUserProfile}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={editStyles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const editStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    paddingTop: 50,
    paddingBottom: 16
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },

  previewArea: {
    paddingHorizontal: 20,
    paddingVertical: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15
  },
  previewName: { fontSize: 28, fontWeight: '900' },
  previewAvatar: { width: 70, height: 70, borderRadius: 35 },

  tabMenu: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0'
  },
  tabText: { fontSize: 15 },

  tabContent: { paddingHorizontal: 20, paddingBottom: 20 },

  avatarRow: { justifyContent: 'space-between' },
  avatarItem: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  colorItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 15,
    height: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent'
  },

  nameInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16
  },

  pickImageButton: {
    width: '90%',
    backgroundColor: '#E0E0FF',
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center'
  },
  pickImageButtonText: { textAlign: 'center', fontSize: 14, fontWeight: '600' },

  saveButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
});

export default EditProfileScreen;
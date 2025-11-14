import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

const API_BASE_URL = 'http://192.168.0.102:5000';

const DUCK_AVATARS = [
  { id: '1', source: require('../../../assets/images/logo.jpg') },
  { id: '2', source: require('../../../assets/images/avt1.png') },
  { id: '3', source: require('../../../assets/images/avt2.png') },
  { id: '4', source: require('../../../assets/images/avt3.png') },
];

type Avatar = { id: string; source: any };
const BACKGROUND_COLORS = ['#B3EBC8', '#E0E0FF', '#FFD6D6', '#FFE8B3', '#C0F7FF', '#F0F0F0'];

const EditProfileScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();   // <<< lấy từ Theme context

  // màu theo dark/light mode
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
        } catch {
          console.error("Server không trả JSON:", raw);
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
      try { data = JSON.parse(raw); }
      catch { return alert("Upload thất bại, server không trả JSON"); }

      const cloudUrl = data.user.avatarUrl;
      const newAvatar = { id: 'server_avatar', source: { uri: cloudUrl } };
      setAvatars([...DUCK_AVATARS, newAvatar]);
      setSelectedAvatar('server_avatar');
      alert("Upload thành công!");
    } catch (err: any) {
      alert("Upload lỗi: " + err.message);
    }
  };

  const updateUserProfile = async () => {
    if (!selectedAvatarItem || !userId) return;

    const avatarUrl =
      typeof selectedAvatarItem.source === "object" &&
        selectedAvatarItem.source.uri
        ? selectedAvatarItem.source.uri
        : selectedAvatarItem.source;

    try {
      const res = await fetch(`${API_BASE_URL}/users/byAccount/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatarUrl,
          backgroundColor: selectedBg
        })
      });

      const raw = await res.text();
      let data;
      try { data = JSON.parse(raw); }
      catch { return alert("Cập nhật thất bại, server không trả JSON"); }

      if (!res.ok) throw new Error(data.message || "Cập nhật lỗi");

      alert("Cập nhật thành công!");
      router.push("/profile");
    } catch (err: any) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  const renderAvatarItem: ListRenderItem<Avatar> = ({ item }) => (
    <TouchableOpacity
      style={[
        editStyles.avatarItem,
        { backgroundColor: colors.cardBg },
        selectedAvatar === item.id && { borderColor: '#6C63FF', backgroundColor: isDarkMode ? "#2a2550" : "#F0F0FF" }
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
          <TouchableOpacity style={editStyles.pickImageButton} onPress={pickImage}>
            <Text style={editStyles.pickImageButtonText}>Chọn ảnh từ thư viện</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={editStyles.saveButton} onPress={updateUserProfile}>
          <Text style={editStyles.saveButtonText}>Lưu</Text>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingTop: 30
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
    marginHorizontal: 20,
    marginVertical: 20
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
});

export default EditProfileScreen;

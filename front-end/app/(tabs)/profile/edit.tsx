import { Feather } from '@expo/vector-icons';
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
  View,
} from 'react-native';

const DUCK_AVATARS = [
  { id: '1', source: require('../../../assets/images/logo.jpg') },
  { id: '2', source: require('../../../assets/images/avt1.png') },
  { id: '3', source: require('../../../assets/images/avt2.png') },
  { id: '4', source: require('../../../assets/images/avt3.png') },
];

type Avatar = {
  id: string;
  source: any;
};

const BACKGROUND_COLORS = ['#B3EBC8', '#E0E0FF', '#FFD6D6', '#FFE8B3', '#C0F7FF', '#F0F0F0'];

const USER_ID = 'USER001';

const EditProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Icon');
  const [selectedAvatar, setSelectedAvatar] = useState(DUCK_AVATARS[0].id);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_COLORS[0]);
  const [name, setName] = useState('');
  const [avatars, setAvatars] = useState(DUCK_AVATARS);
  const selectedAvatarItem = avatars.find((a) => a.id === selectedAvatar);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://192.168.0.102:5000/users/${USER_ID}`);
        const data = await res.json();
        setName(data.name || '');
        setSelectedBg(data.backgroundColor || BACKGROUND_COLORS[0]);
        if (data.avatarUrl) {
          const newId = (avatars.length + 1).toString();
          const newAvatar = { id: newId, source: { uri: data.avatarUrl } };
          setAvatars([...avatars, newAvatar]);
          setSelectedAvatar(newId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("avatar", {
        uri: fileUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      try {
        const res = await fetch(`http://192.168.0.102:5000/users/${USER_ID}/avatar`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const cloudUrl = data.user.avatarUrl;
        const newId = (avatars.length + 1).toString();
        const newAvatar = { id: newId, source: { uri: cloudUrl } };

        setAvatars([...avatars, newAvatar]);
        setSelectedAvatar(newId);
        alert("Upload thành công!");
      } catch (err: any) {
        alert("Upload thất bại: " + err.message);
      }
    }
  };



  const renderAvatarItem: ListRenderItem<Avatar> = ({ item }) => (
    <TouchableOpacity
      style={[editStyles.avatarItem, selectedAvatar === item.id && editStyles.selectedAvatarItem]}
      onPress={() => setSelectedAvatar(item.id)}
    >
      <Image source={item.source} style={editStyles.avatarImage} />
    </TouchableOpacity>
  );

  const renderBgItem = (color: any) => (
    <TouchableOpacity
      key={color}
      style={[editStyles.colorItem, { backgroundColor: color }, selectedBg === color && editStyles.selectedColorItem]}
      onPress={() => setSelectedBg(color)}
    />
  );

  const updateUserProfile = async () => {
    if (!selectedAvatarItem) return;

    const avatarUrl =
      typeof selectedAvatarItem.source === 'object' && selectedAvatarItem.source.uri
        ? selectedAvatarItem.source.uri
        : selectedAvatarItem.source;

    try {
      const response = await fetch(`http://192.168.0.102:5000/users/${USER_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatarUrl,
          backgroundColor: selectedBg,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Update failed');
      }

      const updatedUser = await response.json();
      alert('Cập nhật hồ sơ thành công!');
      console.log('Updated user:', updatedUser);
    } catch (err: any) {
      console.error(err.message);
      alert('Cập nhật thất bại: ' + err.message);
    }
  };

  return (
    <View style={editStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={editStyles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={editStyles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={editStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[editStyles.previewArea, { backgroundColor: selectedBg }]}>
          <Text style={editStyles.previewName}>{name}</Text>
          <Image
            source={selectedAvatarItem ? selectedAvatarItem.source : DUCK_AVATARS[0].source}
            style={editStyles.previewAvatar}
          />
        </View>

        <View style={editStyles.tabMenu}>
          {['Icon', 'Màu nền', 'Tên'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[editStyles.tabButton, activeTab === tab && editStyles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[editStyles.tabText, activeTab === tab && editStyles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={editStyles.tabContent}>
          {activeTab === 'Icon' && (
            <FlatList
              data={avatars}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={editStyles.avatarRow}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'Màu nền' && <View style={editStyles.colorGrid}>{BACKGROUND_COLORS.map(renderBgItem)}</View>}

          {activeTab === 'Tên' && (
            <TextInput style={editStyles.nameInput} value={name} onChangeText={setName} placeholder="Nhập tên mới" />
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
  pickImageButton: { width: '90%', backgroundColor: '#E0E0FF', paddingVertical: 10, borderRadius: 10, marginVertical: 1, alignSelf: 'center' },
  pickImageButtonText: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#333' },

  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 50 },
  scrollContainer: { flex: 1 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingTop: 30 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 6, marginBottom: 4 },

  previewArea: {
    paddingHorizontal: 20,
    paddingVertical: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15
  },
  previewName: { fontSize: 28, fontWeight: '900', color: '#333' },
  previewAvatar: { width: 70, height: 70, borderRadius: 35, resizeMode: 'cover' },

  tabMenu: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tabButton: { paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, borderRadius: 20, backgroundColor: '#f0f0f0' },
  activeTabButton: { backgroundColor: '#E0E0FF' },
  tabText: { fontSize: 15, color: '#666' },
  activeTabText: { fontWeight: '600', color: '#6C63FF' },

  tabContent: { paddingHorizontal: 20, paddingBottom: 20 },

  avatarRow: { justifyContent: 'space-between' },
  avatarItem: { width: '48%', height: 150, marginBottom: 15, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', backgroundColor: '#F7F7F7' },
  selectedAvatarItem: { borderColor: '#6C63FF', backgroundColor: '#F0F0FF' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' ,},
  colorItem: { width: '30%', aspectRatio: 1, borderRadius: 15,  height: 50,marginBottom: 15, borderWidth: 2, borderColor: 'transparent' },
  selectedColorItem: { borderColor: '#6C63FF' },

  nameInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, fontSize: 16 },

  saveButton: { backgroundColor: '#6C63FF', paddingVertical: 15, borderRadius: 10, marginHorizontal: 20, marginVertical: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default EditProfileScreen;

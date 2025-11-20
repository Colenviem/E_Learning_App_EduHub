import { API_BASE_URL } from '@/src/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateYourOwn() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = `${API_BASE_URL}/posts`;

  const CLOUD_NAME = "CLOUD_NAME";
  const UPLOAD_PRESET = "UPLOAD_PRESET";

  const uploadToCloudinary = async () => {
    if (!image) return null;
    const data = new FormData();
    data.append("file", { uri: image, type: "image/jpeg", name: "photo.jpg" } as any);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    return json.secure_url;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Không có quyền truy cập camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCreate = async () => {
    if (!topic.trim() || !content.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập chủ đề và nội dung bài viết.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadToCloudinary();

      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          content,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo bài viết");

      setTopic("");
      setContent("");
      setImage(null);

      Alert.alert("Thành công", "Bài viết đã được tạo!");
      router.push("/explore/discussion");
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Tạo bài viết" }} />

      <Text style={styles.label}>Chủ đề</Text>
      <TextInput
        style={styles.input}
        placeholder="VD: Kinh nghiệm học lập trình..."
        value={topic}
        onChangeText={setTopic}
      />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        multiline
        placeholder="Chia sẻ điều bạn muốn..."
        value={content}
        onChangeText={setContent}
      />

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#5B21B6" />
          <Text style={styles.imageButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={20} color="#5B21B6" />
          <Text style={styles.imageButtonText}>Chụp ảnh</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.createButton, loading && { opacity: 0.6 }]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.createText}>{loading ? "Đang tải..." : "Đăng bài"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  preview: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  imageButton: {
    flex: 1,
    backgroundColor: "#EDE9FE",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  imageButtonText: { color: "#5B21B6", fontWeight: "bold" },
  createButton: {
    backgroundColor: "#8B5CF6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

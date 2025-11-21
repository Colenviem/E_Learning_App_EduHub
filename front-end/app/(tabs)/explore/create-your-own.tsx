import { API_BASE_URL } from '@/src/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";

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

  const CLOUD_NAME = "dibguk5n6";
  const UPLOAD_PRESET = "eduhub";


  const uploadToCloudinary = async () => {
    if (!image) return null;

    if (Platform.OS === "web") {
      console.warn("Cloudinary upload không hỗ trợ Web cho kiểu file URI.");
      Alert.alert("Không hỗ trợ Web", "Tính năng tải ảnh chỉ hoạt động trên iOS và Android.");
      return null;
    }

    try {
      const fileToUpload = {
        uri: image,
        type: "image/jpeg",
        name: "photo.jpg",
      };

      const formData = new FormData();
      formData.append("file", fileToUpload as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const json = await response.json();
      console.log("Cloudinary response:", json);

      return json.secure_url || null;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };


  const handleCreate = async () => {
    if (!topic.trim() || !content.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập chủ đề và nội dung bài viết.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await uploadToCloudinary();
        console.log('upload result imageUrl:', imageUrl);
        if (!imageUrl) {
          Alert.alert('Lỗi tải ảnh', 'Không thể tải ảnh lên máy chủ. Vui lòng thử lại hoặc bỏ ảnh.');
          setLoading(false);
          return;
        }
      }

      const payload: any = { topic, content };
      if (imageUrl) payload.image = imageUrl; // only include image when available
      console.log('Create post payload:', payload);

      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Create post failed:', res.status, text);
        throw new Error('Không thể tạo bài viết');
      }

      setTopic("");
      setContent("");
      setImage(null);

      Alert.alert("Thành công", "Bài viết đã được tạo!");
      router.push("/explore/discussion");
    } catch (err: any) {
      console.error('Create post error:', err);
      Alert.alert("Lỗi", err.message || 'Có lỗi xảy ra');
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

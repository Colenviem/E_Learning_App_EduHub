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

  const SERVER_URL = "http://192.168.0.102:5000/posts";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const handleCreate = async () => {
    if (!topic.trim() || !content.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập chủ đề và nội dung bài viết.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("content", content);
    if (image) {
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
    }

    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Không thể tạo bài viết");
      setTopic("");
      setContent("");
      setImage(null);

      Alert.alert("Thành công", "Bài viết đã được tạo!");
      router.push("/explore/discussion");
    } catch (err: any) {
      console.error(err);
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
          <Ionicons name="image-outline" size={20} color="#5B21B6" style={{ marginRight: 6 }} />
          <Text style={styles.imageButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={20} color="#5B21B6" style={{ marginRight: 6 }} />
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
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    fontSize: 15,
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#EDE9FE",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#5B21B6",
    fontWeight: "bold",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#8B5CF6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

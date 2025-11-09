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
  TouchableOpacity
} from "react-native";

export default function CreateYourOwn() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  const handleCreate = () => {
    if (!topic.trim() || !content.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập chủ đề và nội dung bài viết.");
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      topic,
      content,
      image,
      likes: 0,
      comments: [],
    };

    router.push({
      pathname: "/explore/discussion",
      params: { post: JSON.stringify(newPost) },
    });

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

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Chọn ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createText}>Đăng bài</Text>
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
  imageButton: {
    backgroundColor: "#EDE9FE",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
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

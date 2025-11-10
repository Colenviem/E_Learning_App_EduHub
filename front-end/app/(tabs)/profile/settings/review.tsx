import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const submitReview = () => {
    if (rating === 0) {
      Alert.alert("Vui lòng chọn số sao đánh giá ⭐");
      return;
    }
    Alert.alert("Cảm ơn bạn đã đánh giá!", `Bạn đã cho ${rating} sao`);
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          onPressIn={() => setHovered(i)}
          onPressOut={() => setHovered(0)}
        >
          <Feather
            name="star"
            size={32}
            color={i <= (hovered || rating) ? "#FFD700" : "#CCC"}
            style={{ marginHorizontal: 4 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Đánh giá EduHub" , headerTitleAlign: "center",
        headerStyle: { backgroundColor: '#A78BFA' },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "700" },}} />

      <Text style={styles.text}>
        Hãy đánh giá ứng dụng để chúng tôi cải thiện trải nghiệm!
      </Text>

      <View style={styles.stars}>{renderStars()}</View>

      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.buttonText}>Đánh giá ngay</Text>
      </TouchableOpacity>

      <Text style={styles.summary}>
        ⭐ {rating} sao — Cảm ơn bạn đã dành thời gian đánh giá EduHub!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  text: { fontSize: 16, marginBottom: 20, textAlign: "center", color: "#333" },
  stars: { flexDirection: "row", marginBottom: 20 },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  summary: { fontSize: 14, color: "#666", textAlign: "center" },
});

export default ReviewScreen;

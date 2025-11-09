import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const MAU = {
  nen: "#F7F7F7",
  headerBg: "#5E72E4",
  cardBg: "#FFFFFF",
  chuChinh: "#333333",
  chuPhu: "#666666",
  accent: "#5E72E4",
};

export default function HeatMapStats() {
  const labels = ["HTML", "CSS", "JS", "React", "Node"];
  const data = [80, 70, 60, 50, 40];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Thống kê kỹ năng",
          headerStyle: { backgroundColor: MAU.headerBg },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tổng quan kỹ năng lập trình</Text>

        <View style={styles.chartCard}>
          <BarChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#E5E5E5",
                strokeDasharray: "0",
              },
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Feather name="check-circle" size={24} color="#48BB78" />
            <Text style={styles.infoText}>Bài học hoàn thành: 3</Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="clock" size={24} color="#F6AD55" />
            <Text style={styles.infoText}>Thời gian học: 45 phút</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Nhận xét tổng quan</Text>
          <Text style={styles.summaryText}>
            Bạn đang có nền tảng tốt ở HTML/CSS, nhưng cần luyện thêm về JavaScript và React để nâng cao kỹ năng front-end.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: MAU.nen },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: MAU.chuChinh },

  chartCard: {
    backgroundColor: MAU.cardBg,
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 25,
  },

  infoCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MAU.cardBg,
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: { marginLeft: 10, fontSize: 14, color: MAU.chuChinh, fontWeight: "600" },

  summaryCard: {
    backgroundColor: MAU.cardBg,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: MAU.chuChinh },
  summaryText: { fontSize: 14, color: MAU.chuPhu, lineHeight: 20 },
});

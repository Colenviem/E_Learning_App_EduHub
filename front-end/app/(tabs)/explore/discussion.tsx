import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export const TAB_BAR_STYLE = {
    height: 60,
    paddingBottom: 10,
    paddingTop: 8,
    position: 'absolute',
    bottom: 25,
    left: 10,
    right: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
};


const PhotoIcon = () => (
    <View style={styles.photoIcon}>
        <Text style={styles.photoText}>Ảnh</Text>
    </View>
);

export default function Discussion() {
    const router = useRouter();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        const parent = navigation.getParent();
        parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

        return () => {
            parent?.setOptions({ tabBarStyle: TAB_BAR_STYLE });
        };
    }, [navigation]);


    const postsData = [
        {
            id: "3",
            topic: "Mẹo debug code hiệu quả cho coder",
            content: "Sử dụng console.log, breakpoints và đọc kỹ stack trace...",
            image: "https://picsum.photos/id/1015/400/200",
            likes: 45,
            comments: ["Cực kỳ hữu ích!", "Mình hay quên debug tip này."],
            category: "Coder",
        },
        {
            id: "4",
            topic: "Các lỗi thường gặp khi lập trình React Native",
            content: "Không import đúng module, thiếu key trong FlatList...",
            image: "https://picsum.photos/id/1016/400/200",
            likes: 30,
            comments: ["Mình gặp lỗi này hôm trước!", "Cần lưu ý thật kỹ."],
            category: "Coder",
        },
        {
            id: "5",
            topic: "Tips tối ưu hiệu năng ứng dụng web",
            content: "Sử dụng memo, lazy loading, và tránh re-render không cần thiết...",
            image: "https://picsum.photos/id/1018/400/200",
            likes: 28,
            comments: ["Rất thực tế!", "Cảm ơn chia sẻ."],
            category: "Coder",
        },
        {
            id: "6",
            topic: "Học tiếng Anh mỗi ngày",
            content: "Nghe podcast và đọc sách giúp cải thiện kỹ năng nghe - đọc...",
            image: "https://picsum.photos/id/1019/400/200",
            likes: 40,
            comments: ["Cảm ơn gợi ý!", "Mình đang làm theo cách này."],
            category: "Học tập",
        },
    ];

    const [posts, setPosts] = useState(postsData);
    const [textInputs, setTextInputs] = useState(posts.map(() => ""));
    const [likes, setLikes] = useState(posts.map(p => p.likes));

    const handleComment = (index: number) => {
        const text = textInputs[index].trim();
        if (!text) return;
        const updatedPosts = [...posts];
        updatedPosts[index].comments.push(text);
        setPosts(updatedPosts);
        const updatedInputs = [...textInputs];
        updatedInputs[index] = "";
        setTextInputs(updatedInputs);
    };

    const handleLike = (index: number) => {
        const updatedLikes = [...likes];
        updatedLikes[index] += 1;
        setLikes(updatedLikes);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.postStatusContainer}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: "https://picsum.photos/id/1005/40/40" }}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineIndicator} />
                </View>

                <TouchableOpacity
                    style={styles.statusInput}
                    onPress={() => router.push("./create-your-own")}
                >
                    <Text style={styles.statusInputText}>Đăng cập nhật trạng thái</Text>
                </TouchableOpacity>

                <PhotoIcon />
            </View>

            {posts.map((post, index) => (
                <View key={post.id} style={styles.postContainer}>
                    <Text style={styles.category}>{post.category}</Text>
                    <Text style={styles.topic}>{post.topic}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    {post.image && <Image source={{ uri: post.image }} style={styles.image} />}

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(index)}>
                            <Ionicons name="heart-outline" size={20} color="#f33" />
                            <Text style={styles.actionText}>{likes[index]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={20} color="#555" />
                            <Text style={styles.actionText}>{post.comments.length}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-social-outline" size={20} color="#555" />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    {post.comments.map((comment, cIdx) => (
                        <View key={cIdx} style={styles.commentBox}>
                            <Text>{comment}</Text>
                        </View>
                    ))}

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Viết bình luận..."
                            value={textInputs[index]}
                            onChangeText={(text) => {
                                const updated = [...textInputs];
                                updated[index] = text;
                                setTextInputs(updated);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => handleComment(index)}
                            style={styles.sendButton}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    postStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginBottom: 16,
    },
    avatarWrapper: { position: 'relative', marginRight: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: 'green', borderWidth: 2, borderColor: '#fff' },
    statusInput: { flex: 1, height: 40, borderRadius: 20, paddingHorizontal: 15, backgroundColor: "#f0f2f5", justifyContent: 'center', marginRight: 10 },
    statusInputText: { color: "#606770", fontSize: 14 },
    photoIcon: { justifyContent: 'center', alignItems: 'center', width: 40 },
    photoText: { color: "#42b72a", fontSize: 12, fontWeight: 'bold' },
    postContainer: { marginBottom: 24 },
    category: { fontSize: 12, color: "#666", marginBottom: 4 },
    topic: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
    content: { fontSize: 14, color: "#444", marginBottom: 10 },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center' },
    actionText: { marginLeft: 4, color: '#555', fontSize: 14 },
    commentBox: { backgroundColor: "#F3F4F6", padding: 8, borderRadius: 8, marginBottom: 6 },
    commentInputContainer: { flexDirection: "row", marginTop: 10 },
    commentInput: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 12, height: 40 },
    sendButton: { backgroundColor: "#1877F2", paddingHorizontal: 16, justifyContent: "center", borderRadius: 20, marginLeft: 6 },
});

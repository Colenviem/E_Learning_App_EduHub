import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

import { API_BASE_URL } from '@/src/api';
const SERVER_URL = API_BASE_URL;

interface CommentType {
    text: string;
    createdAt: string;
}

interface PostType {
    _id: string;
    topic: string;
    content: string;
    image?: string;
    likes: number;
    comments: CommentType[];
    category?: string;
}

export default function Discussion() {
    const router = useRouter();
    const navigation = useNavigation();

    const [posts, setPosts] = useState<PostType[]>([]);
    const [textInputs, setTextInputs] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<any>(null);

    const fetchUser = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;
            const res = await fetch(`${SERVER_URL}/users/byAccount/${userId}`);
            const data = await res.json();

            setUser(data);
        } catch (err) {
            console.log("Fetch user error:", err);
        }
    };

   
    useLayoutEffect(() => {
        const parent = navigation.getParent();
        parent?.setOptions({ tabBarStyle: { ...TAB_BAR_STYLE, display: 'none' } });

        return () => {
            parent?.setOptions({ tabBarStyle: TAB_BAR_STYLE });
        };
    }, [navigation]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${SERVER_URL}/posts`);
            const data = await res.json();
            setPosts(data);

            const inputMap: { [key: string]: string } = {};
            data.forEach((post: PostType) => { inputMap[post._id] = ""; });
            setTextInputs(inputMap);
        } catch (err) {
            console.error("Fetch posts error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();  
        fetchPosts();
    }, []);

    const handleLike = async (postId: string) => {
        try {
            await fetch(`${SERVER_URL}/posts/${postId}/like`, { method: "PUT" });
            fetchPosts();
        } catch (err) {
            console.error("Like error:", err);
        }
    };


    const handleComment = async (postId: string) => {
        const text = textInputs[postId]?.trim();
        if (!text) return;

        try {
            await fetch(`${SERVER_URL}/posts/${postId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            setTextInputs((prev) => ({ ...prev, [postId]: "" }));
            fetchPosts();
        } catch (err) {
            console.error("Comment error:", err);
        }
    };

    const PhotoIcon = () => (
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.imageButton}>
                <Ionicons name="image-outline" size={20} color="#5B21B6"/>
            </TouchableOpacity>
        </View>
    );

    if (loading && posts.length === 0) {
        return <ActivityIndicator size="large" color="#1877F2" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.postStatusContainer}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: user?.avatarUrl || "https://picsum.photos/40" }}
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

            {posts.map((post) => (
                <View key={post._id} style={styles.postContainer}>
                    {post.category && <Text style={styles.category}>{post.category}</Text>}
                    <Text style={styles.topic}>{post.topic}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    {post.image && <Image source={{ uri: post.image }} style={styles.image} />}

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post._id)}>
                            <Ionicons name="heart-outline" size={20} color="#f33" />
                            <Text style={styles.actionText}>{post.likes}</Text>
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

                    {post.comments.map((comment, idx) => (
                        <View key={idx} style={styles.commentBox}>
                            <Text>{comment.text}</Text>
                        </View>
                    ))}

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Viết bình luận..."
                            value={textInputs[post._id] || ""}
                            onChangeText={(text) =>
                                setTextInputs((prev) => ({ ...prev, [post._id]: text }))
                            }
                        />
                        <TouchableOpacity
                            onPress={() => handleComment(post._id)}
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
    imageButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDE9FE",
        padding: 8,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    imageButtonText: { color: "#5B21B6", fontWeight: "bold" },
    buttonRow: { flexDirection: "row", marginLeft: 5 },

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

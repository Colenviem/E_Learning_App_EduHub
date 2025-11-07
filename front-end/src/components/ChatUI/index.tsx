import React, { RefObject, useEffect, useRef } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../../../hooks/dataBot';
import { AnimatedOption } from '../AnimatedOption';


interface ChatUIProps {
  messages: ChatMessage[];
  handleAnswer: (answer: string, optionId: string) => void;
  handlePickTime: () => void;
  flatListRef: RefObject<FlatList<any> | null>; 
}
const TypingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };
    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingDotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const ChatUI: React.FC<ChatUIProps> = ({ messages, handleAnswer, handlePickTime }) => {
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.sender === 'typing') {
      return (
        <View style={[styles.messageContainer, styles.botMessageWrapper]}>
          <Image source={require('../../../assets/images/logo.jpg')} style={styles.botIcon} />
          <TypingDots />
        </View>
      );
    }

    if (item.sender === 'option' && item.options) {
      return (
        <View style={[styles.messageContainer, styles.userMessageWrapper]}>
          <View style={styles.optionContainerInline}>
            {item.options.map(opt => (
              <AnimatedOption
                key={uuidv4()}
                label={opt}
                onPress={() => handleAnswer(opt, item.id)}
              />
            ))}
          </View>
        </View>
      );
    }

    const isBot = item.sender === 'bot';
    return (
      <View style={[styles.messageContainer, isBot ? styles.botMessageWrapper : styles.userMessageWrapper]}>
        {isBot && <Image source={require('../../../assets/images/logo.jpg')} style={styles.botIcon} />}
        <View style={[isBot ? styles.botMessage : styles.userMessage]}>
          <Text style={styles.messageText}>{item.text}</Text>
          {item.showTimePicker && (
            <AnimatedOption label="Chọn thời gian học" onPress={handlePickTime} />
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={item => item.id}
      renderItem={renderMessage}
      contentContainerStyle={styles.chatContainer}
      onContentSizeChange={scrollToBottom}
    />
  );
};

export default ChatUI;

const styles = StyleSheet.create({
  chatContainer: { paddingBottom: 24 , marginTop: 30},
  messageContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 },
  botMessageWrapper: { justifyContent: 'flex-start', marginLeft: 4 },
  userMessageWrapper: { justifyContent: 'flex-end', marginRight: 4 },
  botIcon: { width: 30, height: 30, marginRight: 8, borderRadius: 15 },
  botMessage: { backgroundColor: '#6C63FF', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, maxWidth: '80%' },
  userMessage: { backgroundColor: '#333', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, maxWidth: '80%' },
  messageText: { color: '#fff', fontSize: 16 },
  typingDotsContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginHorizontal: 2 },
  optionContainerInline: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: '80%', justifyContent: 'flex-end', alignSelf: 'flex-end', marginRight: 8, gap: 8 },
});

import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../../../hooks/dataBot';
import { AnimatedOption } from '../AnimatedOption';

interface ChatUIProps {
  messages: ChatMessage[];
  handleAnswer: (answer: string, optionId: string) => void;
  handlePickTime: (event: any, date?: Date) => void;
  flatListRef: React.RefObject<FlatList<any> | null>;
  showPicker: boolean;
  pickedTime: Date;
}

const ChatUI: React.FC<ChatUIProps> = ({
  messages,
  handleAnswer,
  handlePickTime,
  flatListRef,
  showPicker,
  pickedTime
}) => {

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.sender === 'typing') {
      return (
        <View style={[styles.messageContainer, styles.botMessageWrapper]}>
          <Image source={require('../../../assets/images/logo.jpg')} style={styles.botIcon} />
          <Text style={{ color: 'white' }}>...</Text>
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
            <AnimatedOption label="Chọn thời gian học" onPress={() => handlePickTime(null)} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {showPicker && (
        <DateTimePicker
          value={pickedTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handlePickTime}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatUI;

const styles = StyleSheet.create({
  messageContainer: { flexDirection: 'row', marginVertical: 8 },
  botMessageWrapper: { marginLeft: 4 },
  userMessageWrapper: { justifyContent: 'flex-end', marginRight: 4 },
  botIcon: { width: 30, height: 30, marginRight: 8, borderRadius: 15 },
  botMessage: { backgroundColor: '#6C63FF', borderRadius: 20, padding: 14, maxWidth: '80%' },
  userMessage: { backgroundColor: '#333', borderRadius: 20, padding: 14, maxWidth: '80%' },
  messageText: { color: '#fff', fontSize: 16 },
  optionContainerInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '80%',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

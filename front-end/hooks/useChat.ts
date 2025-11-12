import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from './dataBot';
import { QUESTIONS } from './dataBot';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
    scrollToBottom();
  };

  const sendBotMessage = (step: number) => {
    const typingId = uuidv4();
    addMessage({ id: typingId, text: '...', sender: 'typing' });

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId));

      const question = QUESTIONS[step];
      addMessage({ id: uuidv4(), text: question.question, sender: 'bot' });
      addMessage({ id: uuidv4(), text: '', sender: 'option', options: question.options });
    }, 1200);
  };

  const handleAnswer = (answer: string, optionId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === optionId ? { ...m, text: answer, sender: 'user', options: undefined } : m))
    );
    scrollToBottom();

    setTimeout(() => {
      if (currentStep === QUESTIONS.length - 1) {
        if (answer === 'Có') {
          addMessage({
            id: uuidv4(),
            text: 'Tuyệt vời! Hãy chọn thời gian học phù hợp với bạn.',
            sender: 'bot',
            showTimePicker: true,
          });
        } else {
          addMessage({
            id: uuidv4(),
            text: 'Không sao! Bạn có thể vào Cài đặt -> Thông báo -> Chọn EduHub để bật thông báo sau.',
            sender: 'bot',
          });
          setTimeout(() => {
            addMessage({ id: uuidv4(), text: 'Cảm ơn bạn! Hãy bắt đầu đến khóa học ngay thôi nào!', sender: 'bot' });
            setTimeout(() => router.replace('/login'), 4000);
          }, 800);
        }
        return;
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      sendBotMessage(nextStep);
    }, 600);
  };

  const handlePickTime = () => {
    const typingId = uuidv4();
    addMessage({ id: typingId, text: '...', sender: 'typing' });

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId));

      Alert.alert(
        'Thông báo học tập',
        'Bạn có muốn bật thông báo nhắc học không?',
        [
          {
            text: 'Không',
            onPress: () => {
              setMessages(prev =>
                prev.map(m => (m.showTimePicker ? { ...m, showTimePicker: false } : m))
              );
              addMessage({
                id: uuidv4(),
                text: 'Không sao! Bạn có thể vào cài đặt -> thông báo -> chọn EduHub để bật thông báo sau.',
                sender: 'bot',
              });
              setTimeout(() => {
                addMessage({ id: uuidv4(), text: 'Cảm ơn bạn! Hãy bắt đầu đến khóa học ngay thôi nào!', sender: 'bot' });
                setTimeout(() => router.replace('/login'), 2000);
              }, 800);
            },
            style: 'cancel',
          },
          {
            text: 'Có',
            onPress: () => {
              Alert.prompt(
                'Chọn giờ học',
                'Vui lòng nhập giờ bạn muốn nhận thông báo (ví dụ: 14:00)',
                [
                  {
                    text: 'Xác nhận',
                    onPress: (time : any) => {
                      setMessages(prev =>
                        prev.map(m => (m.showTimePicker ? { ...m, showTimePicker: false } : m))
                      );
                      addMessage({
                        id: uuidv4(),
                        text: `Tuyệt vời! Bạn đã đặt giờ nhắc học vào lúc ${time}.`,
                        sender: 'bot',
                      });
                      setTimeout(() => router.replace('/login'), 1000);
                    },
                  },
                ],
                'plain-text',
                '08:00'
              );
            },
          },
        ]
      );
    }, 400);
  };

  return { messages, sendBotMessage, handleAnswer, handlePickTime, flatListRef };
};

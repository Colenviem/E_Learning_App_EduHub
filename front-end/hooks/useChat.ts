import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import type { ChatMessage } from './dataBot';
import { QUESTIONS } from './dataBot';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [pickedTime, setPickedTime] = useState<Date>(new Date());

  const flatListRef = useRef<FlatList<any> | null>(null);

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

    setTimeout(async () => {
      if (currentStep === QUESTIONS.length - 1) {
        if (answer === 'Có') {
          addMessage({
            id: uuidv4(),
            text: 'Tuyệt vời! Hãy chọn thời gian học phù hợp với bạn.',
            sender: 'bot',
            showTimePicker: true,
          });

          setShowPicker(true); // mở timepicker
        } else {
          addMessage({
            id: uuidv4(),
            text: 'Không sao! Bạn có thể bật thông báo sau trong Cài đặt.',
            sender: 'bot',
          });

          setTimeout(() => {
            addMessage({ id: uuidv4(), text: 'Cảm ơn bạn! Hãy bắt đầu học ngay thôi nào!', sender: 'bot' });
            setTimeout(() => router.replace('/login'), 2000);
          }, 800);
        }
        return;
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      sendBotMessage(nextStep);
    }, 600);
  };

  // =====================================================================
  // 📌 HÀM LÊN LỊCH THÔNG BÁO
  // =====================================================================

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    const trigger = new Date(Date.now());
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);

    if (trigger.getTime() < Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nhắc học bài!",
        body: "Đến giờ học rồi bạn ơi!",
      },
      trigger: trigger,
    });
  };




  // =====================================================================
  // 📌 HANDLE PICK TIME
  // =====================================================================

  const handlePickTime = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);

    if (!selectedTime) return;

    setPickedTime(selectedTime);

    const hour = selectedTime.getHours().toString().padStart(2, "0");
    const minute = selectedTime.getMinutes().toString().padStart(2, "0");

    addMessage({
      id: uuidv4(),
      text: `Bạn đã chọn giờ học: ${hour}:${minute}.`,
      sender: "user",
    });

    scheduleDailyNotification(
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    addMessage({
      id: uuidv4(),
      text: `Tuyệt vời! Mình sẽ nhắc bạn học mỗi ngày lúc ${hour}:${minute}.`,
      sender: "bot",
    });

    setTimeout(() => router.replace("/login"), 1500);
  };


  return {
    messages,
    sendBotMessage,
    handleAnswer,
    handlePickTime,
    flatListRef,
    showPicker,
    pickedTime,
    setShowPicker,
  };
};

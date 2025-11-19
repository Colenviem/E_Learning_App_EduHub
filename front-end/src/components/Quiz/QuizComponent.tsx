import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface IOption {
  option: string;
  correct: boolean;
  choise?: boolean;
}

interface IQuiz {
  _id: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  question: string;
  options: IOption[];
  createdAt: string;
}

interface QuizProps {
  quiz: IQuiz;
  index: number;
}

const COLORS = {
  primary: '#A78BFA',
  accent: '#FF4D4D',
  success: '#4BB543',
  warning: '#FBBF24',
  background: '#FFFFFF',
  buttonBg: '#EAF4FF',
  border: '#E0E0E0',
  textPrimary: '#1E1E2A',
};

export const QuizComponent: React.FC<QuizProps> = ({ quiz, index }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelect = (i: number) => {
    if (showResult) return;
    setSelectedOption(i);
  };

  const checkAnswer = () => {
    if (selectedOption === null) {
      setMessage('Vui lòng chọn một đáp án trước khi kiểm tra.');
      return;
    }
    setShowResult(true);
    const isCorrect = quiz.options[selectedOption].correct;
    if (isCorrect) {
      setMessage('Chính xác! Câu trả lời của bạn là đúng.');
    } else {
      const correctOption = quiz.options.find(o => o.correct)?.option || 'Không rõ';
      setMessage(`Sai rồi! Đáp án đúng là: ${correctOption}`);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowResult(false);
    setMessage('');
  };

  const getOptionStyle = (i: number) => {
    const isSelected = i === selectedOption;
    const isCorrect = quiz.options[i].correct;

    if (!showResult) {
      return [
        styles.optionButton,
        isSelected ? { borderColor: COLORS.primary, backgroundColor: COLORS.buttonBg } : {},
      ];
    } else {
      if (isCorrect) {
        return [styles.optionButton, { backgroundColor: COLORS.success, borderColor: COLORS.success }];
      } else if (isSelected && !isCorrect) {
        return [styles.optionButton, { backgroundColor: COLORS.accent, borderColor: COLORS.accent }];
      } else {
        return [styles.optionButton];
      }
    }
  };

  const getOptionTextStyle = (i: number) => {
    const isCorrect = quiz.options[i].correct;
    if (!showResult) return [styles.optionText, { color: COLORS.textPrimary }];
    if (isCorrect || (i === selectedOption && !isCorrect)) return [styles.optionText, { color: COLORS.background, fontWeight: 'bold' as const }];
    return [styles.optionText, { color: COLORS.textPrimary, opacity: 0.7 }];
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.quizQuestion}>
        Câu {index + 1}: {quiz.question}
      </Text>

      {quiz.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={getOptionStyle(i)}
          onPress={() => handleSelect(i)}
          disabled={showResult}
        >
          <Text style={getOptionTextStyle(i)}>
            {String.fromCharCode(65 + i)}. {opt.option}
          </Text>
        </TouchableOpacity>
      ))}

      {message ? (
        <View
          style={[
            styles.messageBox,
            showResult
              ? selectedOption !== null && quiz.options[selectedOption].correct
                ? { backgroundColor: '#D1FAE5' }
                : { backgroundColor: '#FECACA' }
              : { backgroundColor: '#DBEAFE' },
          ]}
        >
          <Text style={{ color: showResult ? COLORS.textPrimary : COLORS.textPrimary }}>{message}</Text>
        </View>
      ) : null}

      {!showResult ? (
        <TouchableOpacity
          style={[styles.actionButton, selectedOption === null && { backgroundColor: 'gray' }]}
          onPress={checkAnswer}
          disabled={selectedOption === null}
        >
          <Text style={styles.actionButtonText}>Kiểm tra Đáp án</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.warning }]} onPress={handleRetry}>
          <Text style={styles.actionButtonText}>Làm lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quizContainer: { marginBottom: 20, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 10 },
  quizQuestion: { fontWeight: '700', marginBottom: 10, fontSize: 16, color: COLORS.textPrimary },
  optionButton: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  optionText: { fontSize: 15 },
  actionButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFFFFF', fontWeight: '700' },
  messageBox: { padding: 10, borderRadius: 8, marginTop: 10 },
});
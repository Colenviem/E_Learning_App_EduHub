export interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user' | 'option' | 'typing';
  showTimePicker?: boolean;
  options?: string[];
}

export const QUESTIONS = [
  { question: 'Trình độ lập trình hiện tại của bạn nằm ở giai đoạn nào?', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { question: 'Lý do bạn học lập trình?', options: ['Học tập', 'Nâng cao công việc', 'Du lịch & trải nghiệm'] },
  { question: 'Bạn có thường xuyên học lập trình không?', options: ['Thường xuyên', 'Thỉnh thoảng', 'Hiếm khi'] },
  { question: 'Bạn biết ứng dụng của chúng tôi qua đâu?', options: ['Facebook', 'Instagram', 'Bạn bè giới thiệu', 'Khác'] },
  { question: 'Bạn muốn đặt lịch học không?', options: ['Có', 'Không', 'Chưa quyết định'] },
];

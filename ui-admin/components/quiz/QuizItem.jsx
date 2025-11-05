import {} from 'react'

const QuizItem = ({ quiz, onChange }) => {
  const handleQuestionChange = (e) => onChange({ ...quiz, question: e.target.value });
  const handleOptionChange = (idx, value) => {
    const newOptions = [...quiz.options];
    newOptions[idx].option = value;
    onChange({ ...quiz, options: newOptions });
  };
  const handleCorrectChange = (idx) => {
    const newOptions = quiz.options.map((opt, i) => ({ ...opt, correct: i === idx }));
    onChange({ ...quiz, options: newOptions });
  };

  return (
    <div className="border rounded-lg p-3 mb-3 bg-gray-50">
      <input
        type="text"
        value={quiz.question}
        onChange={handleQuestionChange}
        className="w-full border p-1 rounded mb-2 text-sm"
        placeholder="Câu hỏi"
      />
      {quiz.options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <input
            type="text"
            value={opt.option}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="flex-1 border p-1 rounded text-sm"
            placeholder={`Option ${i + 1}`}
          />
          <label className="flex items-center gap-1 text-xs">
            <input
              type="radio"
              checked={opt.correct}
              onChange={() => handleCorrectChange(i)}
            />
            Đúng
          </label>
        </div>
      ))}
    </div>
  );
};

export default QuizItem;
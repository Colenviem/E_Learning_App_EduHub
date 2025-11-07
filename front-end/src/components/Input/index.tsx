import React from 'react';
import { Container, Icon, TextInput } from './_styles';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void; 
  placeholder?: string; 
}

const Input: React.FC<InputProps> = ({
  value = '',
  onChangeText,
  placeholder = 'Tim kiếm khóa học',
}) => {
  return (
    <Container>
      <Icon name="search" size={20} color="#C4C4D1" />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#C4C4D1"
        onChangeText={onChangeText}
      />
    </Container>
  );
};

export default Input;

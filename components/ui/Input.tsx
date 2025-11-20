import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      
      <View
        className={`
          flex-row
          items-center
          border
          rounded-lg
          px-3
          bg-white
          dark:bg-gray-800
          ${isFocused ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        
        <TextInput
          className="flex-1 py-3 text-gray-900 dark:text-white"
          placeholderTextColor="#9ca3af"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}
      
      {helperText && !error && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}


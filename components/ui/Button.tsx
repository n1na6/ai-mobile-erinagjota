import { Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';
import { ScaleButton } from '@/components/animations';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-gray-500 active:bg-gray-600',
    outline: 'bg-transparent border-2 border-primary-500 active:bg-primary-50',
    ghost: 'bg-transparent active:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary-500',
    ghost: 'text-primary-500',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <ScaleButton
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        rounded-lg
        flex-row
        items-center
        justify-center
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#a855f7' : '#ffffff'}
        />
      ) : (
        <Text
          className={`
            ${textVariantStyles[variant]}
            ${textSizeStyles[size]}
            font-semibold
            text-center
          `}
        >
          {children}
        </Text>
      )}
    </ScaleButton>
  );
}


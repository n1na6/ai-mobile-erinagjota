import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  WithSpringConfig,
} from 'react-native-reanimated';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Show toast
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      } as WithSpringConfig);
      opacity.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      } as WithSpringConfig);

      // Auto hide
      const timer = setTimeout(() => {
        translateY.value = withSpring(-100, {
          damping: 15,
          stiffness: 100,
        } as WithSpringConfig);
        opacity.value = withSpring(0, {
          damping: 15,
          stiffness: 100,
        } as WithSpringConfig);
        if (onHide) {
          setTimeout(onHide, 300);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className={`absolute top-12 left-4 right-4 ${bgColors[type]} rounded-lg shadow-lg px-4 py-3 flex-row items-center z-50`}
    >
      <Text className="text-white text-lg font-bold mr-3">{icons[type]}</Text>
      <Text className="text-white text-base flex-1">{message}</Text>
    </Animated.View>
  );
}


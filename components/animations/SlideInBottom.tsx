import { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';

interface SlideInBottomProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
}

export function SlideInBottom({ children, delay = 0, style, ...props }: SlideInBottomProps) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      } as WithSpringConfig);
      opacity.value = withSpring(1, {
        damping: 20,
        stiffness: 90,
      } as WithSpringConfig);
    }, delay);

    return () => clearTimeout(timer);
  }, [translateY, opacity, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}


import { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

interface FadeInProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export function FadeIn({ children, duration = 300, delay = 0, style, ...props }: FadeInProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration } as WithTimingConfig, undefined);
  }, [opacity, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}


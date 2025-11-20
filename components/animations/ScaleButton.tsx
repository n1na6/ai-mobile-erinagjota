import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ScaleButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scaleValue?: number;
}

export function ScaleButton({ 
  children, 
  scaleValue = 0.95, 
  onPressIn,
  onPressOut,
  ...props 
}: ScaleButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 150,
    } as WithSpringConfig);
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    } as WithSpringConfig);
    onPressOut?.(e);
  };

  return (
    <AnimatedTouchable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      activeOpacity={0.9}
      {...props}
    >
      {children}
    </AnimatedTouchable>
  );
}


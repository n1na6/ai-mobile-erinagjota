import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (!isOnline) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      } as WithSpringConfig);
    } else {
      translateY.value = withSpring(-100, {
        damping: 15,
        stiffness: 100,
      } as WithSpringConfig);
    }
  }, [isOnline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute top-0 left-0 right-0 bg-amber-500 px-4 py-2 z-50"
    >
      <Text className="text-white text-center text-sm font-semibold">
        ⚠️ You're offline. Some features may be limited.
      </Text>
    </Animated.View>
  );
}


import { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  className = '',
  style,
  ...props 
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 } as WithTimingConfig),
        withTiming(0.3, { duration: 1000 } as WithTimingConfig)
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
        },
        animatedStyle,
        style,
      ]}
      className={className}
      {...props}
    />
  );
}

// Skeleton for mood card
export function SkeletonMoodCard() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
      <View className="flex-row items-start">
        <Skeleton width={48} height={48} borderRadius={24} className="mr-3" />
        <View className="flex-1">
          <Skeleton width="40%" height={20} className="mb-2" />
          <Skeleton width="80%" height={16} className="mb-2" />
          <View className="flex-row gap-2">
            <Skeleton width={60} height={24} borderRadius={12} />
            <Skeleton width={80} height={24} borderRadius={12} />
          </View>
        </View>
      </View>
    </View>
  );
}

// Skeleton for calendar
export function SkeletonCalendar() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Skeleton width="60%" height={24} className="mb-4 mx-auto" />
      <View className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <View key={i} className="flex-row justify-between">
            {[...Array(7)].map((_, j) => (
              <Skeleton key={j} width={40} height={40} borderRadius={20} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// Skeleton for insights chart
export function SkeletonChart() {
  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-lg">
      <Skeleton width="50%" height={20} className="mb-4" />
      <View className="h-48 flex-row items-end justify-around">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            width={30}
            height={Math.random() * 150 + 50}
            className="mb-2"
          />
        ))}
      </View>
    </View>
  );
}


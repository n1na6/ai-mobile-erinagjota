import { View, Text } from 'react-native';
import { getMoodDistributionPercentages } from '@/utils/analytics';
import { getMoodConfig } from '@/constants/moods';
import { MoodEntry } from '@/types/mood.types';

interface MoodDistributionChartProps {
  entries: MoodEntry[];
}

export function MoodDistributionChart({ entries }: MoodDistributionChartProps) {
  const distribution = getMoodDistributionPercentages(entries);

  if (entries.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-gray-500 dark:text-gray-400">
          No mood data available
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-3">
      {distribution.map(({ mood, percentage, count }) => {
        const moodConfig = getMoodConfig(mood);
        if (!moodConfig || count === 0) return null;

        return (
          <View key={mood} className="space-y-1">
            {/* Label Row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">{moodConfig.emoji}</Text>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {moodConfig.label}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {percentage.toFixed(0)}% ({count})
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: moodConfig.color,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}


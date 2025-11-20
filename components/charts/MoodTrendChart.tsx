import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getMoodTrendData } from '@/utils/analytics';
import { MoodEntry } from '@/types/mood.types';

interface MoodTrendChartProps {
  entries: MoodEntry[];
  days?: number;
}

export function MoodTrendChart({ entries, days = 7 }: MoodTrendChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 48; // Account for padding
  
  const trendData = getMoodTrendData(entries, days);
  
  // Filter out days with no data
  const validData = trendData.filter((item) => item.score > 0);

  if (validData.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-gray-500 dark:text-gray-400">
          Not enough data to show trend
        </Text>
      </View>
    );
  }

  // Prepare data for react-native-chart-kit
  const chartData = {
    labels: validData.map((item) => item.label),
    datasets: [
      {
        data: validData.map((item) => item.score),
        color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // primary-500
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#ffffff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5, 5',
      stroke: '#e5e7eb',
    },
  };

  return (
    <View className="items-center">
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        segments={4}
        yAxisInterval={1}
        fromZero={false}
        yAxisLabel=""
        yAxisSuffix=""
      />
      
      {/* Emoji Y-axis legend */}
      <View className="flex-row justify-between w-full mt-4 px-4">
        <Text className="text-xs text-gray-600 dark:text-gray-400">😢 Terrible</Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">😐 Neutral</Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">😄 Great</Text>
      </View>
    </View>
  );
}


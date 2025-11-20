import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { Card, SkeletonChart, NoInsightsEmptyState } from '@/components/ui';
import { FadeIn, SlideInBottom } from '@/components/animations';
import { MoodTrendChart, MoodDistributionChart } from '@/components/charts';
import { hapticFeedback } from '@/utils/haptics';
import {
  calculateMoodStats,
  getRecentEntries,
  getTopActivities,
  isMoodImproving,
} from '@/utils/analytics';

export default function InsightsScreen() {
  const { entries, loading, refresh } = useMoodEntries();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Filter entries based on time range
  const filteredEntries =
    timeRange === 'all'
      ? entries
      : getRecentEntries(entries, timeRange === 'week' ? 7 : 30);

  // Calculate statistics
  const stats = calculateMoodStats(filteredEntries);
  const topActivities = getTopActivities(filteredEntries, 5);
  const improving = isMoodImproving(entries);

  // Show empty state if no entries
  if (!loading && entries.length < 3) {
    return (
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <View className="p-6">
          <FadeIn>
            <View className="mb-6">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Insights 📊
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400">
                Understand your mood patterns
              </Text>
            </View>
          </FadeIn>
          <NoInsightsEmptyState />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <View className="p-6">
        {/* Header */}
        <FadeIn>
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Insights 📊
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Understand your mood patterns
            </Text>
          </View>
        </FadeIn>

        {/* Time Range Selector */}
        <SlideInBottom delay={100}>
          <View className="flex-row mb-6 bg-white dark:bg-gray-800 rounded-lg p-1">
            {(['week', 'month', 'all'] as const).map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => {
                  hapticFeedback.light();
                  setTimeRange(range);
                }}
              className={`flex-1 py-2 rounded-md ${
                timeRange === range
                  ? 'bg-primary-500'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium capitalize ${
                  timeRange === range
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
          </View>
        </SlideInBottom>

        {entries.length === 0 ? (
          // Empty State
          <Card variant="outlined" padding="lg" className="items-center">
            <Text className="text-6xl mb-4">📊</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              No Insights Yet
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Start logging your moods to see your patterns and trends
            </Text>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Key Metrics
              </Text>
              <View className="flex-row flex-wrap -mx-2">
                {/* Average Score */}
                <View className="w-1/2 px-2 mb-4">
                  <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.averageMoodScore.toFixed(1)}
                    </Text>
                    <Text className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Average Score
                    </Text>
                  </View>
                </View>

                {/* Total Entries */}
                <View className="w-1/2 px-2 mb-4">
                  <View className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <Text className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.totalEntries}
                    </Text>
                    <Text className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Total Entries
                    </Text>
                  </View>
                </View>

                {/* Current Streak */}
                <View className="w-1/2 px-2 mb-4">
                  <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <Text className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.currentStreak}
                    </Text>
                    <Text className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Day Streak 🔥
                    </Text>
                  </View>
                </View>

                {/* Longest Streak */}
                <View className="w-1/2 px-2 mb-4">
                  <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <Text className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.longestStreak}
                    </Text>
                    <Text className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      Best Streak 🏆
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mood Trend Indicator */}
              {entries.length >= 7 && (
                <View
                  className={`mt-2 p-3 rounded-lg ${
                    improving
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium text-center ${
                      improving
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {improving ? '📈 Your mood is improving!' : '📊 Keep tracking your mood'}
                  </Text>
                </View>
              )}
            </Card>

            {/* Mood Trend Chart */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Mood Trend
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your mood over the last {timeRange === 'week' ? '7' : timeRange === 'month' ? '30' : 'all'} days
              </Text>
              <MoodTrendChart
                entries={filteredEntries}
                days={timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90}
              />
            </Card>

            {/* Mood Distribution */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Mood Distribution
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Breakdown of your moods
              </Text>
              <MoodDistributionChart entries={filteredEntries} />
            </Card>

            {/* Top Activities */}
            {topActivities.length > 0 && (
              <Card variant="elevated" padding="md" className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Top Activities
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Most frequent activities
                </Text>
                <View className="space-y-3">
                  {topActivities.map(({ activity, count }, index) => (
                    <View key={activity} className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center mr-3">
                          <Text className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {index + 1}
                          </Text>
                        </View>
                        <Text className="text-base text-gray-700 dark:text-gray-300 flex-1">
                          {activity}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white mr-2">
                          {count}
                        </Text>
                        <View className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <View
                            className="h-full bg-primary-500 rounded-full"
                            style={{
                              width: `${(count / topActivities[0].count) * 100}%`,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Insights Tips */}
            <Card variant="outlined" padding="md" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <View className="flex-row items-start">
                <Text className="text-2xl mr-3">💡</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Pro Tip
                  </Text>
                  <Text className="text-xs text-blue-700 dark:text-blue-300">
                    Track your mood daily to get more accurate insights and patterns. Consistency is key!
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}


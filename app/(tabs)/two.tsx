import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';
import { DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MoodCalendar } from '@/components/mood/MoodCalendar';
import { MoodCard } from '@/components/mood';
import { Card, NoEntriesForDateEmptyState } from '@/components/ui';
import { FadeIn, SlideInBottom } from '@/components/animations';

export default function CalendarScreen() {
  const { entries, loading, refresh } = useMoodEntries();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Get entries for selected date
  const selectedDateEntries = selectedDate
    ? entries.filter((entry) => {
        const entryDate = format(new Date(entry.created_at), 'yyyy-MM-dd');
        return entryDate === selectedDate;
      })
    : [];

  // Get current month stats
  const currentMonthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const now = new Date();
    return (
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getFullYear() === now.getFullYear()
    );
  });

  const averageMoodScore = currentMonthEntries.length > 0
    ? currentMonthEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / currentMonthEntries.length
    : 0;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View className="p-6">
        {/* Header */}
        <FadeIn>
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Calendar 📅
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              Your mood journey at a glance
            </Text>
          </View>
        </FadeIn>

        {/* Month Stats */}
        <SlideInBottom delay={100}>
          <Card variant="elevated" padding="md" className="mb-6">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary-500">
                {currentMonthEntries.length}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Days Logged
              </Text>
            </View>
            <View className="w-px bg-gray-200 dark:bg-gray-700" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary-500">
                {averageMoodScore > 0 ? averageMoodScore.toFixed(1) : '-'}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Avg. Score
              </Text>
            </View>
            <View className="w-px bg-gray-200 dark:bg-gray-700" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary-500">
                {entries.length}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Entries
              </Text>
            </View>
          </View>
          </Card>
        </SlideInBottom>

        {/* Calendar */}
        <SlideInBottom delay={200}>
          <Card variant="elevated" padding="md" className="mb-6">
          <MoodCalendar
            entries={entries}
            onDayPress={handleDayPress}
            selectedDate={selectedDate}
          />
          </Card>
        </SlideInBottom>

        {/* Selected Date Entries */}
        {selectedDate && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </Text>
              {selectedDateEntries.length > 0 && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'entry' : 'entries'}
                </Text>
              )}
            </View>

            {selectedDateEntries.length > 0 ? (
              <FadeIn>
                {selectedDateEntries.map((entry) => (
                  <MoodCard key={entry.id} entry={entry} showDate={false} />
                ))}
              </FadeIn>
            ) : (
              <NoEntriesForDateEmptyState />
            )}
          </View>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <Card variant="outlined" padding="lg" className="items-center">
            <Text className="text-6xl mb-4">📅</Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              No Entries Yet
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Start logging your moods to see them appear on the calendar
            </Text>
          </Card>
        )}

        {/* Tip */}
        {entries.length > 0 && !selectedDate && (
          <Card variant="outlined" padding="md" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <Text className="text-sm text-blue-700 dark:text-blue-300 text-center">
              💡 Tap any day to see your mood entries
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

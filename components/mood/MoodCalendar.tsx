import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useMemo } from 'react';
import { MoodEntry } from '@/types/mood.types';
import { getMoodConfig } from '@/constants/moods';
import { formatDateKey } from '@/utils/dateHelpers';
import { hapticFeedback } from '@/utils/haptics';

interface MoodCalendarProps {
  entries: MoodEntry[];
  onDayPress: (date: DateData) => void;
  selectedDate?: string;
}

export function MoodCalendar({ entries, onDayPress, selectedDate }: MoodCalendarProps) {
  // Create a map of dates to mood entries and their emojis
  const entryMap = useMemo(() => {
    const map: { [key: string]: MoodEntry } = {};
    entries.forEach((entry) => {
      const dateKey = formatDateKey(new Date(entry.created_at));
      map[dateKey] = entry;
    });
    return map;
  }, [entries]);

  // Create marked dates with custom styling
  const markedDates = useMemo(() => {
    const dates: { [key: string]: any } = {};

    entries.forEach((entry) => {
      const dateKey = formatDateKey(new Date(entry.created_at));
      const moodConfig = getMoodConfig(entry.mood_type);
      const isSelected = selectedDate === dateKey;

      if (moodConfig) {
        dates[dateKey] = {
          marked: true,
          selected: isSelected,
          customStyles: {
            container: {
              backgroundColor: isSelected ? moodConfig.color + '25' : 'transparent',
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? moodConfig.color : 'transparent',
              borderRadius: 12,
              elevation: isSelected ? 2 : 0,
              shadowColor: isSelected ? moodConfig.color : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            text: {
              color: '#111827',
              fontWeight: isSelected ? 'bold' : '500',
              fontSize: 15,
            },
          },
        };
      }
    });

    // Add selected date if it's not already marked
    if (selectedDate && !dates[selectedDate]) {
      dates[selectedDate] = {
        selected: true,
        customStyles: {
          container: {
            backgroundColor: '#e0f2fe',
            borderWidth: 2,
            borderColor: '#0ea5e9',
            borderRadius: 12,
          },
          text: {
            color: '#0ea5e9',
            fontWeight: 'bold',
          },
        },
      };
    }

    return dates;
  }, [entries, selectedDate]);

  const handleDayPress = (day: DateData) => {
    hapticFeedback.light();
    onDayPress(day);
  };

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        markingType="custom"
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#9ca3af',
          todayTextColor: '#0ea5e9',
          dayTextColor: '#374151',
          textDisabledColor: '#d1d5db',
          arrowColor: '#0ea5e9',
          monthTextColor: '#111827',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 13,
        }}
        renderArrow={(direction) => (
          <View className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100">
            <Text className="text-primary-500 text-2xl font-bold">
              {direction === 'left' ? '‹' : '›'}
            </Text>
          </View>
        )}
        dayComponent={({ date, state }: any) => {
          if (!date) return <View style={{ width: 48, height: 48 }} />;
          
          const dateKey = date.dateString;
          const entry = entryMap[dateKey];
          const moodConfig = entry ? getMoodConfig(entry.mood_type) : null;
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === formatDateKey(new Date());
          const isDisabled = state === 'disabled';
          
          return (
            <TouchableOpacity
              onPress={() => !isDisabled && handleDayPress(date)}
              disabled={isDisabled}
              activeOpacity={0.7}
              style={{
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: isSelected && moodConfig 
                  ? moodConfig.color + '20' 
                  : isToday && !isSelected 
                  ? '#e0f2fe' 
                  : 'transparent',
                borderWidth: isSelected && moodConfig ? 2 : isToday && !isSelected ? 1 : 0,
                borderColor: isSelected && moodConfig ? moodConfig.color : isToday ? '#0ea5e9' : 'transparent',
              }}
            >
              {/* Date Number */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: isSelected || isToday ? '700' : '500',
                  color: isDisabled 
                    ? '#d1d5db' 
                    : isToday 
                    ? '#0ea5e9' 
                    : '#374151',
                  marginBottom: moodConfig ? 8 : 0,
                }}
              >
                {date.day}
              </Text>
              
              {/* Mood Emoji Indicator */}
              {moodConfig && !isDisabled && (
                <Text style={{ fontSize: 12, position: 'absolute', bottom: 4 }}>
                  {moodConfig.emoji}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        enableSwipeMonths={true}
      />

      {/* Legend */}
      <View className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">
          📊 Mood Scale
        </Text>
        <View className="space-y-3">
          {[
            { label: 'Great', color: '#10b981', emoji: '😄' },
            { label: 'Good', color: '#22c55e', emoji: '🙂' },
            { label: 'Neutral', color: '#eab308', emoji: '😐' },
            { label: 'Bad', color: '#f97316', emoji: '😟' },
            { label: 'Terrible', color: '#ef4444', emoji: '😢' },
          ].map((mood) => (
            <View key={mood.label} className="flex-row items-center mb-2">
              <View
                className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                style={{ backgroundColor: mood.color + '20' }}
              >
                <Text className="text-base">{mood.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {mood.label}
                </Text>
              </View>
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}


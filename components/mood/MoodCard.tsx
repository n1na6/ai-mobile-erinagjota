import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { MoodEntry } from '@/types/mood.types';
import { getMoodConfig } from '@/constants/moods';
import { Card } from '@/components/ui';

interface MoodCardProps {
  entry: MoodEntry;
  onPress?: () => void;
  showDate?: boolean;
}

export function MoodCard({ entry, onPress, showDate = true }: MoodCardProps) {
  const router = useRouter();
  const moodConfig = getMoodConfig(entry.mood_type);

  if (!moodConfig) return null;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior: navigate to entry detail
      router.push(`/entry/${entry.id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card 
        variant="outlined" 
        padding="md" 
        className="mb-3"
      >
        <View className="flex-row items-start">
          {/* Mood Emoji */}
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: moodConfig.color + '20' }}
          >
            <Text className="text-2xl">{moodConfig.emoji}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Mood Label & Time */}
            <View className="flex-row items-center justify-between mb-1">
              <Text 
                className="text-lg font-bold"
                style={{ color: moodConfig.color }}
              >
                {moodConfig.label}
              </Text>
              {showDate && (
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(entry.created_at), 'h:mm a')}
                </Text>
              )}
            </View>

            {/* Note */}
            {entry.note && (
              <Text 
                className="text-sm text-gray-700 dark:text-gray-300 mb-2"
                numberOfLines={2}
              >
                {entry.note}
              </Text>
            )}

            {/* Activities */}
            {entry.activities && entry.activities.length > 0 && (
              <View className="flex-row flex-wrap gap-1">
                {entry.activities.slice(0, 3).map((activity, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                  >
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {activity}
                    </Text>
                  </View>
                ))}
                {entry.activities.length > 3 && (
                  <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      +{entry.activities.length - 3} more
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}


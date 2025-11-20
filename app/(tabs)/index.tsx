import { View, Text, ScrollView, TextInput, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { MoodSelector, MoodCard } from '@/components/mood';
import { Button, Card, SkeletonMoodCard, NoMoodsEmptyState } from '@/components/ui';
import { FadeIn, SlideInBottom } from '@/components/animations';
import { MoodType } from '@/types/mood.types';
import { COMMON_ACTIVITIES } from '@/constants/moods';
import { hapticFeedback } from '@/utils/haptics';

export default function HomeScreen() {
  const { user } = useAuth();
  const { entries, todayEntry, loading, createEntry, refresh } = useMoodEntries();

  // Form state
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivityToggle = (activity: string) => {
    hapticFeedback.light();
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    hapticFeedback.medium();
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      Alert.alert('Select Mood', 'Please select how you\'re feeling');
      return;
    }

    setIsSubmitting(true);

    const moodScore = 
      selectedMood === 'great' ? 5 :
      selectedMood === 'good' ? 4 :
      selectedMood === 'neutral' ? 3 :
      selectedMood === 'bad' ? 2 : 1;

    const { error } = await createEntry({
      mood_type: selectedMood,
      mood_score: moodScore,
      note: note.trim() || undefined,
      activities: selectedActivities.length > 0 ? selectedActivities : undefined,
    });

    setIsSubmitting(false);

    if (error) {
      hapticFeedback.error();
      Alert.alert('Error', error);
    } else {
      hapticFeedback.success();
      // Reset form
      setSelectedMood(null);
      setNote('');
      setSelectedActivities([]);
      Alert.alert('Success', 'Mood entry saved! 🎉');
    }
  };

  const recentEntries = entries.slice(0, 5);

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
              Hello! 👋
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
          </View>
        </FadeIn>

        {/* Today's Entry or Add Entry Form */}
        {todayEntry ? (
          <SlideInBottom delay={100}>
            <Card variant="elevated" padding="lg" className="mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Today's Mood
              </Text>
              <MoodCard entry={todayEntry} showDate={false} />
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                You've already logged your mood today! Check back tomorrow.
              </Text>
            </Card>
          </SlideInBottom>
        ) : (
          <SlideInBottom delay={100}>
            <Card variant="elevated" padding="lg" className="mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Log Your Mood
              </Text>

              {/* Mood Selector */}
              <View className="mb-6">
                <MoodSelector
                  selectedMood={selectedMood}
                  onSelect={handleMoodSelect}
                  size="lg"
                />
              </View>

            {selectedMood && (
              <>
                {/* Note Input */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What's on your mind? (Optional)
                  </Text>
                  <TextInput
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white min-h-[80px]"
                    placeholder="Share your thoughts..."
                    placeholderTextColor="#9ca3af"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Activities Selector */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What were you doing? (Optional)
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {COMMON_ACTIVITIES.slice(0, 12).map((activity) => {
                      const isSelected = selectedActivities.includes(activity);
                      return (
                        <Button
                          key={activity}
                          variant={isSelected ? 'primary' : 'outline'}
                          size="sm"
                          onPress={() => handleActivityToggle(activity)}
                        >
                          {activity}
                        </Button>
                      );
                    })}
                  </View>
                </View>

                {/* Submit Button */}
                <Button
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  fullWidth
                  size="lg"
                >
                  Save Mood Entry
                </Button>
              </>
            )}
            </Card>
          </SlideInBottom>
        )}

        {/* Loading State */}
        {loading && entries.length === 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Entries
            </Text>
            <SkeletonMoodCard />
            <SkeletonMoodCard />
            <SkeletonMoodCard />
          </View>
        )}

        {/* Recent Entries */}
        {!loading && recentEntries.length > 0 && (
          <SlideInBottom delay={200}>
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Entries
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {entries.length} total
                </Text>
              </View>

              {recentEntries.map((entry, index) => (
                <FadeIn key={entry.id} delay={index * 50}>
                  <View className="mb-2">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                      {format(new Date(entry.created_at), 'EEEE, MMM d')}
                    </Text>
                    <MoodCard entry={entry} />
                  </View>
                </FadeIn>
              ))}
            </View>
          </SlideInBottom>
        )}

        {/* Empty State */}
        {!loading && entries.length === 0 && !todayEntry && (
          <NoMoodsEmptyState />
        )}
      </View>
    </ScrollView>
  );
}

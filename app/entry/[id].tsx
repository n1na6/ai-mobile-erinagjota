import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { Button, Card } from '@/components/ui';
import { MoodSelector } from '@/components/mood';
import { getMoodConfig, COMMON_ACTIVITIES } from '@/constants/moods';
import { MoodType } from '@/types/mood.types';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, updateEntry, deleteEntry } = useMoodEntries();

  // Find the entry
  const entry = entries.find((e) => e.id === id);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>(entry?.mood_type || 'neutral');
  const [note, setNote] = useState(entry?.note || '');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(entry?.activities || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-6">
        <Text className="text-2xl mb-4">😕</Text>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Entry Not Found
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          This mood entry could not be found or has been deleted.
        </Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  const moodConfig = getMoodConfig(entry.mood_type);

  const handleSave = async () => {
    setIsSubmitting(true);

    const moodScore = getMoodConfig(selectedMood)?.score || 3;
    const result = await updateEntry(entry.id, {
      mood_type: selectedMood,
      mood_score: moodScore,
      note: note.trim(),
      activities: selectedActivities,
    });

    setIsSubmitting(false);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Success', 'Mood entry updated!');
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    console.log('🗑️ Delete button pressed for entry:', entry.id);
    
    // Web fallback: use native confirm
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm(
        'Are you sure you want to delete this mood entry? This cannot be undone.'
      );
      
      if (confirmed) {
        console.log('✅ Delete confirmed');
        executeDelete();
      } else {
        console.log('❌ Delete cancelled');
      }
    } else {
      // Native: use Alert
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this mood entry? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => console.log('❌ Delete cancelled') },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              console.log('✅ Delete confirmed');
              executeDelete();
            },
          },
        ]
      );
    }
  };

  const executeDelete = async () => {
    console.log('🚀 Executing delete for entry:', entry.id);
    const result = await deleteEntry(entry.id);
    
    console.log('Delete result:', result);
    
    if (result.error) {
      console.error('❌ Delete error:', result.error);
      Alert.alert('Error', result.error);
    } else {
      console.log('✅ Entry deleted successfully');
      router.back();
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-primary-500 text-base font-semibold">← Back</Text>
          </TouchableOpacity>
          {!isEditing && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date & Time */}
        <Card variant="elevated" padding="md" className="mb-6">
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logged on</Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy')}
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mt-1">
            {format(new Date(entry.created_at), 'h:mm a')}
          </Text>
        </Card>

        {/* View Mode */}
        {!isEditing ? (
          <>
            {/* Mood Display */}
            <Card variant="elevated" padding="lg" className="mb-6">
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                How you felt
              </Text>
              <View className="flex-row items-center">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: moodConfig?.color + '20' }}
                >
                  <Text className="text-4xl">{moodConfig?.emoji}</Text>
                </View>
                <View>
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: moodConfig?.color }}
                  >
                    {moodConfig?.label}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {moodConfig?.description}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Note */}
            {entry.note && (
              <Card variant="elevated" padding="md" className="mb-6">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Your thoughts
                </Text>
                <Text className="text-base text-gray-900 dark:text-white leading-6">
                  {entry.note}
                </Text>
              </Card>
            )}

            {/* Activities */}
            {entry.activities && entry.activities.length > 0 && (
              <Card variant="elevated" padding="md" className="mb-6">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Activities ({entry.activities.length})
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {entry.activities.map((activity, index) => (
                    <View
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900/30 px-3 py-2 rounded-full"
                    >
                      <Text className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {activity}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Metadata */}
            <Card variant="outlined" padding="md" className="bg-gray-50 dark:bg-gray-800">
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Entry ID: {entry.id.substring(0, 8)}...
              </Text>
              {entry.updated_at !== entry.created_at && (
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {format(new Date(entry.updated_at), 'MMM d, h:mm a')}
                </Text>
              )}
            </Card>
          </>
        ) : (
          /* Edit Mode */
          <>
            {/* Mood Selector */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Change Mood
              </Text>
              <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
            </Card>

            {/* Note Editor */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Edit Note
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="What's on your mind?"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white min-h-[120px]"
                style={{ textAlignVertical: 'top' }}
              />
            </Card>

            {/* Activities Editor */}
            <Card variant="elevated" padding="md" className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Activities
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {COMMON_ACTIVITIES.map((activity) => (
                  <TouchableOpacity
                    key={activity}
                    onPress={() => toggleActivity(activity)}
                    className={`px-3 py-2 rounded-full border ${
                      selectedActivities.includes(activity)
                        ? 'bg-primary-500 border-primary-600'
                        : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedActivities.includes(activity)
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {activity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-6">
              <Button
                onPress={() => {
                  setIsEditing(false);
                  setSelectedMood(entry.mood_type);
                  setNote(entry.note || '');
                  setSelectedActivities(entry.activities || []);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onPress={handleSave}
                loading={isSubmitting}
                disabled={isSubmitting}
                className="flex-1"
              >
                Save Changes
              </Button>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}


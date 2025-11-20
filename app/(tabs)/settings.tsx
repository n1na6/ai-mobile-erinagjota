import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useAuthStore } from '@/store/authStore';
import { useMoodStore } from '@/store/moodStore';
import { Card, Button } from '@/components/ui';
import { exportAsJSON, exportAsCSV, getExportSummary } from '@/utils/export';
import { calculateMoodStats } from '@/utils/analytics';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { entries } = useMoodEntries();
  const { fetchAllEntries } = useMoodStore();
  const { signOut } = useAuthStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stats = calculateMoodStats(entries);
  const exportSummary = getExportSummary(entries);

  const handleExportJSON = async () => {
    if (!user) return;
    
    setIsExporting(true);
    
    // Fetch ALL entries for export (not just the cached 180)
    console.log('📤 Exporting all entries as JSON...');
    const allEntries = await fetchAllEntries(user.id);
    const result = await exportAsJSON(allEntries, user.id);
    
    setIsExporting(false);

    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Export Failed', result.message);
    }
  };

  const handleExportCSV = async () => {
    if (!user) return;
    
    setIsExporting(true);
    
    // Fetch ALL entries for export (not just the cached 180)
    console.log('📤 Exporting all entries as CSV...');
    const allEntries = await fetchAllEntries(user.id);
    const result = await exportAsCSV(allEntries, user.id);
    
    setIsExporting(false);

    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Export Failed', result.message);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        executeLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: executeLogout },
        ]
      );
    }
  };

  const executeLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    // Auth guard in _layout.tsx will handle navigation
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-6">
        <Text className="text-2xl mb-4">🔒</Text>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Not Logged In
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Please log in to access settings
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Settings ⚙️
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Section */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center mb-3">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user.email}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Member since {format(new Date(user.created_at || Date.now()), 'MMM yyyy')}
            </Text>
          </View>

          {/* User Stats */}
          <View className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-500">
                  {stats.totalEntries}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Total Entries
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">
                  {stats.currentStreak}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Current Streak
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-500">
                  {stats.longestStreak}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Best Streak
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Export Data Section */}
        <Card variant="elevated" padding="md" className="mb-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Export Data 📥
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download your mood journal data
          </Text>

          {/* Export Summary */}
          {entries.length > 0 && (
            <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-700">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-blue-700 dark:text-blue-300">Total Entries:</Text>
                <Text className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  {exportSummary.totalEntries}
                </Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-blue-700 dark:text-blue-300">First Entry:</Text>
                <Text className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  {exportSummary.oldestEntry}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-blue-700 dark:text-blue-300">Latest Entry:</Text>
                <Text className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  {exportSummary.newestEntry}
                </Text>
              </View>
            </View>
          )}

          {/* Export Buttons */}
          <View className="gap-3">
            <Button
              onPress={handleExportJSON}
              disabled={isExporting || entries.length === 0}
              loading={isExporting}
              variant="outline"
              className="flex-row items-center justify-center"
            >
              📄 Export as JSON
            </Button>
            <Button
              onPress={handleExportCSV}
              disabled={isExporting || entries.length === 0}
              loading={isExporting}
              variant="outline"
              className="flex-row items-center justify-center"
            >
              📊 Export as CSV
            </Button>
          </View>

          {entries.length === 0 && (
            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              No entries to export yet. Start tracking your mood!
            </Text>
          )}
        </Card>

        {/* Account Actions */}
        <Card variant="elevated" padding="md" className="mb-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Account 🔐
          </Text>
          
          <Button
            onPress={handleLogout}
            disabled={isLoggingOut}
            loading={isLoggingOut}
            variant="outline"
            className="border-red-500 dark:border-red-400"
          >
            <Text className="text-red-500 dark:text-red-400 font-semibold">
              Logout
            </Text>
          </Button>
        </Card>

        {/* About Section */}
        <Card variant="outlined" padding="md" className="mb-6 bg-gray-50 dark:bg-gray-800">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            About MoodFlow 💭
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Version 1.0.0
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 leading-5">
            MoodFlow helps you track and understand your emotional well-being. 
            Log your daily moods, track activities, and gain insights into your mental health patterns.
          </Text>
        </Card>

        {/* App Info */}
        <View className="items-center py-4">
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            Made with ❤️ for mental wellness
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2025 MoodFlow
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}


import { View, Text } from 'react-native';
import { Button } from './Button';
import { FadeIn } from '@/components/animations';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <FadeIn className={`flex-1 items-center justify-center p-8 ${className}`}>
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 leading-5">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button onPress={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </FadeIn>
  );
}

// Pre-built empty states
export function NoMoodsEmptyState({ onAddMood }: { onAddMood?: () => void }) {
  return (
    <EmptyState
      icon="😊"
      title="No Moods Yet"
      description="Start tracking your emotional journey by logging your first mood entry. It only takes a moment!"
      actionLabel={onAddMood ? "Log Your First Mood" : undefined}
      onAction={onAddMood}
    />
  );
}

export function NoEntriesForDateEmptyState() {
  return (
    <EmptyState
      icon="📭"
      title="No Entry for This Day"
      description="You didn't log your mood on this date. That's okay! Start tracking consistently to build your mood history."
    />
  );
}

export function NoInsightsEmptyState() {
  return (
    <EmptyState
      icon="📊"
      title="Not Enough Data"
      description="Keep tracking your mood daily to unlock meaningful insights and patterns about your emotional well-being."
    />
  );
}

export function ErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="⚠️"
      title="Something Went Wrong"
      description="We couldn't load your data. Please check your connection and try again."
      actionLabel={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
    />
  );
}


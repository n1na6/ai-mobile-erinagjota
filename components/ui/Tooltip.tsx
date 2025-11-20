import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { FadeIn } from '@/components/animations';
import { Button } from './Button';

interface TooltipProps {
  visible: boolean;
  title: string;
  description: string;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
}

export function Tooltip({
  visible,
  title,
  description,
  onNext,
  onSkip,
  nextLabel = 'Got it!',
  skipLabel = 'Skip',
}: TooltipProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onSkip}
        className="flex-1 bg-black/70 items-center justify-center p-6"
      >
        <FadeIn>
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm shadow-lg">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 mb-6">
                {description}
              </Text>
              <View className="flex-row gap-3">
                {onSkip && (
                  <Button onPress={onSkip} variant="ghost" className="flex-1">
                    {skipLabel}
                  </Button>
                )}
                {onNext && (
                  <Button onPress={onNext} className="flex-1">
                    {nextLabel}
                  </Button>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </FadeIn>
      </TouchableOpacity>
    </Modal>
  );
}


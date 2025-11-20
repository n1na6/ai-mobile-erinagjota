import { View, Text, TouchableOpacity } from 'react-native';
import { MOODS } from '@/constants/moods';
import { MoodType } from '@/types/mood.types';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodSelector({ selectedMood, onSelect, size = 'md' }: MoodSelectorProps) {
  const sizeStyles = {
    sm: { container: 'w-12 h-12', emoji: 'text-2xl' },
    md: { container: 'w-16 h-16', emoji: 'text-3xl' },
    lg: { container: 'w-20 h-20', emoji: 'text-4xl' },
  };

  const currentSize = sizeStyles[size];

  return (
    <View className="w-full">
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
        How are you feeling?
      </Text>
      
      <View className="flex-row justify-between items-center px-2">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.type;
          
          return (
            <TouchableOpacity
              key={mood.type}
              onPress={() => onSelect(mood.type)}
              className={`
                ${currentSize.container}
                rounded-full
                items-center
                justify-center
                ${isSelected ? 'bg-opacity-20 scale-110' : 'bg-white dark:bg-gray-800'}
                border-2
                ${isSelected ? 'border-gray-400' : 'border-gray-200 dark:border-gray-700'}
              `}
              style={{
                backgroundColor: isSelected ? mood.color + '30' : undefined,
                borderColor: isSelected ? mood.color : undefined,
              }}
            >
              <Text className={currentSize.emoji}>{mood.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Show selected mood label */}
      {selectedMood && (
        <View className="mt-3">
          {MOODS.filter(m => m.type === selectedMood).map((mood) => (
            <View key={mood.type} className="items-center">
              <Text 
                className="text-xl font-bold"
                style={{ color: mood.color }}
              >
                {mood.label}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mood.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}


import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY_PREFIX = '@moodflow_draft_';

export function useDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const storageKey = DRAFT_KEY_PREFIX + key;

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(storageKey);
      if (draft) {
        setValue(JSON.parse(draft));
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save draft whenever value changes
  useEffect(() => {
    if (!loading) {
      saveDraft();
    }
  }, [value, loading]);

  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const clearDraft = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setValue(initialValue);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [storageKey, initialValue]);

  return {
    value,
    setValue,
    clearDraft,
    loading,
  };
}


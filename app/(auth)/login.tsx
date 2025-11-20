import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    console.log('🔑 Attempting login with:', email);
    const { error } = await signIn(email, password);

    if (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Login Failed', error);
    } else {
      console.log('✅ Login successful! Waiting for redirect...');
      // Navigation handled automatically by root layout
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerClassName="flex-grow justify-center p-6"
      >
        <View className="max-w-md w-full mx-auto">
          {/* Logo/Title */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-primary-500 mb-2">
              MoodFlow
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Track your moods, improve your well-being
            </Text>
          </View>

          {/* Login Card */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome Back
            </Text>

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              error={errors.password}
            />

            <Button
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              fullWidth
              className="mt-2"
            >
              Sign In
            </Button>

            {/* Forgot Password */}
            <TouchableOpacity className="mt-4 items-center">
              <Text className="text-sm text-primary-500">
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-primary-500 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials (Remove in production) */}
          <Card variant="outlined" padding="md" className="mt-6 bg-blue-50 dark:bg-blue-900/20">
            <Text className="text-xs text-blue-700 dark:text-blue-300 text-center">
              Demo: Sign up with any email and password (min 6 chars)
            </Text>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


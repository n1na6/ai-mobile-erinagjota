import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const { error } = await signUp(email, password);

    if (error) {
      Alert.alert('Signup Failed', error);
    } else {
      Alert.alert(
        'Success!',
        'Your account has been created. You can now log in.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
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
            <Text className="text-lg text-gray-600 dark:text-gray-400 text-center">
              Start your journey to better well-being
            </Text>
          </View>

          {/* Signup Card */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Create Account
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
              placeholder="Choose a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              error={errors.password}
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />

            <Button
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              fullWidth
              className="mt-2"
            >
              Create Account
            </Button>

            {/* Terms */}
            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Card>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary-500 font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from './ui';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center p-6">
          <ScrollView contentContainerClassName="items-center">
            <Text className="text-6xl mb-4">😵</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 max-w-full">
                <Text className="text-sm text-red-700 dark:text-red-300 font-mono">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <Button onPress={this.handleReset} size="lg">
              Try Again
            </Button>

            <Button onPress={() => {
              // Reset app state if needed
              this.handleReset();
            }} variant="ghost" size="sm" className="mt-4">
              Return to Home
            </Button>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}


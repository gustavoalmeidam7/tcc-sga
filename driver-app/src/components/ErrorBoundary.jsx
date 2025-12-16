import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou erro:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
          <View className="bg-red-100 p-4 rounded-full mb-6">
            <Feather name="alert-triangle" size={48} color="#EF4444" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Ops! Algo deu errado
          </Text>

          <Text className="text-base text-gray-600 mb-6 text-center">
            O aplicativo encontrou um erro inesperado. Tente reiniciar.
          </Text>

          {__DEV__ && this.state.error && (
            <ScrollView className="w-full bg-gray-800 rounded-lg p-4 mb-4 max-h-40">
              <Text className="text-red-400 font-mono text-xs">
                {this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text className="text-gray-400 font-mono text-xs mt-2">
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={this.handleReset}
            className="bg-blue-600 px-8 py-4 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-base">
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



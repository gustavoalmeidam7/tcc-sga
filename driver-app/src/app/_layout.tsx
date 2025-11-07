import '@/src/styles/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Routes />
    </SafeAreaProvider>
  );
}

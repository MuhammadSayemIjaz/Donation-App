import 'react-native-gesture-handler';
import AppNavigation from './src/routes/AppNavigation';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
      <Toast />
    </AuthProvider>
  );
}

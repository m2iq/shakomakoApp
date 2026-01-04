import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useFonts, Tajawal_700Bold, Tajawal_400Regular } from '@expo-google-fonts/tajawal';
import { useColorScheme } from '@/components/useColorScheme';
import { Platform } from 'react-native';


export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// منع إخفاء الشاشة الترحيبية قبل تحميل الموارد
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Tajawal_700Bold,
    Tajawal_400Regular,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false, // 🔒 إخفاء الترويسة بشكل عام
          
        }}
      >
        
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="profile"/>
        <Stack.Screen name="profileVideos"/>
        <Stack.Screen name="camera" options={{animation : 'fade_from_bottom'}}/>
        
        <Stack.Screen name="modal" options={{ presentation: 'containedTransparentModal', animation : 'slide_from_left'}} />
      </Stack>
       
    </ThemeProvider>
  );
}

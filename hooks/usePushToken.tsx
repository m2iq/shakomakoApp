import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function usePushToken(user_id : any) {
  const [expoPushToken, setExpoPushToken] = useState<any>('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token ));
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('لم يتم السماح بالإشعارات!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('📱 Expo Push Token:', token);

    // 🔥 احفظ هذا التوكن في Supabase للمستخدم الحالي
     await supabase.from('user_tokens').insert({ user_id, token });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  }

  return expoPushToken;
}

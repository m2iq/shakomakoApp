import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarHeight = Platform.OS == 'ios' ? 68 : 88;
  const router = useRoute();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, false),
         tabBarLabelStyle: { 
            fontFamily: 'Tajawal',
            fontWeight : 'bold',
            marginBottom: -5,
            fontSize: 13,
            
          },
          tabBarStyle: {
            height: tabBarHeight,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: colorScheme === 'dark' ? Colors.dark.tabBarBgColor : Colors.light.tabBarBgColor,
            direction: 'rtl',
             borderColor: Colors.dark.tabBarBgColor,
          },
         
      }}>
        <Tabs.Screen
        name="home"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color , focused}) => <Ionicons size={20} name={focused ? "home" : "home-outline"} color={color} />,
        }}
      />
        <Tabs.Screen
        name="myfriends"
        options={{
          title: 'الأصدقاء',
          tabBarIcon: ({ color , focused}) => <Ionicons size={20} name={focused ? "people" : "people-outline"} color={color} />,
        }}
      />
      
       
      <Tabs.Screen
        name="index"
        options={{
          title: 'ايجي كليبس',
          tabBarIcon: ({ color , focused}) => <Ionicons name={focused ? "play" : "play-outline"}  size={20} color={color} />,
           tabBarActiveTintColor: Colors.dark.tint,
            tabBarStyle: { 
                backgroundColor: Colors.dark.tabBarBgColor ,
                height: tabBarHeight,
                paddingTop: 0,
                paddingBottom: 0,
                borderColor: Colors.dark.tabBarBgColor,
                direction: 'rtl',
             },
          
          
        }}
      />
       <Tabs.Screen
        name="inbox"
        options={{
          title: 'صندوق الوارد',
          tabBarIcon: ({ color , focused}) => <Ionicons size={20} name={focused ? "mail" : "mail-outline"} color={color} />,
          
        }}
  
        
      />
        <Tabs.Screen
        name="profile"
        options={{
          title: 'حسابي',
          tabBarIcon: ({ color , focused}) => <Ionicons size={20} name={focused ? "person" : "person-outline"} color={color} />,
        }}
      />
     
    </Tabs>
  );
}


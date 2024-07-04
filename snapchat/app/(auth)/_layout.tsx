import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
      
      <Tabs.Screen
        name="Register"
        options={{
          headerShown: false,
          title: 'Register',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-add-outline' : 'person-add-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          headerShown: false,
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-outline' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          href: null,
          title: 'Index',
        }}
      />
    </Tabs>
  );
}

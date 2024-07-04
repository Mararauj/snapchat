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
                name="ia"
                options={{
                    headerShown: false,
                    title: 'IA',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'logo-reddit' : 'logo-reddit'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    headerShown: false,
                    title: 'Messages',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'mail-outline' : 'mail-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    headerShown: false,
                    title: 'Snap',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'camera-outline' : 'camera-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="compte"
                options={{
                    headerShown: false,
                    title: 'Compte',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'people-outline' : 'people-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    headerShown: false,
                    title: 'Map',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'map-outline' : 'map-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="call"
                options={{
                    headerShown: false,
                    title: 'Live',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'videocam-outline' : 'videocam-outline'} color={color} />
                    ),
                }}
            />

        </Tabs>
    );

}

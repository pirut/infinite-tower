import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RunScreen from './src/screens/RunScreen';
import UpgradesScreen from './src/screens/UpgradesScreen';
import EventsScreen from './src/screens/EventsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardsScreen from './src/screens/LeaderboardsScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Run" component={RunScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="play" size={size} color={color} /> }} />
      <Tab.Screen name="Upgrades" component={UpgradesScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="construct" size={size} color={color} /> }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bonfire" size={size} color={color} /> }} />
      <Tab.Screen name="Leaderboards" component={LeaderboardsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const theme: Theme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: '#0b0e14' },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Root" component={Tabs} />
        </Stack.Navigator>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
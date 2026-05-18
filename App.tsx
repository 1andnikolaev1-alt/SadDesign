import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import NewProjectScreen from './src/screens/NewProjectScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import DesignResultScreen from './src/screens/DesignResultScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import CareCalendarScreen from './src/screens/CareCalendarScreen';
import CompatibilityScreen from './src/screens/CompatibilityScreen';
import PlantListScreen from './src/screens/PlantListScreen';

export type RootStackParamList = {
  Home: undefined;
  NewProject: undefined;
  Preferences: {
    photoUri: string | null;
    city: string;
    zone: number;
    plotWidth: number;
    plotLength: number;
    existingFeatures: string[];
  };
  DesignResult: {
    photoUri: string | null;
    city: string;
    zone: number;
    plotWidth: number;
    plotLength: number;
    existingFeatures: string[];
    style: string;
    budget: string;
    features: string[];
    careLevel: string;
    continuousBloom: boolean;
  };
  PlantDetail: { plantId: number };
  PlantList: { zone: number; category?: string };
  CareCalendar: { plantIds: number[] };
  Compatibility: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2E7D32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'СадДизайн' }}
        />
        <Stack.Screen
          name="NewProject"
          component={NewProjectScreen}
          options={{ title: 'Новый проект' }}
        />
        <Stack.Screen
          name="Preferences"
          component={PreferencesScreen}
          options={{ title: 'Пожелания' }}
        />
        <Stack.Screen
          name="DesignResult"
          component={DesignResultScreen}
          options={{ title: 'Дизайн участка' }}
        />
        <Stack.Screen
          name="PlantDetail"
          component={PlantDetailScreen}
          options={{ title: 'Растение' }}
        />
        <Stack.Screen
          name="PlantList"
          component={PlantListScreen}
          options={{ title: 'Каталог растений' }}
        />
        <Stack.Screen
          name="CareCalendar"
          component={CareCalendarScreen}
          options={{ title: 'Календарь ухода' }}
        />
        <Stack.Screen
          name="Compatibility"
          component={CompatibilityScreen}
          options={{ title: 'Совместимость' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

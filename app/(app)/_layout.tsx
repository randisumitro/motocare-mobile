import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/stores/theme';

export default function AppLayout() {
  const { colors, dark } = useTheme();

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, elevation: 0, shadowOpacity: 0 },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSub,
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="vehicles" 
        options={{ 
          title: 'Kendaraan',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="car-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'Riwayat',
          tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />
        }} 
      />
      {/* Hide other routes from tabs */}
      <Tabs.Screen name="maintenance" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="expenses" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="reminders" options={{ href: null }} />
      <Tabs.Screen name="statistics" options={{ href: null }} />
    </Tabs>
  );
}

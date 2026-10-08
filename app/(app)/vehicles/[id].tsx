import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVehicle } from '../../../src/api/vehicles';
import { LoadingState } from '../../../src/components/ui/LoadingState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { Card } from '../../../src/components/ui/Card';

export default function VehicleDetailScreen() {
  const { colors, dark } = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: vehicle, isLoading, isError, refetch } = useVehicle(id);
  const router = useRouter();

  if (isLoading) return <LoadingState />;
  if (isError || !vehicle) return <ErrorState onRetry={refetch} />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.headerCard}>
        <Text style={styles.brand}>{vehicle.brand} {vehicle.model}</Text>
        <Text style={styles.plate}>{vehicle.license_plate || 'Tanpa Plat'}</Text>
        <Text style={styles.odometer}>{vehicle.current_odometer.toLocaleString('id-ID')} km</Text>
      </Card>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push(`/(app)/maintenance?vehicleId=${id}`)}>
          <Text style={styles.menuText}>Jadwal Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push(`/(app)/expenses?vehicleId=${id}`)}>
          <Text style={styles.menuText}>Riwayat Pengeluaran</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  headerCard: { backgroundColor: '#2563eb', padding: 24, alignItems: 'center' },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  plate: { fontSize: 18, color: '#dbeafe', marginBottom: 12 },
  odometer: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  menuContainer: { marginTop: 24, gap: 12 },
  menuItem: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  menuText: { fontSize: 16, fontWeight: '500', color: '#111827' }
});

import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useRouter } from 'expo-router';
import { useVehicles } from '../../../src/api/vehicles';
import { Card } from '../../../src/components/ui/Card';
import { LoadingState } from '../../../src/components/ui/LoadingState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { EmptyState } from '../../../src/components/ui/EmptyState';

export default function VehiclesScreen() {
  const { colors, dark } = useTheme();

  const { data: apiVehicles, isLoading, isError, refetch } = useVehicles();
  const router = useRouter();

  const vehicles = apiVehicles || [
    { id: '1', brand: 'Honda', model: 'PCX 160', is_active: true, license_plate: 'B 1234 ABC', manufacture_year: 2021, current_odometer: 12500 },
    { id: '2', brand: 'Yamaha', model: 'NMAX', is_active: false, license_plate: 'D 5678 DEF', manufacture_year: 2020, current_odometer: 24000 }
  ];

  // if (isLoading) return <LoadingState />;
  // if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Daftar Kendaraan</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(app)/vehicles/${item.id}`)}>
            <Card style={[styles.card, item.is_active && styles.activeCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
                {item.is_active && <View style={styles.activeBadge}><Text style={styles.activeText}>Aktif</Text></View>}
              </View>
              <Text style={styles.details}>{item.license_plate} • {item.manufacture_year}</Text>
              <Text style={styles.odometer}>{item.current_odometer.toLocaleString('id-ID')} km</Text>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState 
            title="Tidak ada kendaraan" 
            description="Tambahkan kendaraan untuk mulai mencatat." 
          />
        }
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(app)/vehicles/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, color: '#111827' },
  list: { padding: 16, paddingTop: 0 },
  card: { padding: 16 },
  activeCard: { borderColor: '#2563eb', borderWidth: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicleName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  details: { color: '#6b7280', marginVertical: 4 },
  odometer: { fontWeight: '600', color: '#374151' },
  activeBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  activeText: { color: '#1d4ed8', fontSize: 12, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  fabText: { fontSize: 32, color: '#fff', fontWeight: '400', marginTop: -4 },
});

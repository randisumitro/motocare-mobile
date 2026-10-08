import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from '../../src/stores/theme';
import { useVehicles } from '../../src/api/vehicles';
import { useHistory } from '../../src/api/maintenance';
import { LoadingState } from '../../src/components/ui/LoadingState';
import { ErrorState } from '../../src/components/ui/ErrorState';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Card } from '../../src/components/ui/Card';

export default function HistoryScreen() {
  const { colors, dark } = useTheme();

  const { data: apiVehicles, isLoading: loadingVehicles } = useVehicles();
  const vehicles = apiVehicles || [{ id: '1', brand: 'Honda', model: 'PCX 160', is_active: true, current_odometer: 12500 }];
  const activeVehicle = vehicles?.find(v => v.is_active) || vehicles?.[0];

  const { data: apiHistory, isLoading: loadingHistory, isError, refetch } = useHistory(activeVehicle?.id || '');
  const history = apiHistory || [
    { id: '1', service_date: '2023-09-15', cost: 150000, workshop: 'AHASS Kebon Jeruk', odometer: 10000, notes: 'Ganti oli mesin dan busi' },
    { id: '2', service_date: '2023-08-01', cost: 250000, workshop: 'AHASS Palmerah', odometer: 8000, notes: 'Servis rutin dan cek CVT' }
  ];

  // if (loadingVehicles || loadingHistory) return <LoadingState />;
  // if (isError) return <ErrorState onRetry={refetch} />;

  if (!activeVehicle) {
    return <EmptyState title="Belum ada kendaraan" description="Tambahkan kendaraan terlebih dahulu" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
              <Text style={styles.date}>{item.service_date}</Text>
              <Text style={styles.cost}>Rp {item.cost.toLocaleString('id-ID')}</Text>
            </View>
            <Text style={styles.workshop}>{item.workshop}</Text>
            <Text style={styles.odometer}>Odo: {item.odometer.toLocaleString('id-ID')} km</Text>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Belum ada riwayat" description="Riwayat servis akan muncul di sini" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  card: { padding: 16, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  cost: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  workshop: { fontSize: 14, color: '#374151', fontWeight: '500' },
  odometer: { fontSize: 14, color: '#6b7280' },
  notes: { fontSize: 14, color: '#6b7280', fontStyle: 'italic', marginTop: 4 }
});

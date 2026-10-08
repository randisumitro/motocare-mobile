import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVehicles } from '../../../src/api/vehicles';
import { useExpenses } from '../../../src/api/expenses';
import { LoadingState } from '../../../src/components/ui/LoadingState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Card } from '../../../src/components/ui/Card';

export default function ExpensesScreen() {
  const { colors, dark } = useTheme();

  const router = useRouter();
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  
  const { data: apiVehicles, isLoading: loadingVehicles } = useVehicles();
  const vehicles = apiVehicles || [{ id: '1', brand: 'Honda', model: 'PCX 160', is_active: true, current_odometer: 12500 }];
  const activeVehicle = params.vehicleId 
    ? vehicles?.find(v => v.id === params.vehicleId) 
    : (vehicles?.find(v => v.is_active) || vehicles?.[0]);

  const { data: apiExpenses, isLoading: loadingExpenses, isError, refetch } = useExpenses(activeVehicle?.id || '');
  const expenses = apiExpenses || [
    { id: '1', category: 'maintenance', amount: 150000, date: '2023-09-15', notes: 'Ganti oli mesin' },
    { id: '2', category: 'fuel', amount: 50000, date: '2023-09-20', notes: 'Pertamax penuh' }
  ];

  // if (loadingVehicles || loadingExpenses) return <LoadingState />;
  // if (isError) return <ErrorState onRetry={refetch} />;

  if (!activeVehicle) {
    return <EmptyState title="Belum ada kendaraan" description="Tambahkan kendaraan terlebih dahulu" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
              <Text style={styles.category}>{item.category.toUpperCase()}</Text>
              <Text style={styles.amount}>Rp {item.amount.toLocaleString('id-ID')}</Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Belum ada pengeluaran" description="Catatan pengeluaran akan muncul di sini" />}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push(`/(app)/expenses/create?vehicleId=${activeVehicle.id}`)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  card: { padding: 16, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  date: { fontSize: 14, color: '#6b7280' },
  notes: { fontSize: 14, color: '#374151', fontStyle: 'italic', marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  fabText: { fontSize: 32, color: '#fff', fontWeight: '400', marginTop: -4 },
});

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMaintenanceList } from '../../../src/api/maintenance';
import { LoadingState } from '../../../src/components/ui/LoadingState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Card } from '../../../src/components/ui/Card';

export default function MaintenanceScreen() {
  const { colors, dark } = useTheme();

  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { data: apiMaintenance, isLoading, isError, refetch } = useMaintenanceList(vehicleId || '');
  
  const maintenance = apiMaintenance || [
    { id: '1', name: 'Ganti Oli Mesin', status: 'due_soon', last_service_date: '2023-09-15', last_service_odometer: 10000, next_due_date: '2023-10-15', next_due_odometer: 12000 },
    { id: '2', name: 'Servis CVT', status: 'normal', last_service_date: '2023-08-01', last_service_odometer: 8000, next_due_date: '2024-02-01', next_due_odometer: 16000 }
  ];

  // if (isLoading) return <LoadingState />;
  // if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={maintenance}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(app)/maintenance/${item.id}?vehicleId=${vehicleId}`)}>
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.header}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <View style={[styles.badge, styles[`badge_${item.status}` as keyof typeof styles] as any]}>
                  <Text style={[styles.badgeText, styles[`badgeText_${item.status}` as keyof typeof styles] as any]}>
                    {item.status.toUpperCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.detail}>Terakhir: {item.last_service_date || '-'} ({item.last_service_odometer ? `${item.last_service_odometer} km` : '-'})</Text>
              <Text style={styles.detail}>Berikutnya: {item.next_due_date || '-'} ({item.next_due_odometer ? `${item.next_due_odometer} km` : '-'})</Text>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState title="Belum ada data" description="Jadwal maintenance belum tersedia." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  card: { padding: 16, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  detail: { fontSize: 14, color: '#6b7280' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badge_normal: { backgroundColor: '#dcfce7' },
  badge_due_soon: { backgroundColor: '#fef9c3' },
  badge_due: { backgroundColor: '#ffedd5' },
  badge_overdue: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  badgeText_normal: { color: '#166534' },
  badgeText_due_soon: { color: '#854d0e' },
  badgeText_due: { color: '#9a3412' },
  badgeText_overdue: { color: '#991b1b' },
});

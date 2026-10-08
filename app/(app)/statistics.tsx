import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/stores/theme';
import { Card } from '../../src/components/ui/Card';

export default function StatisticsScreen() {
  const { colors, dark } = useTheme();

  // Dummy data for statistics UI
  const stats = {
    totalExpenses: 850000,
    averageMonthly: 145000,
    topCategory: 'Bahan Bakar',
    odometerMonthlyAvg: 450
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Statistik Kendaraan</Text>
      
      <Card style={styles.highlightCard}>
        <Text style={styles.highlightLabel}>Total Pengeluaran (Tahun ini)</Text>
        <Text style={styles.highlightValue}>Rp {stats.totalExpenses.toLocaleString('id-ID')}</Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>Rata-rata Bulanan</Text>
          <Text style={styles.gridValue}>Rp {stats.averageMonthly.toLocaleString('id-ID')}</Text>
        </Card>
        <Card style={styles.gridCard}>
          <Text style={styles.gridLabel}>Pengeluaran Terbesar</Text>
          <Text style={styles.gridValue}>{stats.topCategory}</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Penggunaan Motor</Text>
      <Card>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Rata-rata Jarak/Bulan</Text>
          <Text style={styles.rowValue}>{stats.odometerMonthlyAvg} km</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimasi Ganti Oli Berikutnya</Text>
          <Text style={styles.rowValue}>~14 Hari lagi</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  highlightCard: { backgroundColor: '#2563eb', marginBottom: 16 },
  highlightLabel: { color: '#dbeafe', fontSize: 14 },
  highlightValue: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  gridCard: { flex: 1 },
  gridLabel: { color: '#6b7280', fontSize: 12 },
  gridValue: { color: '#111827', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  rowLabel: { color: '#4b5563', fontSize: 14 },
  rowValue: { color: '#111827', fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#e5e7eb' }
});

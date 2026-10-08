import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../src/stores/theme';
import { Card } from '../../src/components/ui/Card';

export default function RemindersScreen() {
  const { colors, dark } = useTheme();

  // Dummy reminders data
  const reminders = [
    { id: '1', title: 'Perpanjang STNK', date: '2023-11-20', type: 'Pajak', status: 'upcoming' },
    { id: '2', title: 'Ganti Oli Gardan', date: '2023-10-15', type: 'Maintenance', status: 'due_soon' },
    { id: '3', title: 'Cek Tekanan Ban', date: 'Hari ini', type: 'Rutin', status: 'due' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Pengingat</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
              </View>
              <View style={[styles.badge, styles[`badge_${item.status}` as keyof typeof styles] as any]}>
                <Text style={[styles.badgeText, styles[`badgeText_${item.status}` as keyof typeof styles] as any]}>
                  {item.date}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  itemType: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badge_upcoming: { backgroundColor: '#f3f4f6' },
  badge_due_soon: { backgroundColor: '#fef9c3' },
  badge_due: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  badgeText_upcoming: { color: '#4b5563' },
  badgeText_due_soon: { color: '#854d0e' },
  badgeText_due: { color: '#991b1b' }
});

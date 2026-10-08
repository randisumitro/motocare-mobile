import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreateExpense } from '../../../src/api/expenses';
import { handleApiError } from '../../../src/api/client';

export default function CreateExpenseScreen() {
  const { colors, dark } = useTheme();

  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  
  const { mutateAsync: createExpense, isPending } = useCreateExpense();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'fuel' | 'tax' | 'insurance' | 'parking' | 'wash' | 'other'>('fuel');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!date || !amount) {
      Alert.alert('Error', 'Tanggal dan Jumlah wajib diisi');
      return;
    }

    try {
      await createExpense({
        vehicle_id: vehicleId,
        date,
        amount: parseInt(amount, 10),
        category,
        notes
      });
      router.back();
    } catch (error) {
      Alert.alert('Gagal', handleApiError(error));
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Tambah Pengeluaran</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tanggal (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} placeholder="2023-10-25" value={date} onChangeText={setDate} />

          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categoryContainer}>
            {['fuel', 'tax', 'insurance', 'parking', 'wash', 'other'].map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.categoryBadge, category === cat && styles.categoryBadgeActive]}
                onPress={() => setCategory(cat as any)}
              >
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Jumlah (Rp)</Text>
          <TextInput style={styles.input} placeholder="50000" value={amount} onChangeText={setAmount} keyboardType="numeric" />

          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Isi bensin full tank" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

          <TouchableOpacity style={[styles.button, isPending && styles.buttonDisabled]} onPress={handleSave} disabled={isPending}>
            {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Simpan</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#111827' },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: -8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e5e7eb' },
  categoryBadgeActive: { backgroundColor: '#2563eb' },
  categoryText: { fontSize: 12, color: '#374151', fontWeight: 'bold' },
  categoryTextActive: { color: '#fff' }
});

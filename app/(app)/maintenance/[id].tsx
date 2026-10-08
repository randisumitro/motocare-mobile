import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMaintenanceDetail, useRecordService } from '../../../src/api/maintenance';
import { handleApiError } from '../../../src/api/client';
import { LoadingState } from '../../../src/components/ui/LoadingState';

export default function RecordServiceScreen() {
  const { colors, dark } = useTheme();

  const { id, vehicleId } = useLocalSearchParams<{ id: string, vehicleId: string }>();
  const router = useRouter();
  
  const { data: maintenance, isLoading: loadingDetail } = useMaintenanceDetail(id);
  const { mutateAsync: recordService, isPending } = useRecordService();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [workshop, setWorkshop] = useState('');
  const [notes, setNotes] = useState('');

  if (loadingDetail) return <LoadingState />;

  const handleSave = async () => {
    if (!date || !odometer || !cost) {
      Alert.alert('Error', 'Tanggal, Odometer, dan Biaya wajib diisi');
      return;
    }

    try {
      await recordService({
        maintenance_id: id,
        vehicle_id: vehicleId,
        service_date: date,
        odometer: parseInt(odometer, 10),
        cost: parseInt(cost, 10),
        workshop,
        notes
      });
      Alert.alert('Sukses', 'Servis berhasil dicatat', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Gagal', handleApiError(error));
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Catat Servis: {maintenance?.name}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tanggal Servis (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} placeholder="2023-10-25" value={date} onChangeText={setDate} />

          <Text style={styles.label}>Odometer (km)</Text>
          <TextInput style={styles.input} placeholder="15000" value={odometer} onChangeText={setOdometer} keyboardType="numeric" />

          <Text style={styles.label}>Biaya (Rp)</Text>
          <TextInput style={styles.input} placeholder="150000" value={cost} onChangeText={setCost} keyboardType="numeric" />

          <Text style={styles.label}>Bengkel</Text>
          <TextInput style={styles.input} placeholder="AHASS Motor" value={workshop} onChangeText={setWorkshop} />

          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ganti oli mesin dan gardan" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, color: '#111827' },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: -8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

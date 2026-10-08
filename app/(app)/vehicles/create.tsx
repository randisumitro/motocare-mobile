import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../../src/stores/theme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCreateVehicle } from '../../../src/api/vehicles';
import { handleApiError } from '../../../src/api/client';

export default function CreateVehicleScreen() {
  const { colors, dark } = useTheme();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [nickname, setNickname] = useState('');
  const [year, setYear] = useState('');
  const [odometer, setOdometer] = useState('');
  const [plate, setPlate] = useState('');
  
  const router = useRouter();
  const { mutateAsync: createVehicle, isPending } = useCreateVehicle();

  const handleSave = async () => {
    if (!brand || !model || !year || !odometer) {
      Alert.alert('Error', 'Brand, Model, Tahun, dan Odometer wajib diisi');
      return;
    }

    try {
      await createVehicle({
        brand,
        model,
        nickname,
        manufacture_year: parseInt(year, 10),
        current_odometer: parseInt(odometer, 10),
        license_plate: plate,
        is_active: true
      });
      router.back();
    } catch (error) {
      Alert.alert('Gagal', handleApiError(error));
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Tambah Kendaraan</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Brand (Merek)</Text>
          <TextInput style={styles.input} placeholder="Honda" value={brand} onChangeText={setBrand} />

          <Text style={styles.label}>Model</Text>
          <TextInput style={styles.input} placeholder="Beat FI" value={model} onChangeText={setModel} />

          <Text style={styles.label}>Nama Panggilan (Opsional)</Text>
          <TextInput style={styles.input} placeholder="Motor Kesayangan" value={nickname} onChangeText={setNickname} />

          <Text style={styles.label}>Tahun Pembuatan</Text>
          <TextInput style={styles.input} placeholder="2020" value={year} onChangeText={setYear} keyboardType="numeric" />

          <Text style={styles.label}>Odometer Saat Ini (km)</Text>
          <TextInput style={styles.input} placeholder="12500" value={odometer} onChangeText={setOdometer} keyboardType="numeric" />

          <Text style={styles.label}>Plat Nomor (Opsional)</Text>
          <TextInput style={styles.input} placeholder="B 1234 ABC" value={plate} onChangeText={setPlate} autoCapitalize="characters" />

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
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

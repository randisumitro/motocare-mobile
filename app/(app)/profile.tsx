import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../src/stores/theme';
import { useState } from 'react';
import { useAuthStore } from '../../src/stores/auth';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../src/stores/theme';

export default function ProfileScreen() {
  const { colors, dark } = useTheme();

  const logout = useAuthStore(state => state.logout);
  const [selectedRingtone, setSelectedRingtone] = useState<string>('Beep');
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const setDarkMode = useThemeStore(state => state.setDarkMode);
  const [pushEnabled, setPushEnabled] = useState(true);

  const ringtones = [
    { name: 'Beep', url: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
    { name: 'Digital', url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
    { name: 'Splash', url: 'https://actions.google.com/sounds/v1/water/glass_water_pour.ogg' },
  ];

  async function playSound(url: string, name: string) {
    setSelectedRingtone(name);
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout }
    ]);
  };

  const SettingRow = ({ icon, title, value, onPress, isSwitch, switchValue, onSwitchChange, isLast }: any) => (
    <TouchableOpacity 
      style={[styles.settingRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]} 
      onPress={onPress} 
      disabled={isSwitch || !onPress}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: dark ? '#2C2C2E' : '#F2F2F7' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.settingRowRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textSub }]}>{value}</Text>}
        {isSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange}
            trackColor={{ false: dark ? '#38383A' : '#E5E5EA', true: colors.primary }}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSub} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={{ padding: 24, paddingTop: 80, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>RS</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>Randi Sumitro</Text>
        <Text style={[styles.email, { color: colors.textSub }]}>randi@motocare.id</Text>
        <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: dark ? '#2C2C2E' : '#E5E5EA' }]} onPress={() => Alert.alert('Edit Profil', 'Fitur edit profil akan tersedia pada pembaruan berikutnya!')}>
          <Text style={[styles.editProfileText, { color: colors.text }]}>Edit Profil</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSub }]}>PREFERENSI</Text>
      <View style={[styles.glassCard, { backgroundColor: colors.card }]}>
        <SettingRow 
          icon="moon" 
          title="Mode Gelap" 
          isSwitch 
          switchValue={isDarkMode} 
          onSwitchChange={setDarkMode} 
        />
        <SettingRow 
          icon="notifications" 
          title="Notifikasi Push" 
          isSwitch 
          switchValue={pushEnabled} 
          onSwitchChange={setPushEnabled} 
        />
        <SettingRow 
          icon="language" 
          title="Bahasa" 
          value="Indonesia" 
          isLast
          onPress={() => Alert.alert('Bahasa', 'Saat ini hanya tersedia Bahasa Indonesia.')} 
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSub }]}>NADA DERING</Text>
      <View style={[styles.glassCard, { backgroundColor: colors.card, padding: 0 }]}>
        {ringtones.map((item, index) => (
          <View key={item.name}>
            <TouchableOpacity 
              style={[styles.ringtoneItem, selectedRingtone === item.name && { backgroundColor: dark ? '#2C2C2E' : '#F9F9FF' }, index === 0 && { borderTopLeftRadius: 20, borderTopRightRadius: 20 }, index === ringtones.length - 1 && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}
              onPress={() => playSound(item.url, item.name)}
            >
              <View style={styles.settingRowLeft}>
                <Ionicons 
                  name="musical-note" 
                  size={20} 
                  color={selectedRingtone === item.name ? colors.primary : colors.textSub} 
                />
                <Text style={[styles.ringtoneText, { color: colors.text }, selectedRingtone === item.name && { color: colors.primary, fontWeight: '700' }]}>
                  {item.name}
                </Text>
              </View>
              {selectedRingtone === item.name && <Ionicons name="checkmark" size={24} color={colors.primary} />}
            </TouchableOpacity>
            {index < ringtones.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSub }]}>INFORMASI</Text>
      <View style={[styles.glassCard, { backgroundColor: colors.card }]}>
        <SettingRow 
          icon="document-text" 
          title="Syarat & Ketentuan" 
          onPress={() => Alert.alert('Syarat & Ketentuan', 'Dengan menggunakan aplikasi ini Anda setuju dengan seluruh syarat kami.')} 
        />
        <SettingRow 
          icon="shield-checkmark" 
          title="Kebijakan Privasi" 
          onPress={() => Alert.alert('Kebijakan Privasi', 'Data riwayat servis dan kendaraan Anda disimpan secara aman.')} 
        />
        <SettingRow 
          icon="help-circle" 
          title="Bantuan & Dukungan" 
          onPress={() => Alert.alert('Bantuan', 'Hubungi WhatsApp 0812-3456-7890.')} 
        />
        <SettingRow 
          icon="information-circle" 
          title="Versi Aplikasi" 
          value="v1.0.0 (Beta)" 
          isLast
          onPress={() => Alert.alert('MotoCare', 'Versi 1.0.0 (Beta)')} 
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar dari Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginVertical: 32 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#FFF' },
  name: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  email: { fontSize: 16, fontWeight: '500', marginBottom: 20 },
  editProfileButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  editProfileText: { fontWeight: '700', fontSize: 15 },
  
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 16, marginTop: 16 },
  
  glassCard: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden'
  },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconContainer: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingTitle: { fontSize: 17, fontWeight: '500' },
  settingRowRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingValue: { fontSize: 15, fontWeight: '400' },
  
  ringtoneItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  ringtoneText: { fontSize: 17, fontWeight: '500' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },
  
  logoutButton: { backgroundColor: '#FF3B3015', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutText: { color: '#FF3B30', fontSize: 17, fontWeight: '700' }
});

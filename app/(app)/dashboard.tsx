import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { useTheme } from '../../src/stores/theme';
import { useRouter } from 'expo-router';
import { useDashboard, useVehicles } from '../../src/api/vehicles';
import { useAuthStore } from '../../src/stores/auth';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { colors, dark } = useTheme();

  const router = useRouter();
  const { data: apiVehicles, isLoading: loadingVehicles } = useVehicles();
  const { data: apiDashboard, isLoading: loadingDashboard, refetch } = useDashboard(apiVehicles?.[0]?.id);
  
  const vehicles = apiVehicles || [{ id: '1', brand: 'Honda', model: 'PCX 160', is_active: true, current_odometer: 12500, plate: 'B 1234 XYZ' }];
  const activeVehicle = vehicles?.find(v => v.is_active) || vehicles?.[0];
  
  const dashboard = apiDashboard || {
    maintenance: [
      { id: '1', name: 'Ganti Oli Mesin', status: 'due_soon' },
      { id: '2', name: 'Servis CVT', status: 'normal' }
    ],
    recent_service: { name: 'Ganti Kampas Rem', service_date: '15 September 2023', shop: 'AHASS Kebayoran' }
  };

  const statusColors = {
    normal: { bg: dark ? '#166534' : '#DCFCE7', text: dark ? '#4ADE80' : '#166534', dot: '#22C55E' },
    due_soon: { bg: dark ? '#854D0E' : '#FEF9C3', text: dark ? '#FDE047' : '#854D0E', dot: '#EAB308' },
    due: { bg: dark ? '#9A3412' : '#FFEDD5', text: dark ? '#FDBA74' : '#9A3412', dot: '#F97316' },
    overdue: { bg: dark ? '#7F1D1D' : '#FEE2E2', text: dark ? '#FCA5A5' : '#991B1B', dot: '#EF4444' },
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: 'transparent' }]}
      contentContainerStyle={{ padding: 24, paddingTop: 80, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.date, { color: colors.textSub }]}>HARI INI</Text>
          <Text style={[styles.greeting, { color: colors.text }]}>Halo, Randi</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RS</Text>
        </View>
      </View>

      {/* Premium Inverted Vehicle Card */}
      <View style={[styles.premiumCard, { backgroundColor: colors.cardInverted }]}>
        <View style={styles.premiumCardTop}>
          <View>
            <Text style={[styles.vehicleBrand, { color: colors.textSubInverted }]}>{activeVehicle.brand.toUpperCase()}</Text>
            <Text style={[styles.vehicleModel, { color: colors.textInverted }]}>{activeVehicle.model}</Text>
          </View>
          <Ionicons name="car-sport" size={40} color={colors.textSubInverted} style={{ opacity: 0.3 }} />
        </View>
        
        <View style={styles.premiumCardBottom}>
          <View>
            <Text style={[styles.vehicleLabel, { color: colors.textSubInverted }]}>Odometer</Text>
            <Text style={[styles.vehicleValue, { color: colors.textInverted }]}>{activeVehicle.current_odometer.toLocaleString('id-ID')} <Text style={{fontSize: 16, fontWeight: '500'}}>km</Text></Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.vehicleLabel, { color: colors.textSubInverted }]}>Plat Nomor</Text>
            <Text style={[styles.vehicleValue, { color: colors.textInverted }]}>{activeVehicle.plate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Status Perawatan</Text>
      </View>
      
      <View style={[styles.glassCard, { backgroundColor: colors.card }]}>
        {dashboard?.maintenance?.length ? (
          dashboard.maintenance.map((m: any, index: number) => {
            const theme = statusColors[m.status as keyof typeof statusColors];
            return (
              <View key={m.id} style={[styles.maintenanceRow, index === dashboard.maintenance.length - 1 && { borderBottomWidth: 0, borderColor: colors.border }]}>
                <View style={styles.maintenanceRowLeft}>
                  <View style={[styles.statusDot, { backgroundColor: theme.dot }]} />
                  <Text style={[styles.maintenanceName, { color: colors.text }]}>{m.name}</Text>
                </View>
                <View style={[styles.pillBadge, { backgroundColor: theme.bg }]}>
                  <Text style={[styles.pillText, { color: theme.text }]}>
                    {m.status.toUpperCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSub }]}>Semua normal</Text>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Servis Terakhir</Text>
        <Text style={[styles.sectionLink, { color: colors.primary }]}>Lihat Semua</Text>
      </View>

      <View style={[styles.glassCard, { backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center' }]}>
        {dashboard?.recent_service ? (
          <>
            <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
              <Ionicons name="construct" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.historyName, { color: colors.text }]}>{dashboard.recent_service.name}</Text>
              <Text style={[styles.historyDate, { color: colors.textSub }]}>{dashboard.recent_service.service_date} • {dashboard.recent_service.shop}</Text>
            </View>
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSub }]}>Belum ada riwayat servis</Text>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  date: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  greeting: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  premiumCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  premiumCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  vehicleBrand: { fontSize: 14, fontWeight: '600', letterSpacing: 2, marginBottom: 4 },
  vehicleModel: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  
  premiumCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  vehicleLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  vehicleValue: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  sectionLink: { fontSize: 15, fontWeight: '600' },
  
  glassCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  
  maintenanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  maintenanceRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  maintenanceName: { fontSize: 17, fontWeight: '600' },
  
  pillBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  pillText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  
  iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  historyName: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  historyDate: { fontSize: 14, fontWeight: '400' },
  
  emptyText: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginVertical: 12 },
});

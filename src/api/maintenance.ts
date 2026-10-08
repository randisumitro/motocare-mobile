import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Maintenance {
  id: string;
  vehicle_id: string;
  name: string;
  status: 'normal' | 'due_soon' | 'due' | 'overdue';
  next_due_date?: string;
  next_due_odometer?: number;
  last_service_date?: string;
  last_service_odometer?: number;
  progress_percentage?: number;
}

export interface ServiceRecord {
  id: string;
  maintenance_id: string;
  vehicle_id: string;
  service_date: string;
  odometer: number;
  cost: number;
  workshop: string;
  notes: string;
}

export const useMaintenanceList = (vehicleId: string) => {
  return useQuery({
    queryKey: ['maintenance', vehicleId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Maintenance[] }>(`/vehicles/${vehicleId}/maintenance`);
      return data.data;
    },
    enabled: !!vehicleId
  });
};

export const useMaintenanceDetail = (id: string) => {
  return useQuery({
    queryKey: ['maintenance_detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Maintenance }>(`/maintenance/${id}`);
      return data.data;
    },
    enabled: !!id
  });
};

export const useRecordService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ServiceRecord>) => {
      const { data } = await apiClient.post(`/maintenance/${payload.maintenance_id}/service`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
};

export const useHistory = (vehicleId: string) => {
  return useQuery({
    queryKey: ['history', vehicleId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: ServiceRecord[] }>(`/vehicles/${vehicleId}/history`);
      return data.data;
    },
    enabled: !!vehicleId
  });
};

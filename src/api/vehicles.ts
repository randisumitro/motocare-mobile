import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  nickname: string;
  manufacture_year: number;
  current_odometer: number;
  license_plate: string;
  is_active: boolean;
}

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Vehicle[] }>('/vehicles');
      return data.data;
    }
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Vehicle }>(`/vehicles/${id}`);
      return data.data;
    },
    enabled: !!id
  });
};

export const useDashboard = (vehicleId?: string) => {
  return useQuery({
    queryKey: ['dashboard', vehicleId],
    queryFn: async () => {
      const url = vehicleId ? `/vehicles/${vehicleId}/dashboard` : '/dashboard';
      const { data } = await apiClient.get(url);
      return data.data;
    }
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Vehicle>) => {
      const { data } = await apiClient.post('/vehicles', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
};

export const useUpdateOdometer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, odometer }: { id: string, odometer: number }) => {
      const { data } = await apiClient.post(`/vehicles/${id}/odometer`, { odometer });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    }
  });
};

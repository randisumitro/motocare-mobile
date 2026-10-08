import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Expense {
  id: string;
  vehicle_id: string;
  category: 'maintenance' | 'fuel' | 'tax' | 'insurance' | 'parking' | 'wash' | 'other';
  amount: number;
  date: string;
  notes: string;
}

export const useExpenses = (vehicleId: string) => {
  return useQuery({
    queryKey: ['expenses', vehicleId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Expense[] }>(`/vehicles/${vehicleId}/expenses`);
      return data.data;
    },
    enabled: !!vehicleId
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Expense>) => {
      const { data } = await apiClient.post(`/vehicles/${payload.vehicle_id}/expenses`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

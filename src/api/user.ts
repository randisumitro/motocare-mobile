import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  distance_unit: 'km' | 'mi';
  notifications_enabled: boolean;
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: User }>('/user');
      return data.data;
    }
  });
};

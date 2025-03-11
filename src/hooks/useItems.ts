import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../services/itemsApi';
import { CreateItemDTO, UpdateQuantityDTO, UpdatePriceDTO } from '../types/inventory';

export const useItems = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: itemsApi.getAll,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createItem = useMutation({
    mutationFn: (newItem: CreateItemDTO) => itemsApi.create(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const updateQuantity = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateQuantityDTO }) => 
      itemsApi.updateQuantity(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const updatePrice = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePriceDTO }) => 
      itemsApi.updatePrice(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  return {
    items,
    isLoading,
    error,
    createItem,
    updateQuantity,
    updatePrice,
    deleteItem
  };
}; 
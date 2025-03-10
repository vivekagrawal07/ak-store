import axios from 'axios';
import { Item, CreateItemDTO, UpdateQuantityDTO, UpdatePriceDTO } from '../types/inventory';

const api = axios.create({
  baseURL: 'https://server-git-main-vivek-agrawal-projects.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const itemsApi = {
  // Get all items
  getAll: async () => {
    const { data } = await api.get<Item[]>('/items');
    return data;
  },

  // Get single item
  getById: async (id: number) => {
    const { data } = await api.get<Item>(`/items/${id}`);
    return data;
  },

  // Create new item
  create: async (item: CreateItemDTO) => {
    const { data } = await api.post<Item>('/items', item);
    return data;
  },

  // Update quantity
  updateQuantity: async (id: number, dto: UpdateQuantityDTO) => {
    await api.patch(`/items/${id}/quantity`, dto);
  },

  // Update price
  updatePrice: async (id: number, dto: UpdatePriceDTO) => {
    await api.patch(`/items/${id}/price`, dto);
  }
}; 
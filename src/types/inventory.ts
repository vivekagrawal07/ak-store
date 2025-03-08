export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Category {
  id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  created_at?: Date;
} 
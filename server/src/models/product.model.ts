export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
} 
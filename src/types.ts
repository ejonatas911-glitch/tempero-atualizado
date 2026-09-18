export interface Dish {
  id: string;
  name: string;
  description: string;
  category: 'carnes' | 'peixes' | 'frango';
  price: number;
  image: string;
  isFeatured?: boolean;
}

export interface Drink {
  id: string;
  name: string;
  type: 'juice' | 'soda';
  image: string;
  isFeatured?: boolean;
  prices: {
    [sizeName: string]: number; // e.g., "300ml": 7.00, "Lata": 6.00
  };
}

export type OrderItemType = 'dish' | 'drink';

export interface MarmitaSelections {
  carne: string;
  arroz: string;
  feijao: string;
  macarrao: string;
  farofa: string;
  salada: string;
  pure: string;
  tamanho: string;
}

export interface CartItem {
  id: string; // unique cart item id (combines selection + modifiers)
  itemId: string;
  name: string;
  type: OrderItemType;
  price: number; // base price (with option)
  quantity: number;
  // Dish customisation
  removedAccompaniments?: string[];
  marmitaSelections?: MarmitaSelections;
  // Drink customisation
  selectedSize?: string;
  observations?: string;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  method: 'delivery' | 'pickup';
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  reference?: string;
  paymentMethod: 'pix' | 'credit' | 'debit' | 'cash';
  cashChangeFor?: string;
}

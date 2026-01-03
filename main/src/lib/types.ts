
export interface Product {
  id: string;
  title: string;
  description: string;
  price_inr: number;
  discounted_price_inr: number;
  type: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

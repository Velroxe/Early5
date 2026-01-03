export interface Admin {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price_inr: number;
  discounted_price_inr?: number;
  type: string;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

// export interface Order {
//   id: string;
//   product_id: string;
//   buyer_name: string;
//   buyer_address: string;
//   buyer_phone: string;
//   buyer_email?: string | null;
//   quantity: number;
//   created_at?: string;
//   updated_at?: string;

//   // extra fields returned from backend
//   product_title?: string;
//   price_inr?: number;
//   discounted_price_inr?: number | null;
// }

export interface OrderItem {
  product_id: string;
  product_title: string;
  quantity: number;
  price_inr: number;
  discounted_price_inr?: number | null;
}

export interface Order {
  id: string;

  buyer_name: string;
  buyer_address: string;
  buyer_phone: string;
  buyer_email?: string | null;

  payment_status: "unpaid" | "paid" | "refunded";
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  created_at: string;
  updated_at: string;

  items: OrderItem[];
}

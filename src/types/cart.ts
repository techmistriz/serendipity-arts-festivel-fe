export interface CartProgramme {
  id: number;
  name: string;
  amount: string | null;
  parent_id: number;
  program_type: string;
  is_booking_allowed: number;
}

export interface ApiCartItem {
  id: number;
  program_id: number;
  program_detail_id: number;
  amount: string;
  quantity: number;
  status: number;
  program: CartProgramme;
}

export interface CartSummary {
  item_count: number;
  quantity: number;
  subtotal: string;
}

export interface CartResponse {
  items: ApiCartItem[];
  summary: CartSummary;
}

export interface AddToCartPayload {
  program_id: number;
  program_detail_id: number;
  qty: number;
  check_clashing?: boolean;
}

export interface UpdateCartPayload {
  qty: number;
  check_clashing?: boolean;
}

export interface CartItemInput {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  img: string;
}

export interface CartItem extends CartItemInput {
  qty: number;
}

export interface CartState {
  items: CartItem[];
  bookings: CartItem[];
  isVip: boolean;
}

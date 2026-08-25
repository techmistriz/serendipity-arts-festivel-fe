export interface Program {
  id: number;
  name: string;
  amount: string | null;
  parent_id: number;
  program_type: string;
  is_booking_allowed: number;
}

export interface CartItem {
  id: number;
  program_id: number;
  program_detail_id: number;
  amount: string;
  quantity: number;
  status: number;
  program: Program;
}

export interface CartSummary {
  item_count: number;
  quantity: number;
  subtotal: string;
}

export interface CartResponse {
  items: CartItem[];
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

export interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;
}

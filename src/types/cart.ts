export interface CartItemInput {
  programmeId: number;
  programmeDetailId: number;
  quantity: number;
  checkClashing?: boolean;
}

export interface CartItem {
  id: string;
  programmeId: number;
  programmeDetailId: number;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  img: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  bookings: CartItem[];
  loading: boolean;
  error: string | null;
  synced: boolean;
}

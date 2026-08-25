import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WishlistState, WishlistItem } from "@/types/wishlist";

import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist.service";

const initialState: WishlistState = {
  programmeIds: [],
  items: [],
  loading: false,
  error: null,
  synced: false,
};

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await getWishlist();

    return {
      programmeIds: response.programmeIds ?? [],
      items: response.data ?? [],
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch wishlist");
  }
});

export const addToWishlistThunk = createAsyncThunk(
  "wishlist/add",
  async (programId: string | number, { rejectWithValue }) => {
    try {
      const response = await addToWishlist(programId);

      if (!response.status) {
        return rejectWithValue(response.message ?? "Failed to add to wishlist");
      }

      return {
        programId: String(programId),
        item: response.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to add to wishlist");
    }
  },
);

export const removeFromWishlistThunk = createAsyncThunk(
  "wishlist/remove",
  async (
    {
      programId,
      wishlistId,
    }: {
      programId: string | number;
      wishlistId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await removeFromWishlist(wishlistId, programId);

      if (!response.status) {
        return rejectWithValue(response.message ?? "Failed to remove from wishlist");
      }

      return String(programId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to remove from wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlist: (state) => {
      state.programmeIds = [];
      state.items = [];
      state.loading = false;
      state.error = null;
      state.synced = false;
    },

    resetWishlistError: (state) => {
      state.error = null;
    },

    setWishlist: (
      state,
      action: PayloadAction<{
        programmeIds: string[];
        items: WishlistItem[];
      }>,
    ) => {
      state.programmeIds = action.payload.programmeIds;
      state.items = action.payload.items;
      state.synced = true;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.programmeIds = action.payload.programmeIds;
        state.items = action.payload.items;
        state.synced = true;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch wishlist";
      })

      // ADD
      .addCase(addToWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;

        const { programId, item } = action.payload;

        if (!state.programmeIds.includes(programId)) {
          state.programmeIds.push(programId);
        }

        if (item && !state.items.some((wishlistItem) => wishlistItem.id === item.id)) {
          state.items.push(item);
        }

        state.synced = true;
      })

      .addCase(addToWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to add to wishlist";
      })

      // REMOVE
      .addCase(removeFromWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;

        const programId = action.payload;

        state.programmeIds = state.programmeIds.filter((id) => id !== programId);

        state.items = state.items.filter((item) => String(item.program_id) !== programId);

        state.synced = true;
      })

      .addCase(removeFromWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to remove from wishlist";
      });
  },
});

export const { clearWishlist, resetWishlistError, setWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

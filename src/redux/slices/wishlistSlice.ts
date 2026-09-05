import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WishlistProgramme, WishlistState } from "@/types/wishlist";

const initialState: WishlistState = {
  programmeIds: [],
  programmes: [],
  loading: false,
  error: null,
  synced: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlist: (state) => {
      state.programmeIds = [];
      state.programmes = [];
      state.loading = false;
      state.error = null;
      state.synced = false;
    },

    resetWishlistError: (state) => {
      state.error = null;
    },

    requestWishlist: (state) => {
      state.loading = true;
      state.error = null;
    },

    setWishlist: (state, action: PayloadAction<WishlistProgramme[]>) => {
      const programmesById = new Map<string, WishlistProgramme>();

      action.payload.forEach((programme) => {
        if (programme.programmeId) {
          programmesById.set(String(programme.programmeId), programme);
        }
      });

      state.programmeIds = [...programmesById.keys()];
      state.programmes = [...programmesById.values()];
      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    addWishlistProgramme: (state, action: PayloadAction<WishlistProgramme>) => {
      const programmeId = String(action.payload.programmeId);
      const existingIndex = state.programmes.findIndex(
        (programme) => programme.programmeId === programmeId,
      );

      if (!state.programmeIds.includes(programmeId)) {
        state.programmeIds.push(programmeId);
      }

      if (existingIndex === -1) {
        state.programmes.push({ ...action.payload, programmeId });
      } else {
        state.programmes[existingIndex] = { ...action.payload, programmeId };
      }

      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    removeWishlistProgramme: (state, action: PayloadAction<string | number>) => {
      const programmeId = String(action.payload);

      state.programmeIds = state.programmeIds.filter((id) => id !== programmeId);
      state.programmes = state.programmes.filter(
        (programme) => programme.programmeId !== programmeId,
      );
      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    wishlistRequestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  clearWishlist,
  resetWishlistError,
  requestWishlist,
  setWishlist,
  addWishlistProgramme,
  removeWishlistProgramme,
  wishlistRequestFailed,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

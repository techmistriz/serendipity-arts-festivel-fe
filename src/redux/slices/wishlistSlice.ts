import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { WishlistState } from "@/types/wishlist";

const initialState: WishlistState = {
  programmeIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistProgramme: (state, action: PayloadAction<string>) => {
      const programmeId = action.payload;

      state.programmeIds = state.programmeIds.includes(programmeId)
        ? state.programmeIds.filter((id) => id !== programmeId)
        : [...state.programmeIds, programmeId];
    },
  },
});

export const { toggleWishlistProgramme } = wishlistSlice.actions;

export default wishlistSlice.reducer;

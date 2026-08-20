"use client";

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleWishlistProgramme } from "@/redux/slices/wishlistSlice";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const programmeIds = useAppSelector((state) => state.wishlist.programmeIds);

  const toggleProgramme = useCallback(
    (programmeId: string) => {
      dispatch(toggleWishlistProgramme(programmeId));
    },
    [dispatch],
  );

  return { programmeIds, toggleProgramme };
}

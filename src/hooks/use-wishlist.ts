"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchWishlist,
  addToWishlistThunk,
  removeFromWishlistThunk,
  clearWishlist,
} from "@/redux/slices/wishlistSlice";
import { useAuth } from "@/hooks/use-auth";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const { programmeIds, items, loading, error, synced } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (isAuthenticated) {
      void dispatch(fetchWishlist());
    } else {
      dispatch(clearWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const isSaved = useCallback(
    (programId: string | number) => programmeIds.includes(String(programId)),
    [programmeIds],
  );

  const addProgramme = useCallback(
    async (programId: string | number) => {
      if (!isAuthenticated) {
        console.warn("[useWishlist] User is not authenticated");
        return;
      }

      await dispatch(addToWishlistThunk(programId)).unwrap();
    },
    [dispatch, isAuthenticated],
  );

  const removeProgramme = useCallback(
    async (programId: string | number) => {
      if (!isAuthenticated) {
        console.warn("[useWishlist] User is not authenticated");
        return;
      }

      const wishlistItem = items.find((item) => String(item.program_id) === String(programId));

      if (!wishlistItem) {
        console.warn("[useWishlist] Wishlist item not found:", programId);
        return;
      }

      await dispatch(
        removeFromWishlistThunk({
          programId,
          wishlistId: wishlistItem.id,
        }),
      ).unwrap();
    },
    [dispatch, isAuthenticated, items],
  );

  const toggleProgramme = useCallback(
    async (programId: string | number) => {
      if (isSaved(programId)) {
        await removeProgramme(programId);
      } else {
        await addProgramme(programId);
      }
    },
    [isSaved, addProgramme, removeProgramme],
  );

  const refetch = useCallback(async () => {
    if (!isAuthenticated) return;

    await dispatch(fetchWishlist()).unwrap();
  }, [dispatch, isAuthenticated]);

  return {
    programmeIds,
    wishlistItems: items,
    loading,
    error,
    isSaved,
    toggleProgramme,
    addProgramme,
    removeProgramme,
    refetch,
    total: items.length,
    synced,
  };
}

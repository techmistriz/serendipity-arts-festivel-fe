"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addWishlistProgramme,
  clearWishlist,
  removeWishlistProgramme,
  requestWishlist,
  setWishlist,
  wishlistRequestFailed,
} from "@/redux/slices/wishlistSlice";
import { useAuth } from "@/hooks/use-auth";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlist.service";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

let wishlistRequest: Promise<void> | null = null;

function syncWishlist(dispatch: ReturnType<typeof useAppDispatch>) {
  if (!wishlistRequest) {
    dispatch(requestWishlist());
    wishlistRequest = getWishlist()
      .then((programmes) => {
        dispatch(setWishlist(programmes));
      })
      .catch((error: unknown) => {
        dispatch(wishlistRequestFailed(getErrorMessage(error, "Failed to fetch wishlist")));
        throw error;
      })
      .finally(() => {
        wishlistRequest = null;
      });
  }

  return wishlistRequest;
}

export function useWishlist() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const { programmeIds, programmes, loading, error, synced } = useAppSelector(
    (state) => state.wishlist,
  );

  const loadWishlist = useCallback(
    async (force = false) => {
      if (!isAuthenticated || (!force && synced)) return;

      await syncWishlist(dispatch);
    },
    [dispatch, isAuthenticated, synced],
  );

  useEffect(() => {
    if (isAuthenticated) {
      void loadWishlist().catch(() => undefined);
    } else {
      dispatch(clearWishlist());
    }
  }, [dispatch, isAuthenticated, loadWishlist]);

  const isSaved = useCallback(
    (programId: string | number) => programmeIds.includes(String(programId)),
    [programmeIds],
  );

  const addProgramme = useCallback(
    async (programId: string | number) => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to update your wishlist");
      }

      if (isSaved(programId)) return;

      dispatch(requestWishlist());

      try {
        dispatch(addWishlistProgramme(await addToWishlist(programId)));
      } catch (error) {
        dispatch(wishlistRequestFailed(getErrorMessage(error, "Failed to add to wishlist")));
        throw error;
      }
    },
    [dispatch, isAuthenticated, isSaved],
  );

  const removeProgramme = useCallback(
    async (programId: string | number) => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to update your wishlist");
      }

      if (!isSaved(programId)) return;

      dispatch(requestWishlist());

      try {
        await removeFromWishlist(programId);
        dispatch(removeWishlistProgramme(programId));
      } catch (error) {
        dispatch(wishlistRequestFailed(getErrorMessage(error, "Failed to remove from wishlist")));
        throw error;
      }
    },
    [dispatch, isAuthenticated, isSaved],
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
    await loadWishlist(true);
  }, [loadWishlist]);

  return {
    programmeIds,
    wishlistProgrammes: programmes,
    loading,
    error,
    isSaved,
    toggleProgramme,
    addProgramme,
    removeProgramme,
    refetch,
    total: programmeIds.length,
    synced,
  };
}

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

//  Fetch wishlist from API and update Redux.
//   Prevents duplicate simultaneous requests.

const syncWishlist = (dispatch: ReturnType<typeof useAppDispatch>): Promise<void> => {
  if (wishlistRequest) {
    return wishlistRequest;
  }

  dispatch(requestWishlist());

  wishlistRequest = getWishlist()
    .then((programmes) => {
      console.log("[Wishlist] Synced from API:", programmes);
      dispatch(setWishlist(programmes));
    })
    .catch((error: unknown) => {
      dispatch(wishlistRequestFailed(getErrorMessage(error, "Failed to fetch wishlist")));

      throw error;
    })
    .finally(() => {
      wishlistRequest = null;
    });

  return wishlistRequest;
};

export function useWishlist() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const { programmeIds, programmes, loading, error, synced } = useAppSelector(
    (state) => state.wishlist,
  );

  //  Check whether a programme is in the wishlist.

  const isSaved = useCallback(
    (programId: string | number) => programmeIds.includes(String(programId)),
    [programmeIds],
  );

  //  Fetch the latest wishlist from the backend.

  const refetch = useCallback(async () => {
    if (!isAuthenticated) return;

    await syncWishlist(dispatch);
  }, [dispatch, isAuthenticated]);

  //  Initial wishlist load.

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearWishlist());
      return;
    }

    void refetch().catch(() => undefined);
  }, [dispatch, isAuthenticated, refetch]);

  /**
   * Refresh wishlist whenever the user returns to the browser/tab.
   *
   * This ensures changes made from Postman or another device
   * are reflected in the current UI.
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshWishlist = () => {
      console.log("[Wishlist] Refreshing from API...");
      void syncWishlist(dispatch).catch(() => undefined);
    };

    const handleFocus = () => {
      console.log("[Wishlist] Window focused");
      refreshWishlist();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[Wishlist] Tab became visible");
        refreshWishlist();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated]);

  //  Add programme to wishlist.

  const addProgramme = useCallback(
    async (programId: string | number) => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to update your wishlist");
      }

      if (isSaved(programId)) return;

      dispatch(requestWishlist());

      try {
        const programme = await addToWishlist(programId);

        dispatch(addWishlistProgramme(programme));
      } catch (error) {
        dispatch(wishlistRequestFailed(getErrorMessage(error, "Failed to add to wishlist")));

        throw error;
      }
    },
    [dispatch, isAuthenticated, isSaved],
  );

  //  Remove programme from wishlist.

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

  // Add/remove programme from wishlist.

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

  return {
    programmeIds,
    wishlistProgrammes: programmes,
    total: programmeIds.length,

    loading,
    error,
    synced,
    isAuthenticated,

    isSaved,
    addProgramme,
    removeProgramme,
    toggleProgramme,
    refetch,
  };
}

import type {
  WishlistResponse,
  WishlistAddResponse,
  WishlistRemoveResponse,
  WishlistItem,
} from "@/types/wishlist";
import API, { METHODS } from "@/network/API";

const handleError = (error: unknown, context: string) => {
  console.error(`[Wishlist API] ${context}:`, error instanceof Error ? error.message : error);
  throw error;
};

// Get wishlist
export async function getWishlist(): Promise<WishlistResponse> {
  try {
    const response = await API<WishlistResponse>("/wishlist", METHODS.GET);

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch wishlist");
    }

    const items = response.data || [];
    const programmeIds = items.map((item: WishlistItem) => String(item.program_id)).filter(Boolean);

    return {
      ...response,
      programmeIds,
    };
  } catch (error) {
    handleError(error, "Error fetching wishlist");
    throw error; // TypeScript requires this
  }
}

// Add to wishlist
export async function addToWishlist(programId: string | number): Promise<WishlistAddResponse> {
  if (!programId) throw new Error("Program ID is required");

  try {
    const response = await API<WishlistAddResponse>("/wishlist/add", METHODS.POST, {
      program_id: String(programId),
    });

    if (!response.status) {
      throw new Error(response.message || "Failed to add to wishlist");
    }

    return response;
  } catch (error) {
    handleError(error, `Error adding programme "${programId}" to wishlist`);
    throw error;
  }
}

// Remove from wishlist
export async function removeFromWishlist(
  wishlistId: number,
  programId: string | number,
): Promise<WishlistRemoveResponse> {
  if (!wishlistId) throw new Error("Wishlist ID is required");
  if (!programId) throw new Error("Program ID is required");

  try {
    const response = await API<WishlistRemoveResponse>(
      `/wishlist/remove/${wishlistId}`,
      METHODS.POST,
      { program_id: String(programId) },
    );

    if (!response.status) {
      throw new Error(response.message || "Failed to remove from wishlist");
    }

    return response;
  } catch (error) {
    handleError(error, `Error removing programme "${programId}" from wishlist`);
    throw error;
  }
}

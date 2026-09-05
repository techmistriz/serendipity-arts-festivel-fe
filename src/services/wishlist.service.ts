import type {
  WishlistResponse,
  WishlistAddResponse,
  WishlistRemoveResponse,
  WishlistProgramme,
} from "@/types/wishlist";
import API, { METHODS } from "@/network/API";

type WishlistResponseItem = WishlistResponse["data"][number];

const toWishlistProgramme = ({ program_id, program }: WishlistResponseItem): WishlistProgramme => ({
  programmeId: String(program_id),
  program,
});

export async function getWishlist(): Promise<WishlistProgramme[]> {
  try {
    const response = await API<WishlistResponse>("/wishlist", METHODS.GET);

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch wishlist");
    }

    return response.data.map(toWishlistProgramme);
  } catch (error) {
    console.error("[Wishlist API] Error fetching wishlist:", error);
    throw error;
  }
}

export async function addToWishlist(programId: string | number): Promise<WishlistProgramme> {
  if (!programId) throw new Error("Program ID is required");

  try {
    const response = await API<WishlistAddResponse>("/wishlist/add", METHODS.POST, {
      program_id: String(programId),
    });

    if (!response.status) {
      throw new Error(response.message || "Failed to add to wishlist");
    }

    if (!response.data) {
      throw new Error("Wishlist response did not include the added programme");
    }

    return toWishlistProgramme(response.data);
  } catch (error) {
    console.error(`[Wishlist API] Error adding programme "${programId}" to wishlist:`, error);
    throw error;
  }
}

export async function removeFromWishlist(
  programId: string | number,
): Promise<WishlistRemoveResponse> {
  if (!programId) throw new Error("Program ID is required");

  try {
    const response = await API<WishlistRemoveResponse>("/wishlist/remove", METHODS.POST, {
      program_id: String(programId),
    });

    if (!response.status) {
      throw new Error(response.message || "Failed to remove from wishlist");
    }

    return response;
  } catch (error) {
    console.error(`[Wishlist API] Error removing programme "${programId}" from wishlist:`, error);
    throw error;
  }
}

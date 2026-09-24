"use client";

import { deleteAccount } from "@/services/delete-account.service";
import { useState } from "react";

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const response = await deleteAccount();

      return {
        success: true,
        message: response.message ?? "Your account deletion has been scheduled successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to schedule account deletion.",
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount: handleDeleteAccount,
    isDeleting,
  };
}

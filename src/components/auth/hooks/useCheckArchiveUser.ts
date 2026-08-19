import { useEffect, useState } from "react";
import axios from "axios";
import { archiveUser, type ArchivedUser } from "@/services/register.service";
import type { ApiResponse } from "@/types/api";

export const useCheckArchiveUser = (email: string | undefined, roleId: number) => {
  const [isChecking, setIsChecking] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const [archivedUser, setArchivedUser] = useState<ArchivedUser | null>(null);

  useEffect(() => {
    const trimmedEmail = (email ?? "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = emailRegex.test(trimmedEmail);

    const timer = setTimeout(
      async () => {
        if (!hasValidEmail) {
          setUserExists(null);
          setArchivedUser(null);
          setArchiveError(null);
          setIsChecking(false);
          return;
        }

        setIsChecking(true);
        setArchiveError(null);

        try {
          const response = await archiveUser({
            email: trimmedEmail,
            role_id: roleId,
          });

          const result = response.data;

          if (result.status === true) {
            setUserExists(true);

            // API returns the user directly inside data
            setArchivedUser(result.data);

            setArchiveError(null);
          } else if (result.message === "Archived user not found.") {
            setUserExists(false);
            setArchivedUser(null);
            setArchiveError(null);
          } else {
            setUserExists(null);
            setArchivedUser(null);

            setArchiveError(
              typeof result.message === "string" ? result.message : "Unable to check email",
            );
          }
        } catch (error) {
          if (axios.isAxiosError<ApiResponse<ArchivedUser>>(error)) {
            const result = error.response?.data;

            if (result?.message === "Archived user not found.") {
              setUserExists(false);
              setArchivedUser(null);
              setArchiveError(null);
            } else {
              setUserExists(null);
              setArchivedUser(null);

              setArchiveError(
                typeof result?.message === "string" ? result.message : "Unable to check email",
              );
            }
          } else {
            setUserExists(null);
            setArchivedUser(null);

            setArchiveError("An unexpected error occurred");
          }
        } finally {
          setIsChecking(false);
        }
      },
      hasValidEmail ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [email, roleId]);

  return {
    isChecking,
    userExists,
    archivedUser,
    archiveError,
  };
};

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { archiveUser } from "@/src/services/register.service";

export const useCheckArchiveUser = (
  email: string | undefined,
  roleId: number,
) => {
  const [isChecking, setIsChecking] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const [archivedUser, setArchivedUser] = useState<any | null>(null);

  useEffect(() => {
    const trimmedEmail = (email ?? "").trim();

    if (!trimmedEmail) {
      setUserExists(null);
      setArchivedUser(null);
      setArchiveError(null);
      setIsChecking(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setUserExists(null);
      setArchivedUser(null);
      setArchiveError(null);
      setIsChecking(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      setArchiveError(null);

      try {
        const response = await archiveUser({
          email: trimmedEmail,
          role_id: roleId,
        });

        console.log("ARCHIVE USER RESPONSE:", response.data);

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
            typeof result.message === "string"
              ? result.message
              : "Unable to check email",
          );
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const result = error.response?.data;

          console.log("ARCHIVE USER ERROR RESPONSE:", result);

          if (result?.message === "Archived user not found.") {
            setUserExists(false);
            setArchivedUser(null);
            setArchiveError(null);
          } else {
            setUserExists(null);
            setArchivedUser(null);

            setArchiveError(
              typeof result?.message === "string"
                ? result.message
                : "Unable to check email",
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
    }, 500);

    return () => clearTimeout(timer);
  }, [email, roleId]);

  return {
    isChecking,
    userExists,
    archivedUser,
    archiveError,
  };
};

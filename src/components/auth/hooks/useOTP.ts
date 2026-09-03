import { useState } from "react";
import { sendOTP } from "@/services/register.service";
import { AxiosError } from "axios";

export const useOTP = () => {
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (email: string, contact: string, std_code: string) => {
    const cleanEmail = email?.trim();
    const cleanContact = contact?.trim();
    const cleanStdCode = std_code?.trim() || "91";

    // Reset previous OTP state
    setOtpError(null);
    setOtpSent(false);

    if (!cleanEmail) {
      setOtpError("Email is required.");
      return;
    }

    if (!cleanContact) {
      setOtpError("Contact number is required.");
      return;
    }

    setIsSendingOTP(true);

    try {
      const response = await sendOTP({
        email: cleanEmail,
        contact: cleanContact,
        std_code: cleanStdCode,
      });

      console.log("SEND OTP RESPONSE:", response);

      // SUCCESS
      if (response?.status === true) {
        setOtpSent(true);
        setOtpError(null);
        return;
      }

      // BACKEND VALIDATION / BUSINESS ERROR
      setOtpSent(false);

      setOtpError(typeof response?.message === "string" ? response.message : "Unable to send OTP.");
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      setOtpSent(false);

      if (error instanceof AxiosError) {
        const message = error.response?.data?.message;

        setOtpError(
          typeof message === "string" ? message : "Unable to send OTP. Please try again.",
        );
      } else {
        setOtpError("An unexpected error occurred.");
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  return {
    handleSendOTP,
    isSendingOTP,
    otpError,
    otpSent,
  };
};

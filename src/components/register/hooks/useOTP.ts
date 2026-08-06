import { useState } from "react";
import { sendOTP } from "@/src/services/register.service";
import { AxiosError } from "axios";

export const useOTP = () => {
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOTP = async (email: string, contact: string, std_code: string) => {
        if (!email || !contact) {
            setOtpError("Email and contact number are required");
            return;
        }

        setIsSendingOTP(true);
        setOtpError(null);

        try {
            const response = await sendOTP({ email, contact, std_code });

            // Check if response is successful
            if (response && response.data) {
                const isSuccess = response.data.success === true || response.data.status === true;
                if (isSuccess) {
                    setOtpSent(true);
                } else {
                    setOtpError(response.data.message || "Failed to send OTP");
                }
            } else {
                setOtpError("Failed to send OTP: Invalid response");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setOtpError(error.response?.data?.message || "Failed to send OTP");
            } else {
                setOtpError("An unexpected error occurred");
            }
        } finally {
            setIsSendingOTP(false);
        }
    };

    return { handleSendOTP, isSendingOTP, otpError, otpSent };
};
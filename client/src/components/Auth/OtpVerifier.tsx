import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import CryptoJS from "crypto-js";

interface OtpVerifierProps {
    username: string;
    email: string;
    onClose: () => void;
    onVerified: () => void;
}

const OtpVerifier: React.FC<OtpVerifierProps> = ({ username, email, onClose, onVerified }) => {
    const [otp, setOtp] = useState<string>("");
    const [encryptedOtp, setEncryptedOtp] = useState<string>(""); // Store the encrypted OTP
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(300); // 5 minutes in seconds

    const secretKey = import.meta.env.VITE_ENCRYPTION_KEY; // Use a secret key for encryption

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const encryptOtp = (otp: string) => {
        return CryptoJS.AES.encrypt(otp, secretKey).toString();
    };

    const decryptOtp = (encryptedOtp: string) => {
        const bytes = CryptoJS.AES.decrypt(encryptedOtp, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const sendOtpEmail = async () => {
        if (isOtpSent) return;

        const newOtp = generateOtp();
        const encrypted = encryptOtp(newOtp);
        setEncryptedOtp(encrypted);

        const emailParams = {
            to_name: username,
            to_email: email,
            message: `Your OTP code is ${newOtp}. Please use this to verify your account.`,
        };

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                emailParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            setIsOtpSent(true);
            toast.success(`OTP has been sent to ${email}`);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            toast.error("Failed to send OTP. Please try again.");
        }
    };

    const handleVerifyOtp = () => {
        setIsVerifying(true);

        const decryptedOtp = decryptOtp(encryptedOtp); 

        if (otp === decryptedOtp) {
            toast.success("OTP verified successfully!");
            setIsVerified(true);
            onVerified();
            onClose();
        } else {
            toast.error("Invalid OTP, please try again.");
        }

        setIsVerifying(false);
    };

    const handleOtpChange = (value: string) => {
        setOtp(value);
    };

    useEffect(() => {
        let timerInterval: NodeJS.Timeout | undefined;

        if (isOtpSent && !isVerified) {
            timerInterval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }

        if (isVerified) {
            clearInterval(timerInterval);
        }

        // Clear the interval on component unmount
        return () => clearInterval(timerInterval);
    }, [isOtpSent, isVerified]);

    useEffect(() => {
        if (!isOtpSent) {
            sendOtpEmail();
        }
    }, [isOtpSent]); // Send OTP only once when the component mounts

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            {isOtpSent ? (
                <>
                    <div className="flex flex-col items-center">
                        <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} disabled={isVerified || timer === 0}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <p className="mt-4">Time remaining: {formatTime(timer)}</p>
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={handleVerifyOtp}
                            disabled={isVerifying || isVerified || timer === 0}
                            className={isVerified ? "bg-green-500" : ""}
                        >
                            {isVerified ? "Verified" : isVerifying ? "Verifying..." : "Verify"}
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={isVerifying}>
                            Cancel
                        </Button>
                    </div>
                    {timer === 0 && !isVerified && <p className="text-red-500 mt-4">OTP has expired. Please try again.</p>}
                </>
            ) : (
                <p>Sending OTP...</p>
            )}
        </div>
    );
};

export default OtpVerifier;

"use client";

import { Loader2, QrCode, ShieldCheck, ShieldOff } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

import { useAuth, useEnable2FA, useVerify2FA } from "@app/lib/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Alert,
  AlertTitle,
  AlertDescription,
} from "../shadcn";
import Disable2FADialog from "./Disable2FADialog";

const Setting2FADialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const { account, authorizeClient: refetchAccount } = useAuth();
  const { mutate: enableTwoFactor, isPending: isEnabling } = useEnable2FA();
  const { mutate: verifyTwoFactor, isPending: isVerifying } = useVerify2FA();

  const handleEnable = () => {
    enableTwoFactor(undefined, {
      onSuccess: (data) => {
        setQrCodeUrl(data);
      },
    });
  };

  const handleVerify = () => {
    verifyTwoFactor(
      { otpCode: verificationCode },
      {
        onSuccess: () => {
          refetchAccount();
          setQrCodeUrl(null);
          setVerificationCode("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>Enhance your account security by enabling two-factor authentication.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {account?.enable2FA ? (
            <>
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Two-Factor Authentication is enabled</AlertTitle>
                <AlertDescription>Your account is protected with an additional layer of security.</AlertDescription>
              </Alert>
              <Disable2FADialog>
                <Button className="w-full" variant="destructive">
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Disable 2FA
                </Button>
              </Disable2FADialog>
            </>
          ) : qrCodeUrl ? (
            <>
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertTitle>Scan the QR Code</AlertTitle>
                <AlertDescription>Use your authenticator app to scan this QR code.</AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <QRCodeCanvas value={qrCodeUrl} size={200} />
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <Button className="w-full" onClick={handleVerify} disabled={isVerifying || verificationCode.length !== 6}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify and Enable"
                )}
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={handleEnable} disabled={isEnabling}>
              {isEnabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Enable 2FA
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Setting2FADialog;

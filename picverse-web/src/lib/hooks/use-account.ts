"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { signUp, forgotPassword, resetPassword, changePassword, updateAccountConfig } from "../actions";

export const useSignUp = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignUp = (data: SignUpRequest) => {
    startTransition(async () => {
      try {
        await signUp(data);
        toast.success("Sign up success");
        router.replace("/sign-in");
      } catch (error) {
        toast.error("Sign up failed" + error);
      }
    });
  };

  return { handleSignUp, isPending };
};

export const useForgotPassword = () => {
  const [isPending, startTransition] = useTransition();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleForgotPassword = (data: ForgotPasswordRequest) => {
    startTransition(async () => {
      try {
        const sessionId = await forgotPassword(data);
        toast.success("Check your email for reset instructions.");
        setSessionId(sessionId);
      } catch (error) {
        toast.error("Failed to send reset email");
      }
    });
  };

  return { handleForgotPassword, isPending, sessionId, setSessionId };
};

export const useResetPassword = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleResetPassword = (data: ResetPasswordRequest) => {
    startTransition(async () => {
      try {
        const response = await resetPassword(data);
        toast.success(response.message);
        router.replace("/sign-in");
      } catch (error) {
        toast.error("Reset password failed");
      }
    });
  };

  return { handleResetPassword, isPending };
};

export const useChangePassword = () => {
  const [isPending, startTransition] = useTransition();

  const handleChangePassword = (data: ChangePasswordRequest) => {
    startTransition(async () => {
      try {
        const response = await changePassword(data);
        toast.success(response.message);
      } catch (error) {
        toast.error("Failed to change password");
      }
    });
  };

  return { handleChangePassword, isPending };
};

export const useUpdateAccountConfig = () => {
  const [isPending, startTransition] = useTransition();

  const handleUpdateAccountConfig = (data: UpdateAccountConfigRequest) => {
    startTransition(async () => {
      try {
        const response = await updateAccountConfig(data);

        toast.success(response.message);
      } catch (error) {
        toast.error("Failed to update: " + error);
      }
    });
  };

  return { handleUpdateAccountConfig, isPending };
};

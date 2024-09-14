"use client";

import { Button } from "@/components/ui/button";
import { useGoogleLogin as useGoogleLoginHook } from "@/features/auth/hooks/use-google-login";
import { useGoogleLogin } from "@stack-pulse/next-google-login";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

interface GoogleSignInButtonProps {
  label: string;
  loginError: string;
}

const GoogleSignInButton = ({ label, loginError }: GoogleSignInButtonProps) => {
  const { mutate: googleLogin, isPending } = useGoogleLoginHook();
  const router = useRouter();
  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: async (tokenResponse: any) => {
      const idToken = tokenResponse.tokenObj.id_token;
      googleLogin(
        { tokenId: idToken },
        {
          onSuccess: () => {
            router.push(`/`);
          },
          onError: () => {
            toast.error(loginError);
          },
        }
      );
    },
    onFailure(error) {
      toast.error(error.message);
    },
    cookiePolicy: "single_host_origin",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });

  return (
    <div>
      <Button
        disabled={isPending}
        onClick={signIn}
        variant="outline"
        className="w-full dark:hover:bg-primary-foreground h-12"
      >
        <div className="flex items-center justify-center gap-x-2">
          <FcGoogle size={20} />
          <span className="text-gray-400 text-sm font-bold leading-tight dark:text-white">
            {label}
          </span>
        </div>
      </Button>
    </div>
  );
};

export default GoogleSignInButton;

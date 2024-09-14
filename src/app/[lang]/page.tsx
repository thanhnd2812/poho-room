"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const signOut = () => {
    logout({}, {
      onSuccess: () => {
        router.push(`/login`);
      }
    });
  }

  return (
    <div>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}

export default Page

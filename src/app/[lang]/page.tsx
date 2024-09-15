"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
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

  // const signOut = async () => {
  //   const token = await getStreamToken();
  //   console.log({ token })
  // }
  const { data, isLoading } = useProfile();

  console.log({ data, isLoading })
  return (
    <div>
      <Button onClick={signOut}>Get Stream Token</Button>
    </div>
  );
}

export default Page

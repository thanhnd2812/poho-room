
import VerifyEmailForm from "@/features/auth/components/verify-email-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    redirect("/");
  }

  return <VerifyEmailForm />
}

export default Page


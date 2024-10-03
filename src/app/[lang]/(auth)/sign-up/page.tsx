import SignUpForm from "@/features/auth/components/sign-up-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    redirect("/");
  }

  return <SignUpForm />;
}

export default Page


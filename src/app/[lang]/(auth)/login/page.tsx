import LoginForm from "@/features/auth/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
interface PageProps {
  params: {
    lang: string;
  }
}
const Page = ({ params }: PageProps) => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    redirect("/");
  }
  const { lang } = params;
  return <LoginForm lang={lang} />;
}

export default Page


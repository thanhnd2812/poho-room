import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    redirect("/");
  }

  return <div>Verify Email</div>;
}

export default Page


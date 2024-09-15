import LoginForm from "@/features/auth/components/login-form";

interface PageProps {
  params: {
    lang: string;
  }
}
const Page = ({ params }: PageProps) => {
  const { lang } = params;
  return <LoginForm lang={lang} />;
}

export default Page


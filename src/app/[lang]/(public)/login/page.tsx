import ChangeLanguage from "@/components/languages-select/change-language";
import PohoLogoWithText from "@/components/logo/poho-logo-text";
import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "@/features/auth/components/login-form";

interface PageProps {
  params: {
    lang: string;
  }
}
const Page = ({ params }: PageProps) => {
  const { lang } = params;
  
  return (
    <div className="h-screen p-6 bg-surface dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PohoLogoWithText />
        <div className="flex items-center gap-2">
          <ChangeLanguage />
          <ModeToggle />
        </div>
      </div>
      {/* Content */}
      <div className="border p-4 w-full sm:w-[504px] mx-auto mt-10">
        <LoginForm lang={lang} />
      </div>
    </div>
  );
}

export default Page

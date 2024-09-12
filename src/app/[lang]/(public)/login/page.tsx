import ChangeLanguage from "@/components/languages-select/change-language";
import PohoLogoWithText from "@/components/logo/poho-logo-text";
import { ModeToggle } from "@/components/mode-toggle";
import FeatureSlider from "@/features/auth/components/feature-slider";
import LoginForm from "@/features/auth/components/login-form";

interface PageProps {
  params: {
    lang: string;
  }
}
const Page = ({ params }: PageProps) => {
  const { lang } = params;

  return (
    <div className="h-screen p-8 bg-surface dark:bg-slate-800 lg:flex lg:gap-x-4">
      <div className="hidden lg:block flex-1 ">
        <FeatureSlider lang={lang as "en" | "vi"} />
      </div>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <PohoLogoWithText />
          <div className="flex items-center gap-2">
            <ChangeLanguage />
            <ModeToggle />
          </div>
        </div>
        {/* Content */}
        <div className="p-4 w-full sm:w-[504px] mx-auto mt-10">
          <LoginForm lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default Page

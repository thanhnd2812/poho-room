import ChangeLanguage from '@/components/languages-select/change-language';
import PohoLogoWithText from '@/components/logo/poho-logo-text';
import { ModeToggle } from '@/components/mode-toggle';
import FeatureSlider from '@/features/auth/components/feature-slider';
import React from 'react';

interface PageProps {
  params: {
    lang: string;
  };
  children: React.ReactNode;
}
const AuthLayout = ({ children, params }: PageProps) => {
  const { lang } = params;
  return (
    <div className="h-screen p-8 bg-surface dark:bg-slate-800 lg:flex lg:gap-x-8 mx-auto max-w-[1400px]">
      {/* Feature Slider */}
      <div className="hidden lg:block lg:flex-1">
        <FeatureSlider lang={lang as "en" | "vi"} />
      </div>
      {/* Auth Forms */}
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
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout

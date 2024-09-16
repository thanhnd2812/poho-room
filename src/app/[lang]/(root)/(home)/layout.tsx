import Sidebar from '@/components/sidebar';
import { SupportedLanguage } from '@/constant/locales';
import Navbar from '@/features/home/components/navbar';
import { getLanguage } from '@/languages';
import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
  params: { lang: SupportedLanguage };
}
const HomeLayout = async ({ children, params }: HomeLayoutProps) => {
  const language = await getLanguage(params.lang);
  return (
    <main className="relative">
      <Navbar
        lang={params.lang}
        confirmTitle={language.auth.logout.title}
        confirmMessage={language.auth.logout.description}
        confirmCancelText={language.auth.logout.cancel}
        confirmConfirmText={language.auth.logout.logout}
      />

      <div className="flex">
        <Sidebar
          lang={params.lang}
          confirmTitle={language.auth.logout.title}
          confirmMessage={language.auth.logout.description}
          confirmCancelText={language.auth.logout.cancel}
          confirmConfirmText={language.auth.logout.logout}
        />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
}

export default HomeLayout

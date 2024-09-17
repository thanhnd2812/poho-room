import ChangeLanguage from "@/components/languages-select/change-language";
import PohoLogo from "@/components/logo/poho-logo";
import PohoText from "@/components/logo/poho-text";
import { ModeToggle } from "@/components/mode-toggle";
import { SupportedLanguage } from "@/constant/locales";
import Link from "next/link";
import MobileNav from "./mobile-nav";

interface NavbarProps { 
  lang: SupportedLanguage;
  confirmTitle: string;
  confirmMessage: string;
  confirmCancelText: string;
  confirmConfirmText: string;
}

const Navbar = ({ lang, confirmTitle, confirmMessage, confirmCancelText, confirmConfirmText }: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center fixed z-50 w-full px-6 py-4 lg:px-10 bg-dark-1">
      <Link href="/" className="flex gap-2 items-center">
        <PohoLogo />
        <PohoText />
      </Link>
      <div className="flex-between gap-5">
        <ModeToggle />
        <ChangeLanguage />
        <MobileNav lang={lang} confirmTitle={confirmTitle} confirmMessage={confirmMessage} confirmCancelText={confirmCancelText} confirmConfirmText={confirmConfirmText} />
      </div>
    </nav>
  );
};

export default Navbar;

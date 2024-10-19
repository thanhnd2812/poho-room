"use client";

import PohoLogo from "@/components/logo/poho-logo";
import PohoText from "@/components/logo/poho-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SupportedLanguage } from "@/constant/locales";
import { sidebarLinks } from "@/constant/sidebar-links";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useConfirm } from "@/hooks/use-confirm";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Loader, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
;

interface MobileNavProps {
  lang: SupportedLanguage;
  confirmTitle: string;
  confirmMessage: string;
  confirmCancelText: string;
  confirmConfirmText: string;
}

const MobileNav = ({ lang, confirmTitle, confirmMessage, confirmCancelText, confirmConfirmText }: MobileNavProps) => {
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm(
    confirmTitle,
    confirmMessage,
    confirmCancelText,
    confirmConfirmText
  );
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout } = useLogout();
  const signOut = async () => {
    const ok = await confirm();
    if (!ok) return;
    logout(
      {},
      {
        onSuccess: () => {
          router.push(`/login`);
        },
      }
    );
  };
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px] sm:hidden">
      <ConfirmationDialog />
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="menu"
            width={36}
            height={36}
            className="cursor-pointer sm:hidden ml-auto"
          />
        </SheetTrigger>
        <SheetContent side={"left"} className="border-none bg-dark-1">
          <Link href="/" className="flex gap-1 items-center gap-x-2">
            <PohoLogo />
            <p className="text-[26px] font-extrabold text-white">
              <PohoText />
            </p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <section className="flex h-full flex-col gap-6 pt-16 text-white">
              {sidebarLinks.map((link, index) => {
                const linkRoute = `/${lang}${link.route}`;

                const isActive =
                  pathname === linkRoute ||
                  pathname.startsWith(`${linkRoute}/`) ||
                  pathname === `${link.route}${lang}`;

                return (
                  <SheetClose asChild key={index}>
                    <Link
                      className={cn(
                        "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                        {
                          "bg-blue-1": isActive,
                        }
                      )}
                      href={linkRoute}
                      key={index}
                    >
                      <Image
                        src={link.imgUrl}
                        alt={link.label[lang]}
                        width={20}
                        height={20}
                      />
                      <p className="font-semibold">{link.label[lang]}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
            <div className="pb-16">
              {isLoading ? (
                <Loader />
              ) : (
                <div className="flex items-center hover:opacity-75 transition justify-center">
                  <div>
                    <Avatar className="size-10 ">
                      <AvatarImage alt="profile" src={profile?.avatarUrl} />
                      <AvatarFallback className="bg-blue-500 font-medium text-white">
                        {profile?.fullname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex w-full justify-between p-2 items-center"
                  >
                    <p className="truncate text-white">{confirmTitle}</p>
                    <LogOut className="size-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;

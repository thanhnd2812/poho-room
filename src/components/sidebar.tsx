"use client";

import { SupportedLanguage } from "@/constant/locales";
import { sidebarLinks } from "@/constant/sidebar-links";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useConfirm } from "@/hooks/use-confirm";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Loader from "./loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SidebarProps {
  lang: SupportedLanguage;
  confirmTitle: string;
  confirmMessage: string;
  confirmCancelText: string;
  confirmConfirmText: string;
}

const Sidebar = ({ lang, confirmTitle, confirmMessage, confirmCancelText, confirmConfirmText }: SidebarProps) => {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout } = useLogout();
  const [ConfirmationDialog, confirm] = useConfirm(
    confirmTitle,
    confirmMessage,
    confirmCancelText,
    confirmConfirmText
  );
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
    <section className="sticky top-0 left-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <ConfirmationDialog />
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link, index) => {
          const linkRoute = `/${lang}${link.route}`;

          const isActive =
            pathname === linkRoute ||
            pathname.startsWith(`${linkRoute}/`) ||
            pathname === `${link.route}${lang}`;

          return (
            <Link
              className={cn(
                "flex gap-4 items-center p-4 rounded-lg justify-start",
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
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {link.label[lang]}
              </p>
            </Link>
          );
        })}
      </div>
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex items-center hover:opacity-75 transition">
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
              className=" flex w-full justify-between p-2 items-center"
            >
              <p className="truncate max-lg:hidden">{profile?.fullname}</p>
              <LogOut className="size-4 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sidebar;

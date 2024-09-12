import { Button } from "@/components/ui/button";
import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  lang: string;
}
const LoginForm = async ({ lang }: LoginFormProps) => {
  const language = await getLanguage(lang as SupportedLanguage);

  return (
    <div className="flex flex-col items-center justify-center dark:invert gap-y-6">
      <h1 className="text-2xl font-bold text-center text-zinc-800 leading-9 ">
        {language.auth.login.title}
      </h1>
      <div>
        Login form
      </div>
      <div className="flex items-center justify-center gap-x-2 w-full">
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-700"></div>
        <span className="text-neutral-400 dark:text-neutral-600 text-sm font-normal leading-tight">
          {language.auth.login.or}
        </span>
        <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-700"></div>
      </div>
      <div className="w-full">
        {/* Continue with Google */}
        <Button variant="outline" className="w-full">
          <div className="flex items-center justify-center gap-x-2">
            <FcGoogle size={20} />
            <span className="text-gray-400 text-sm font-bold leading-tight">
              {language.auth.login.continueWithGoogle}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default LoginForm

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { FcGoogle } from "react-icons/fc";
import EmailLoginForm from "./email-login-form";
import PhoneLoginForm from "./phone-login-form";
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
      <div className="w-full">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              {language.auth.login.emailAddress}
            </TabsTrigger>
            <TabsTrigger value="phone">
              {language.auth.login.phoneNumber}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            {/* Login with email */}
            <EmailLoginForm
              emailLabel={language.auth.login.email}
              emailPlaceholder={language.auth.login.emailPlaceholder}
              passwordLabel={language.auth.login.password}
              passwordPlaceholder={language.auth.login.passwordPlaceholder}
              buttonLabel={language.auth.login.login}
              emailFieldError={language.auth.login.emailFieldError}
              passwordFieldError={language.auth.login.passwordFieldError}
            />
          </TabsContent>
          <TabsContent value="phone">
            {/* Login with phone number */}
            <PhoneLoginForm
              phoneNumberLabel={language.auth.login.phoneNumber}
              phoneNumberPlaceholder={language.auth.login.phoneNumberPlaceholder}
              passwordLabel={language.auth.login.password}
              passwordPlaceholder={language.auth.login.passwordPlaceholder}
              buttonLabel={language.auth.login.login}
              phoneNumberFieldError={language.auth.login.phoneNumberFieldError}
              passwordFieldError={language.auth.login.passwordFieldError}
            />
          </TabsContent>
        </Tabs>
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


import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import Link from "next/link";
import EmailLoginForm from "./email-login-form";
import GoogleSignInButton from "./google-sign-in-button";
import PhoneLoginForm from "./phone-login-form";
interface LoginFormProps {
  lang: string;
}
const LoginForm = async ({ lang }: LoginFormProps) => {
  const language = await getLanguage(lang as SupportedLanguage);

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-zinc-800 leading-9 dark:text-white ">
        {language.auth.login.title}
      </h1>
      {/* Login with email or phone number */}
      <div className="w-full">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-muted-foreground dark:text-muted">
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
              loginError={language.auth.login.loginError}
              forgotPasswordText={language.auth.login.forgotPassword}
            />
          </TabsContent>
          <TabsContent value="phone">
            {/* Login with phone number */}
            <PhoneLoginForm
              phoneNumberLabel={language.auth.login.phoneNumber}
              phoneNumberPlaceholder={
                language.auth.login.phoneNumberPlaceholder
              }
              passwordLabel={language.auth.login.password}
              passwordPlaceholder={language.auth.login.passwordPlaceholder}
              buttonLabel={language.auth.login.login}
              phoneNumberFieldError={language.auth.login.phoneNumberFieldError}
              passwordFieldError={language.auth.login.passwordFieldError}
              loginError={language.auth.login.loginError}
            />
          </TabsContent>
        </Tabs>
      </div>
      {/* Sign up */}
      <div className="flex items-center justify-start gap-x-2 w-full">
        <Link href="/sign-up" className="w-full">
          <Button variant="outline" className="w-full">
            {language.auth.login.signUp}
          </Button>
        </Link>
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
        <GoogleSignInButton
          label={language.auth.login.continueWithGoogle}
          loginError={language.auth.login.loginError}
        />
      </div>
    </div>
  );
}

export default LoginForm

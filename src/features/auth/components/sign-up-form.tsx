"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useEmailSignup } from "../hooks/use-email-signup";

// form schema for fullname, email, password, confirm password. Note that, confirm password and password must be the same
const formSchema = z
  .object({
    fullname: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

const SignUpForm = () => {
  const router = useRouter();

  const t = useTranslations("auth.signUp");
  const { mutate: signup, isPending } = useEmailSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signup(values, {
      onSuccess: () => {
        toast.success(t("signupSuccess"));
        router.push("/login");
      },
      onError: () => {
        toast.error(t("signupError"));
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-zinc-800 leading-9 dark:text-white ">
        {t("title")}
      </h1>
      {/* sign up with email and pass */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* fullname */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullname")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fullnamePlaceholder")}
                      required
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.fullname && (
                    <span className="text-red-500 text-xs">
                      {t("fullnameFieldError")}
                    </span>
                  )}
                </FormItem>
              )}
            />
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      required
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <span className="text-red-500 text-xs">
                      {t("emailFieldError")}
                    </span>
                  )}
                </FormItem>
              )}
            />
            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("passwordPlaceholder")}
                        required
                        {...field}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOffIcon
                            className="w-4 h-4"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <EyeIcon
                            className="w-4 h-4"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors.password && (
                    <span className="text-red-500 text-xs">
                      {t("passwordFieldError")}
                    </span>
                  )}
                </FormItem>
              )}
            />
            {/* confirm password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("confirmPasswordPlaceholder")}
                        required
                        {...field}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon
                            className="w-4 h-4"
                            onClick={toggleConfirmPasswordVisibility}
                          />
                        ) : (
                          <EyeIcon
                            className="w-4 h-4"
                            onClick={toggleConfirmPasswordVisibility}
                          />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors.confirmPassword && (
                    <span className="text-red-500 text-xs">
                      {t("confirmPasswordFieldError")}
                    </span>
                  )}
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              className="w-full dark:text-white h-12"
              type="submit"
            >
              {t("buttonLabel")}
            </Button>
          </form>
        </Form>
      </div>
      {/* sign in */}
      <div className="flex items-center justify-start gap-x-2 w-full">
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full" >
            {t("login")}
          </Button>
        </Link>
      </div>
      {/* terms and conditions */}
      <div className="flex-1" />
      <div className="text-center pt-16">
        <p>
          {t("bySigningUpYouAgreeToOur")}{" "}
          <Link href="#" className="text-primary underline">
            {t("termsOfService")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="#" className="text-primary underline">
            {t("privacyPolicy")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default SignUpForm
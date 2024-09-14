"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useEmailLogin } from "../hooks/use-email-login";

interface EmailLoginFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  buttonLabel: string;
  emailFieldError: string;
  passwordFieldError: string;
  loginError: string;
}

const formSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).trim(),
});

const EmailLoginForm = ({ emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, buttonLabel, emailFieldError, passwordFieldError, loginError }: EmailLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: emailLogin, isPending } = useEmailLogin();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    emailLogin({ email, password }, {
      onSuccess: () => {
        router.push(`/`);
      },
      onError: () => {
        toast.error(loginError);
      }
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={emailPlaceholder}
                    required
                    autoFocus
                    type="email"
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <span className="text-red-500 text-xs">
                    {emailFieldError}
                  </span>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{passwordLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={passwordPlaceholder}
                      required
                      {...field}
                      autoComplete="current-password"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOffIcon className="w-4 h-4" onClick={togglePasswordVisibility} /> : <EyeIcon className="w-4 h-4" onClick={togglePasswordVisibility} />}
                    </Button>
                  </div>
                </FormControl>
                {form.formState.errors.password && (
                  <span className="text-red-500 text-xs">
                    {passwordFieldError}
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
            {buttonLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailLoginForm;

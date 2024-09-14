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
import { usePhoneLogin } from "../hooks/use-phone-login";

interface PhoneLoginFormProps {
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  buttonLabel: string;
  phoneNumberFieldError: string;
  passwordFieldError: string;
  loginError: string;
}

const formSchema = z.object({
  phoneNumber: z.string().min(10).trim(),
  password: z.string().min(8).trim(),
});

const PhoneLoginForm = ({ phoneNumberLabel, phoneNumberPlaceholder, passwordLabel, passwordPlaceholder, buttonLabel, phoneNumberFieldError, passwordFieldError, loginError }: PhoneLoginFormProps) => {
  const { mutate: phoneLogin, isPending } = usePhoneLogin();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    phoneLogin(values, {
      onSuccess: () => {
        router.push(`/`);
      },
      onError: (error) => {
        console.log(error);
        console.log("loginError", loginError);
        toast.error(loginError);
      }
    })
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{phoneNumberLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={phoneNumberPlaceholder}
                    required
                    autoFocus
                    type="tel"
                    {...field} />
                </FormControl>
                {form.formState.errors.phoneNumber && <span className="text-red-500 text-xs">{phoneNumberFieldError}</span>}
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
                    <Input type={showPassword ? "text" : "password"} placeholder={passwordPlaceholder} required {...field} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOffIcon className="w-4 h-4" onClick={togglePasswordVisibility} /> : <EyeIcon className="w-4 h-4" onClick={togglePasswordVisibility} />}
                    </Button>
                  </div>
                </FormControl>
                {form.formState.errors.password && <span className="text-red-500 text-xs">{passwordFieldError}</span>}
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            className="w-full dark:text-white h-12"
            type="submit">{buttonLabel}</Button>
        </form>
      </Form>
    </div>
  );
};

export default PhoneLoginForm;

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useForgotPass } from "../hooks/use-forgot-pass";

const formSchema = z.object({
  email: z.string().email().trim(),
});

interface ForgotPassFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  emailFieldError: string;
  forgotPasswordLabel: string;
  forgotPasswordDescription: string;
  forgotPasswordButton: string;
  generalError: string;
  backToLogin: string;
  linkHasBeenSent: string;
}

const ForgotPassForm = ({
  emailLabel,
  emailPlaceholder,
  emailFieldError,
  forgotPasswordLabel,
  forgotPasswordDescription,
  forgotPasswordButton,
  backToLogin,
  generalError,
  linkHasBeenSent,
}: ForgotPassFormProps) => {
  const { mutate: forgotPassword, isPending } = useForgotPass();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    forgotPassword(values, {
      onSuccess: () => {
        toast.success(linkHasBeenSent);
        form.reset();
      },
      onError: () => {
        toast.error(generalError);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-zinc-800 leading-9 dark:text-white ">
        {forgotPasswordLabel}
      </h1>
      {/* Description */}
      <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
        {forgotPasswordDescription}
      </p>
      {/* Form */}
      <div className="w-full flex flex-col gap-y-6">
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
            <div>
              <Button
                disabled={isPending}
                className="w-full dark:text-white h-12"
                type="submit"
              >
                {forgotPasswordButton}
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col gap-y-12">
          <Link href="/login" className="w-full">
            <Button
              className="w-full dark:text-white h-12 text-primary"
              type="button"
              variant="outline"
            >
              {backToLogin}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassForm;

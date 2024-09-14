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
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

interface EmailLoginFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  buttonLabel: string;
  emailFieldError: string;
  passwordFieldError: string;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const EmailLoginForm = ({ emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, buttonLabel, emailFieldError, passwordFieldError }: EmailLoginFormProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (!loading && user) {
      router.push(`/`);
    }
  }, [user, router, loading]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
        console.log(userCredential);
        toast.success("Login successful");
      })
      .catch((error) => {
        toast.error(error.message);
      });
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
                    {...field} />
                </FormControl>
                {form.formState.errors.email && <span className="text-red-500 text-xs">{emailFieldError}</span>}
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
                  <Input type="password" placeholder={passwordPlaceholder} required {...field} />
                </FormControl>
                {form.formState.errors.password && <span className="text-red-500 text-xs">{passwordFieldError}</span>}
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

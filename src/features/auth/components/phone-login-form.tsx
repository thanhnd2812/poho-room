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

interface PhoneLoginFormProps {
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  buttonLabel: string;
  phoneNumberFieldError: string;
  passwordFieldError: string;
}

const formSchema = z.object({
  phoneNumber: z.string().min(10),
  password: z.string().min(8),
});

const PhoneLoginForm = ({ phoneNumberLabel, phoneNumberPlaceholder, passwordLabel, passwordPlaceholder, buttonLabel, phoneNumberFieldError, passwordFieldError }: PhoneLoginFormProps) => {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
                  <Input type="password" placeholder={passwordPlaceholder} required {...field} />
                </FormControl>
                {form.formState.errors.password && <span className="text-red-500 text-xs">{passwordFieldError}</span>}
              </FormItem>
            )}
          />
          <Button
            className="w-full dark:text-white"
            type="submit">{buttonLabel}</Button>
        </form>
      </Form>
    </div>
  );
};

export default PhoneLoginForm;

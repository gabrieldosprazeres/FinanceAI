"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import Link from "next/link";
import { useState } from "react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";
import { CLERK_ERRORS } from "@/app/_constants/clerk-errors";
import ResetPassword from "./reset-password";
import { Separator } from "@/app/_components/ui/separator";

const resetPasswordSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const RequestResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoaded, signIn } = useSignIn();
  const [emailVerificationSent, setEmailVerificationSent] =
    useState<boolean>(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!isLoaded) return null;

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await signIn.create({
        identifier: data.email,
        strategy: "reset_password_email_code",
      });

      setEmailVerificationSent(true);

      toast.success("Solicitação de redefinição de senha enviada!");
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        const errorCode = error.errors[0].code as keyof typeof CLERK_ERRORS;
        const translatedError =
          CLERK_ERRORS[errorCode] || "Ocorreu um erro inesperado";
        toast.error(translatedError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailVerificationSent)
    return <ResetPassword email={form.getValues().email} />;

  return (
    <div className="rounded-lg border border-primary bg-zinc-800 bg-opacity-20 p-8 shadow-lg lg:p-8">
      <div className="mx-auto flex min-h-[500px] w-full max-w-[300px] flex-col justify-around space-y-6 sm:max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Redefinir senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu e-mail abaixo para receber o código de redefinição de
            senha.
          </p>
        </div>
        <div className="grid gap-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="nome@exemplo.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Enviar código de redefinição"
                )}
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-2">
            <Separator className="flex-1 bg-primary" />
            <span className="font-bold uppercase text-muted-foreground">
              ou entre na sua conta
            </span>
            <Separator className="flex-1 bg-primary" />
          </div>

          <Button
            variant="outline"
            disabled={isLoading}
            type="button"
            className="w-full hover:bg-primary"
            asChild
          >
            <Link href="/sign-in">
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Link>
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Ao clicar em continuar, você concorda com nossos{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Política de privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RequestResetPassword;

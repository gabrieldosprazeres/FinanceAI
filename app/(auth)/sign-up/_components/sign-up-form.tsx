"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useSignUp } from "@clerk/nextjs";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
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
import VerifyEmail from "./verify-email";
import { Separator } from "@/app/_components/ui/separator";

const signInSchema = z
  .object({
    email: z
      .string()
      .email("Endereço de e-mail inválido")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Formato de e-mail inválido",
      ),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Senha deve conter pelo menos um caractere especial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signInSchema>;

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoaded, signUp } = useSignUp();
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] =
    useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (!isLoaded) return null;

  const handleSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsVerifyEmailModalOpen(true);
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

  return (
    <div className="rounded-lg border border-primary bg-zinc-800 bg-opacity-20 p-8 shadow-lg lg:p-8">
      <div className="mx-auto flex w-full max-w-[300px] flex-col justify-center space-y-6 sm:max-w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu e-mail e senha abaixo para continuar.
          </p>
        </div>
        <div className="grid gap-6">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Confirme sua senha"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-2">
            <Separator className="flex-1 bg-primary" />
            <span className="font-bold uppercase text-muted-foreground">
              ou entre com sua conta
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
      <VerifyEmail
        isOpen={isVerifyEmailModalOpen}
        onClose={() => setIsVerifyEmailModalOpen(false)}
      />
    </div>
  );
};

export default SignUpForm;

"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { SignInButton, useSignIn } from "@clerk/nextjs";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";
import { CLERK_ERRORS } from "@/app/_constants/clerk-errors";
import { Separator } from "@/app/_components/ui/separator";
import Image from "next/image";

const signInSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
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
  rememberMe: z.boolean().default(false),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isLoaded) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        form.setValue("email", savedEmail);
        form.setValue("rememberMe", true);
      }
    }
  }, [isLoaded, form]);

  if (!isLoaded) return null;

  const handleSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      if (data.rememberMe) localStorage.setItem("rememberedEmail", data.email);
      else localStorage.removeItem("rememberedEmail");

      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete")
        setActive({ session: result.createdSessionId });

      toast.success("Login efetuado com sucesso!");
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
            Entre na sua conta
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        href="/reset-password"
                        className="text-sm font-bold uppercase text-primary hover:underline"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Lembrar meu e-mail
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">
                  Não tem uma conta?
                </span>
                <Link
                  href="/sign-up"
                  className="text-sm font-bold uppercase text-primary hover:underline"
                >
                  Registre-se
                </Link>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-2">
            <Separator className="flex-1 bg-primary" />
            <span className="font-bold uppercase text-muted-foreground">
              ou entre com
            </span>
            <Separator className="flex-1 bg-primary" />
          </div>

          <div className="flex w-full gap-4">
            <SignInButton>
              <Button variant="outline" className="flex-1 hover:bg-primary">
                <Image src="/google.svg" width={22} height={22} alt="Google" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInForm;

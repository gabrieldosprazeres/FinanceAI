import SignUpForm from "./_components/sign-up-form";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const SignUpPage = async () => {
  const { userId } = await auth();

  if (userId) redirect("/");

  return (
    <div className="mx-auto flex h-screen flex-col overflow-auto lg:grid lg:grid-cols-2">
      <div className="mx-auto flex h-full max-w-[750px] flex-col justify-center p-8">
        <Image
          src="/logo.png"
          width={375}
          height={39}
          alt="Finance AI"
          className="mb-8"
        />

        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="text-muted-foreground">
          A <i className="font-bold">FinanceAI</i> é uma plataforma inovadora de
          gestão financeira que utiliza inteligência artificial para monitorar
          suas movimentações, fornecer insights personalizados e ajudar você a
          controlar seu orçamento de forma eficiente e intuitiva.
        </p>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-0">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;

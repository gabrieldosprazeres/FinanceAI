import { CLERK_ERRORS } from "@/app/_constants/clerk-errors";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

const formSchema = z.object({
  code: z.string().min(6, "O código deve ter 6 caracteres").max(6),
});

type VerifyEmailForm = z.infer<typeof formSchema>;

const VerifyEmail = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isLoaded, setActive, signUp } = useSignUp();
  const router = useRouter();

  const form = useForm<VerifyEmailForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  if (!isLoaded) return null;

  const onSubmit = async (values: VerifyEmailForm) => {
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("E-mail verificado com sucesso!");
        router.push("/");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        const errorCode = error.errors[0].code as keyof typeof CLERK_ERRORS;
        const translatedError =
          CLERK_ERRORS[errorCode] || "Ocorreu um erro inesperado";
        toast.error(translatedError);
      }
    }
  };

  const resendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Código de verificação reenviado com sucesso!");
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        const errorCode = error.errors[0].code as keyof typeof CLERK_ERRORS;
        const translatedError =
          CLERK_ERRORS[errorCode] || "Ocorreu um erro inesperado";
        toast.error(translatedError);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle>Verifique seu e-mail</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o código de verificação"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resendCode}
                  disabled={form.formState.isSubmitting}
                  className="text-foreground hover:bg-primary"
                >
                  Reenviar código
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full text-foreground"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Verificar e-mail"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyEmail;

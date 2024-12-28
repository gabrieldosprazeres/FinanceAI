import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { MoneyInput } from "./money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { z } from "zod";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertTransaction } from "../_actions/upsert-transaction";

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: formSchema;
  transactionId?: string;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório.",
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "A categoria é obrigatório.",
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
});

type formSchema = z.infer<typeof formSchema>;

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  defaultValues,
  transactionId,
}: UpsertTransactionDialogProps) => {
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      amount: 50,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.OTHER,
      paymentMethod: TransactionPaymentMethod.CASH,
      date: new Date(),
    },
  });

  const onSubmit = async (data: formSchema) => {
    try {
      await upsertTransaction({ ...data, id: transactionId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdate = Boolean(transactionId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogContent className="max-sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {isUpdate ? "Atualizar" : "Criar"} transação
          </DialogTitle>
          <DialogDescription className="text-center">
            Insira as informações abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite um nome.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor.."
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de gasto..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método de pagamento..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex w-full flex-row justify-between gap-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </DialogClose>

              <Button type="submit" className="flex-1">
                {isUpdate ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;

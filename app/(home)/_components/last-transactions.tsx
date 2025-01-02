import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
  className?: string;
}

const LastTransactions = ({
  lastTransactions,
  className,
}: LastTransactionsProps) => {
  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === "DEPOSIT") {
      return "text-primary";
    }
    if (transaction.type === "EXPENSE") {
      return "text-red-500";
    }
    if (transaction.type === "INVESTMENT") {
      return "text-white";
    }
  };

  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.type === "DEPOSIT") {
      return "+";
    }

    if (transaction.type === "EXPENSE") {
      return "-";
    }

    if (transaction.type === "INVESTMENT") {
      return "-";
    }
  };

  return (
    <ScrollArea className={`rounded-md border ${className}`}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Últimas transações</CardTitle>
        <Button variant={"outline"} className="rounded-full font-bold" asChild>
          <Link href={"/transactions"}>Ver todas</Link>
        </Button>
      </CardHeader>

      <CardContent
        className={`space-y-6 ${className === "inline min-sm:hidden" && "h-[500px] overflow-y-auto"}`}
      >
        {lastTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white bg-opacity-[3%] p-3">
                <Image
                  src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                  alt={transaction.paymentMethod.toLocaleLowerCase()}
                  width={24}
                  height={24}
                />
              </div>

              <div>
                <p className="text-sm font-bold">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
              {getAmountPrefix(transaction)}
              {transaction.paymentMethod === "CREDIT_CARD"
                ? formatCurrency(
                    Number(transaction.amount) /
                      Number(transaction.installments),
                  )
                : formatCurrency(Number(transaction.amount))}
            </p>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default LastTransactions;

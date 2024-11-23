import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT)
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-1 fill-primary" size={10} />
        Depósito
      </Badge>
    );

  if (transaction.type === TransactionType.EXPENSE)
    return (
      <Badge className="bg-danger bg-opacity-10 font-bold text-danger hover:bg-danger hover:bg-opacity-10">
        <CircleIcon className="mr-1 fill-destructive" size={10} />
        Despesa
      </Badge>
    );

  if (transaction.type === TransactionType.INVESTMENT)
    return (
      <Badge className="bg-white bg-opacity-10 font-bold text-white hover:bg-white hover:bg-opacity-10">
        <CircleIcon className="mr-1 fill-white" size={10} />
        Investimento
      </Badge>
    );
};

export default TransactionTypeBadge;

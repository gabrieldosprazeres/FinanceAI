"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
  className?: string;
}

const AddTransactionButton = ({
  userCanAddTransaction,
  className,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {!userCanAddTransaction && (
              <p>
                Você atingiu o limite de transações gratuitas. Atualize seu
                plano para criar transações ilimitadas.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </div>
  );
};

export default AddTransactionButton;

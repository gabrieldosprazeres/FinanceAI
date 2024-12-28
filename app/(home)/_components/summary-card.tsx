import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  amount: number;
  size?: "small" | "medium" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  return (
    <Card className={`${size === "large" ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          {icon}
          <p
            className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
          >
            {title}
          </p>
        </div>

        {size === "large" && (
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransaction}
            className="hidden max-sm:inline"
          />
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransaction}
            className="inline max-sm:hidden"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

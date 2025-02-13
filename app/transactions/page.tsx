import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transcationColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const TransactionsPage = async () => {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <div className="flex-1 overflow-x-auto">
          <DataTable
            columns={transcationColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;

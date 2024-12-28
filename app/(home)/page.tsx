import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) redirect(`/?month=${new Date().getMonth() + 1}`);

  const dashboard = await getDashboard(month);

  const userCanAddTransaction = await canUserAddTransaction();

  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-4 overflow-hidden p-4 sm:space-y-6 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <div className="flex flex-row items-end justify-between space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user?.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto sm:h-full sm:gap-6 lg:grid lg:grid-cols-[2fr,1fr] min-sm:max-h-[calc(100vh-150px)]">
          <div className="flex flex-col gap-4 sm:gap-6">
            <SummaryCards
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="flex flex-col gap-4 sm:h-full sm:gap-6 md:grid md:grid-cols-3 lg:grid-cols-3">
              <TransactionsPieChart
                {...JSON.parse(JSON.stringify(dashboard))}
              />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
            <LastTransactions
              lastTransactions={dashboard.lastTransactions}
              className="inline min-sm:hidden"
            />
          </div>
          <LastTransactions
            lastTransactions={dashboard.lastTransactions}
            className="inline max-sm:hidden"
          />
        </div>
      </div>
    </>
  );
};

export default Home;

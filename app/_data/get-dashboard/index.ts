import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const selectedDate = new Date(new Date().getFullYear(), Number(month) - 1, 1);

  const where = {
    userId,
    date: {
      gte: startOfMonth(selectedDate),
      lte: endOfMonth(selectedDate),
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: {
          amount: true,
        },
      })
    )?._sum?.amount,
  );

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: {
          amount: true,
        },
      })
    )?._sum?.amount,
  );

  const allExpenses = await db.transaction.findMany({
    where: { userId, type: "EXPENSE" },
  });

  const expensesTotal = allExpenses.reduce((total, expense) => {
    if (
      expense.installments &&
      expense.paymentMethod === "CREDIT_CARD" &&
      expense.installments > 1
    ) {
      const purchaseDate = new Date(expense.date);
      for (let i = 0; i < expense.installments; i++) {
        const installmentDate = addMonths(purchaseDate, i);
        if (
          installmentDate.getFullYear() === selectedDate.getFullYear() &&
          installmentDate.getMonth() === selectedDate.getMonth()
        ) {
          total += Number(expense.amount) / expense.installments;
        }
      }
      return total;
    }
    if (
      new Date(expense.date).getFullYear() === selectedDate.getFullYear() &&
      new Date(expense.date).getMonth() === selectedDate.getMonth()
    ) {
      return total + Number(expense.amount);
    }
    return total;
  }, 0);

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  const transactionsTotal = depositsTotal + investmentsTotal + expensesTotal;

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
    ),

    [TransactionType.EXPENSE]: Math.round(
      (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
    ),

    [TransactionType.INVESTMENT]: Math.round(
      (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = [];

  allExpenses.forEach((expense) => {
    if (
      expense.installments &&
      expense.paymentMethod === "CREDIT_CARD" &&
      expense.installments > 1
    ) {
      const purchaseDate = new Date(expense.date);
      for (let i = 0; i < expense.installments; i++) {
        const installmentDate = addMonths(purchaseDate, i);
        if (
          installmentDate.getFullYear() === selectedDate.getFullYear() &&
          installmentDate.getMonth() === selectedDate.getMonth()
        ) {
          const category = totalExpensePerCategory.find(
            (cat) => cat.category === expense.category,
          );
          if (category) {
            category.totalAmount +=
              Number(expense.amount) / expense.installments;
          } else {
            totalExpensePerCategory.push({
              category: expense.category,
              totalAmount: Number(expense.amount) / expense.installments,
              percentageOfTotal: 0,
            });
          }
        }
      }
    } else if (
      new Date(expense.date).getFullYear() === selectedDate.getFullYear() &&
      new Date(expense.date).getMonth() === selectedDate.getMonth()
    ) {
      const category = totalExpensePerCategory.find(
        (cat) => cat.category === expense.category,
      );
      if (category) {
        category.totalAmount += Number(expense.amount);
      } else {
        totalExpensePerCategory.push({
          category: expense.category,
          totalAmount: Number(expense.amount),
          percentageOfTotal: 0,
        });
      }
    }
  });

  totalExpensePerCategory.forEach((category) => {
    category.percentageOfTotal = Math.round(
      (category.totalAmount / expensesTotal) * 100,
    );
  });

  const allTransactions = await db.transaction.findMany({
    where: { userId },
    orderBy: {
      date: "desc",
    },
  });

  const lastTransactions = allTransactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transaction.paymentMethod === "CREDIT_CARD" &&
        transaction.installments &&
        transaction.installments > 1
      ) {
        for (let i = 0; i < transaction.installments; i++) {
          const installmentDate = addMonths(transactionDate, i);
          if (
            installmentDate.getFullYear() === selectedDate.getFullYear() &&
            installmentDate.getMonth() === selectedDate.getMonth()
          ) {
            return true;
          }
        }
        return false;
      } else {
        return (
          transactionDate.getFullYear() === selectedDate.getFullYear() &&
          transactionDate.getMonth() === selectedDate.getMonth()
        );
      }
    })
    .slice(0, 15);

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};

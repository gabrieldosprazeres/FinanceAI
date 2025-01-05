"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

const DUMMY_REPORT =
  "Relatório genérico para fallback. Verifique a chave de API.";

export const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  // const user = await clerkClient().users.getUser(userId);

  // const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  // if (!hasPremiumPlan)
  //   throw new Error("You need a premium plan to generate AI reports");

  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DUMMY_REPORT;
  }

  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const startDate = new Date(new Date().getFullYear(), Number(month) - 1, 1);
  const endDate = new Date(new Date().getFullYear(), Number(month), 0);

  const transactions = await db.transaction.findMany({
    where: {
      OR: [
        {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        {
          AND: [
            {
              date: {
                lt: startDate,
              },
            },
            {
              installments: {
                gte: 1,
              },
            },
          ],
        },
      ],
    },
  });

  const filteredTransactions = transactions.flatMap((transaction) => {
    const installmentValue = transaction.installments
      ? Number(transaction.amount) / transaction.installments
      : transaction.amount;

    if (transaction.date >= startDate && transaction.date < endDate) {
      if (
        transaction.installments &&
        transaction.paymentMethod === "CREDIT_CARD" &&
        transaction.installments > 1
      ) {
        return Array.from({ length: transaction.installments }, (_, i) => ({
          ...transaction,
          amount: installmentValue,
          date: new Date(
            transaction.date.getFullYear(),
            transaction.date.getMonth() + i,
            1,
          ),
        })).filter((t) => t.date >= startDate && t.date < endDate);
      }
      return [transaction];
    }

    const installmentMonth = Math.ceil(
      (startDate.getTime() - transaction.date.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );

    if (
      transaction.installments !== null &&
      installmentMonth <= transaction.installments
    ) {
      return [
        {
          ...transaction,
          amount: installmentValue,
        },
      ];
    }

    return [];
  });

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalInvestments = filteredTransactions
    .filter((t) => t.type === "INVESTMENT")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses - totalInvestments;

  const content = `
    Gere um relatório detalhado com insights sobre minhas finanças e ofereça dicas práticas de como melhorar minha vida financeira.
    Certifique-se de utilizar o formato a seguir para os insights e organize o texto para que o leitor possa navegar com facilidade.

    Aqui estão as informações gerais:
    - Total de Receitas: R$ ${totalIncome.toFixed(2)}
    - Total de Despesas: R$ ${totalExpenses.toFixed(2)}
    - Total de Investimentos: R$ ${totalInvestments.toFixed(2)}
    - Saldo: R$ ${balance.toFixed(2)}
    
    
    As transações estão divididas por linha no formato {DATA}-{TIPO}-{CATEGORIA}-{VALOR}. São elas:
    ${filteredTransactions
      .map(
        (transaction) =>
          `${transaction.date.toLocaleDateString("pt-BR")}-${transaction.type}-${transaction.category}-R$ ${transaction.amount.toFixed(2)}`,
      )
      .join("\n")}

    Além disso, não quero que você traga dados assim: "| Categoria | Montante (R$) | |-------------------|---------------| | TRANSPORTATION | R$ 47.00 | | EDUCATION | R$ 1186.58 |" para o usuário, é feio e ilegível e que a cor do texto seja sempre branco.

    Por favor, me ajude a entender melhor minha situação financeira e a melhorar meus hábitos de consumo.
  `;

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão financeira e organização de finanças pessoais. Sua função é ajudar as pessoas a entenderem e organizarem melhor suas finanças.",
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return completion.choices[0].message.content;
};

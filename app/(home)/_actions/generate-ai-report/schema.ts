import { z } from "zod";

export const generateAiReportSchema = z.object({
  month: z.string().regex(/^(0[1-9]|1[0-2])$/),
});

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;

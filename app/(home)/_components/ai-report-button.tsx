"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { generateAiReport } from "../_actions/generate-ai-report";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import Markdown from "react-markdown";

interface AiReportButtonProps {
  // hasPremiumPlan: boolean;
  month: string;
}

const AiReportButton = ({ month }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const aiReport = await generateAiReport({ month });
      setReport(aiReport);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-primary-foreground hover:bg-primary"
        >
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-sm:max-w-[375px]">
        <>
          <DialogHeader>
            <DialogTitle>Relatório IA</DialogTitle>
            <DialogDescription>
              Use inteligência artificial para gerar um relatório detalhado com
              insights sobre suas finanças.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
            <Markdown>{report}</Markdown>
          </ScrollArea>

          <DialogFooter className="flex flex-row justify-center space-x-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 hover:bg-primary">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              onClick={handleGenerateReportClick}
              disabled={reportIsLoading}
              className="flex-1"
            >
              {reportIsLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Gerar relatório"
              )}
            </Button>
          </DialogFooter>
        </>
        {/* {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório detalhado
                com insights sobre suas finanças.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              <Markdown>{report}</Markdown>
            </ScrollArea>

            <DialogFooter className="flex flex-row justify-center space-x-4">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 hover:bg-primary">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                onClick={handleGenerateReportClick}
                disabled={reportIsLoading}
                className="flex-1"
              >
                {reportIsLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Gerar relatório"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar realtórios com IA.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>

              <Button asChild>
                <Link href={"/subscription"}>Assinar</Link>
              </Button>
            </DialogFooter>
          </>
        )} */}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;

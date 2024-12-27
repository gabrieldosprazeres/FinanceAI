import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RequestResetPassword from "./_components/request-reset-password";

const ResetPasswordPage = async () => {
  const { userId } = await auth();

  if (userId) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RequestResetPassword />
    </div>
  );
};

export default ResetPasswordPage;

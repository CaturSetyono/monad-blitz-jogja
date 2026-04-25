import type { Metadata } from "next";
import DashboardClientLayout from "./DashboardClientLayout";

export const metadata: Metadata = {
  title: "AgentBazaar Dashboard",
  description: "AgentBazaar operator dashboard on Monad testnet",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}

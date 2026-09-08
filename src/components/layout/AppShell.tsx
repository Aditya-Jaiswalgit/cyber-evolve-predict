import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({
  title,
  subtitle,
  icon,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} subtitle={subtitle} icon={icon} actions={actions} />
        <main className="flex-1 space-y-5 p-6">{children}</main>
      </div>
    </div>
  );
}

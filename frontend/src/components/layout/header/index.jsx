import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:hidden bg-sidebar">
        <SidebarTrigger className="bg-gray-200 hover:bg-gray-300 border border-border" />
        <h1 className="font-semibold text-lg m-0 text-foreground">SGA</h1>
      </header>
      <header className="hidden sm:flex sticky top-0 z-30 h-14 items-center gap-4 px-4">
        <SidebarTrigger className="border bg-gray-200 hover:bg-gray-400" />
      </header>
    </>
  );
}

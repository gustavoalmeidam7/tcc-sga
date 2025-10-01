import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "./components/layout/footer/footer";
import "./index.css";
import { AppSidebar } from "./components/layout/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { appRoutes } from "./routes";
import LoadingSpinner from "@/components/layout/loading";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {appRoutes.map((route, index) =>
          route.children ? (
            <Route key={index} element={route.element}>
              {route.children.map((child, i) => (
                <Route key={i} path={child.path} element={child.element} />
              ))}
            </Route>
          ) : (
            <Route key={index} path={route.path} element={route.element} />
          )
        )}
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <OfflineIndicator />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen justify-between">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:hidden bg-sidebar">
                <SidebarTrigger className="bg-gray-200 hover:bg-gray-300 border border-border" />
                <h1 className="font-semibold text-lg m-0 text-foreground">SGA</h1>
              </header>
              <header className="hidden sm:flex sticky top-0 z-30 h-14 items-center gap-4 px-4">
                <SidebarTrigger className="border bg-gray-200 hover:bg-gray-400" />
              </header>
              <main className="flex-grow p-4 md:p-6">
                <Suspense fallback={<LoadingSpinner size="large" text="Carregando..." />}>
                  <AppRoutes />
                </Suspense>
              </main>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Footer from "./components/layout/footer/footer";
import "./index.css";
import { AppSidebar } from "./components/layout/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { appRoutes } from "./routes";
import LoadingSpinner from "@/components/layout/loading";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

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
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <OfflineIndicator />
            <Toaster position="top-right" richColors closeButton />
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex flex-col min-h-screen justify-between">
                <Header />
                <main className="flex-grow p-4 md:p-6">
                  <Suspense fallback={<LoadingSpinner size="large" text="Carregando..." />}>
                    <AppRoutes />
                  </Suspense>
                </main>
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

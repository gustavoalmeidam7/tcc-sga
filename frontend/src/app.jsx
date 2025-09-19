import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/layout/footer'
import './index.css'
import { AppSidebar } from './components/layout/sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar'

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Registro = lazy(() => import('./pages/Register'));
const Ambulancias = lazy(() => import('./pages/Gerenciar_ambulancias'));
const Usuarios = lazy(() => import('./pages/Gerenciar_usuario'));
const Viagens = lazy(() => import('./pages/Viagens'));
const RecSenha = lazy(() => import('./pages/Rec_senha'));
const SaibaMais = lazy(() => import('./pages/Saiba_mais'));
const Suporte = lazy(() => import('./pages/Suporte'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <p>Carregando...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/ambulancias" element={<Ambulancias />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/viagens" element={<Viagens />} />
                <Route path="/rec_senha" element={<RecSenha />} />
                <Route path="/saiba-mais" element={<SaibaMais />} />
                <Route path="/suporte" element={<Suporte />} />
                <Route path="*" element={<div>404 - Página não encontrada</div>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}
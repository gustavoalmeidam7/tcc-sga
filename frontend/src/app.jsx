import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Register';
import Ambulancias from './pages/Gerenciar_ambulancias';
import Usuarios from './pages/Gerenciar_usuario';
import Viagens from './pages/Viagens';
import RecSenha from './pages/Rec_senha';
import SaibaMais from './pages/Saiba_mais';
import Suporte from './pages/Suporte';
import './index.css';
import { AppSidebar } from './components/sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-h-screen justify-between">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:hidden bg-sidebar">
            <SidebarTrigger className="bg-gray-200 hover:bg-gray-400" />
            <h1 className="font-semibold text-lg m-0">SGA</h1>
          </header>
          <header className="hidden sm:flex sticky top-0 z-30 h-14 items-center gap-4 px-4">
            <SidebarTrigger className="border bg-gray-200 hover:bg-gray-400" />
          </header>
          <main className="flex-grow p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Home />} />
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
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}
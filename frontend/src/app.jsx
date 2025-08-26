import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Register'
import Ambulancias from './pages/Gerenciar_ambulancias'
import Usuarios from './pages/Gerenciar_usuario'
import Viagens from './pages/Viagens'
import RecSenha from './pages/Rec_senha'
import SaibaMais from './pages/Saiba_mais'
import Suporte from './pages/Suporte'
import './index.css'
import { Sidebar } from './components/sidebar'

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
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
      <Footer />
    </BrowserRouter>
  )
}


import React, { lazy } from "react"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Registro = lazy(() => import("./pages/Register"))
const Ambulancias = lazy(() => import("./pages/Gerenciar_ambulancias"))
const Usuarios = lazy(() => import("./pages/Gerenciar_usuario"))
const Viagens = lazy(() => import("./pages/Viagens"))
const RecSenha = lazy(() => import("./pages/Rec_senha"))
const SaibaMais = lazy(() => import("./pages/Saiba_mais"))
const Suporte = lazy(() => import("./pages/Suporte"))

export const appRoutes = [
  { path: "/", element: <Home />, label: "Dashboard" },
  { path: "/login", element: <Login />, label: "Login" },
  { path: "/registro", element: <Registro />, label: "Registro" },
  { path: "/rec_senha", element: <RecSenha />, label: "Recuperar Senha" },
  { path: "/saiba-mais", element: <SaibaMais />, label: "Saiba Mais" },
  { path: "/suporte", element: <Suporte />, label: "Suporte" },
  { path: "/home", element: <Home />, label: "Dashboard" },
  { path: "/ambulancias", element: <Ambulancias />, label: "Gerenciar Ambulâncias" },
  { path: "/usuarios", element: <Usuarios />, label: "Gerenciar Usuários" },
  { path: "/viagens", element: <Viagens />, label: "Viagens" },
    

  { path: "*", element: <div>404 - Página não encontrada</div>, label: "Página Não Encontrada" },
]

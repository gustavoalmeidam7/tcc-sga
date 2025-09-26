import React, { lazy } from "react"
import { PrivateRoute } from "@/components/PrivateRoute"

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
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/registro", element: <Registro /> },
  { path: "/rec_senha", element: <RecSenha /> },
  { path: "/saiba-mais", element: <SaibaMais /> },
  { path: "/suporte", element: <Suporte /> },

  {
    element: <PrivateRoute />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/ambulancias", element: <Ambulancias /> },
      { path: "/usuarios", element: <Usuarios /> },
      { path: "/viagens", element: <Viagens /> },
    ],
  },

  { path: "*", element: <div>404 - Página não encontrada</div> },
]

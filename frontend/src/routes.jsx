import React, { lazy } from "react";
import PrivateRoute from "./components/PrivateRoute";
import AnimatedPage from "./components/ui/animated-page";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Registro = lazy(() => import("./pages/Register"));
const Ambulancias = lazy(() => import("./pages/Gerenciar_ambulancias"));
const Usuarios = lazy(() => import("./pages/Gerenciar_usuario"));
const Viagens = lazy(() => import("./pages/Viagens"));
const RecSenha = lazy(() => import("./pages/Rec_senha"));
const SaibaMais = lazy(() => import("./pages/Saiba_mais"));
const Suporte = lazy(() => import("./pages/Suporte"));
const Agendamentos = lazy(() => import("./pages/Agendamentos"));

export const appRoutes = [
  { path: "/", element: <AnimatedPage><LandingPage /></AnimatedPage>, label: "Landing Page" },
  { path: "/login", element: <AnimatedPage><Login /></AnimatedPage>, label: "Login" },
  { path: "/registro", element: <AnimatedPage><Registro /></AnimatedPage>, label: "Registro" },
  { path: "/rec_senha", element: <AnimatedPage><RecSenha /></AnimatedPage>, label: "Recuperar Senha" },
  { path: "/saiba-mais", element: <AnimatedPage><SaibaMais /></AnimatedPage>, label: "Saiba Mais" },
  { path: "/suporte", element: <AnimatedPage><Suporte /></AnimatedPage>, label: "Suporte" },

  { path: "/home", element: <PrivateRoute><AnimatedPage><Home /></AnimatedPage></PrivateRoute>, label: "Dashboard" },
  { path: "/ambulancias", element: <PrivateRoute><AnimatedPage><Ambulancias /></AnimatedPage></PrivateRoute>, label: "Gerenciar Ambulâncias" },
  { path: "/usuarios", element: <PrivateRoute><AnimatedPage><Usuarios /></AnimatedPage></PrivateRoute>, label: "Gerenciar Usuários" },
  { path: "/viagens", element: <PrivateRoute><AnimatedPage><Viagens /></AnimatedPage></PrivateRoute>, label: "Viagens" },
  { path: "/agendamentos", element: <PrivateRoute><AnimatedPage><Agendamentos /></AnimatedPage></PrivateRoute>, label: "Agendamentos" },

  
  { path: "*", element: <AnimatedPage><div>404 - Página não encontrada</div></AnimatedPage>, label: "Página Não Encontrada" },
];
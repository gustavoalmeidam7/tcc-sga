import React, { lazy } from "react";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import AnimatedPage from "./components/ui/animated-page";
import { ROLES } from "./lib/roles";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Registro = lazy(() => import("./pages/Register"));
const Ambulancias = lazy(() => import("./pages/Gerenciar_ambulancias"));
const Usuarios = lazy(() => import("./pages/Gerenciar_usuario"));
const Viagens = lazy(() => import("./pages/Viagens"));
const DetalhesViagem = lazy(() =>
  import("./pages/Detalhes/viagem/DetalhesViagem")
);
const DetalhesUsuario = lazy(() =>
  import("./pages/Detalhes/user/DetalhesUsuario")
);
const Agendamentos = lazy(() => import("./pages/Agendamentos"));
const Historico = lazy(() => import("./pages/Historico"));
const Perfil = lazy(() => import("./pages/Perfil"));
const RecSenha = lazy(() => import("./pages/Rec_senha"));
const SaibaMais = lazy(() => import("./pages/Saiba_mais"));
const Suporte = lazy(() => import("./pages/Suporte"));
const Termos = lazy(() => import("./pages/Termos"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const appRoutes = [
  {
    path: "/",
    element: (
      <AnimatedPage>
        <LandingPage />
      </AnimatedPage>
    ),
    label: "Landing Page",
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AnimatedPage>
          <Login />
        </AnimatedPage>
      </PublicRoute>
    ),
    label: "Login",
  },
  {
    path: "/registro",
    element: (
      <PublicRoute>
        <AnimatedPage>
          <Registro />
        </AnimatedPage>
      </PublicRoute>
    ),
    label: "Registro",
  },
  {
    path: "/rec_senha",
    element: (
      <PublicRoute>
        <AnimatedPage>
          <RecSenha />
        </AnimatedPage>
      </PublicRoute>
    ),
    label: "Recuperar Senha",
  },
  {
    path: "/saiba-mais",
    element: (
      <AnimatedPage>
        <SaibaMais />
      </AnimatedPage>
    ),
    label: "Saiba Mais",
  },
  {
    path: "/suporte",
    element: (
      <AnimatedPage>
        <Suporte />
      </AnimatedPage>
    ),
    label: "Suporte",
  },
  {
    path: "/termos",
    element: (
      <AnimatedPage>
        <Termos />
      </AnimatedPage>
    ),
    label: "Termos e Condições",
  },

  {
    path: "/home",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <Home />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Dashboard",
  },
  {
    path: "/ambulancias",
    element: (
      <RoleBasedRoute requiredRole={ROLES.DRIVER}>
        <AnimatedPage>
          <Ambulancias />
        </AnimatedPage>
      </RoleBasedRoute>
    ),
    label: "Gerenciar Ambulâncias",
  },
  {
    path: "/usuarios",
    element: (
      <RoleBasedRoute requiredRole={ROLES.MANAGER}>
        <AnimatedPage>
          <Usuarios />
        </AnimatedPage>
      </RoleBasedRoute>
    ),
    label: "Gerenciar Usuários",
  },
  {
    path: "/viagens",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <Viagens />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Viagens",
  },
  {
    path: "/viagens/detalhes/:id",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <DetalhesViagem />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Detalhes da Viagem",
  },
  {
    path: "/usuarios/detalhes/:userId",
    element: (
      <RoleBasedRoute requiredRole={ROLES.DRIVER}>
        <AnimatedPage>
          <DetalhesUsuario />
        </AnimatedPage>
      </RoleBasedRoute>
    ),
    label: "Detalhes do Usuário",
  },
  {
    path: "/agendamentos",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <Agendamentos />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Meus Agendamentos",
  },
  {
    path: "/historico",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <Historico />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Histórico de Viagens",
  },
  {
    path: "/perfil",
    element: (
      <PrivateRoute>
        <AnimatedPage>
          <Perfil />
        </AnimatedPage>
      </PrivateRoute>
    ),
    label: "Meu Perfil",
  },

  {
    path: "*",
    element: (
      <AnimatedPage>
        <NotFound />
      </AnimatedPage>
    ),
    label: "Página Não Encontrada",
  },
];

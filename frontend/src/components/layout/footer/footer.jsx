import React from "react";
import { Link } from "react-router-dom";
import { Activity, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">SGA</span>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              | Sistema de Gestão de Ambulâncias
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/saiba-mais"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Saiba Mais
            </Link>
            <Link
              to="/suporte"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Suporte
            </Link>
            <Link
              to="/termos"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <a
              href="tel:1134567890"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Phone className="h-3.5 w-3.5" />
              (16) 3333-4444
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            ©{currentYear} SGA
          </div>
        </div>
      </div>
    </footer>
  );
}

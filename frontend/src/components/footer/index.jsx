import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full p-4 flex justify-center text-base text-muted-foreground">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 max-w-7xl w-full">
        <small className="text-center sm:text-left">
          ©2025 SGA. Todos os direitos reservados.
        </small>
        <div className="flex space-x-4 text-sm">
          <Link to="/saiba-mais" className="hover:text-primary transition-colors">
            Saiba Mais
          </Link>
          <Link to="/suporte" className="hover:text-primary transition-colors">
            Suporte
          </Link>
        </div>
      </div>
    </footer>
  );
}
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import img_logo from "@/assets/Logo.webp";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={img_logo}
              alt="SGA Logo"
              className="h-12 md:h-14 w-auto object-contain"
            />
            <span className="font-bold text-xl md:text-2xl text-primary">
              SGA
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/saiba-mais"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Saiba Mais
            </Link>
            <Link
              to="/suporte"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Suporte
            </Link>
            <Link
              to="/termos"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Termos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

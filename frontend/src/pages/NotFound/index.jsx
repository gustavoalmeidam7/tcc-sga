import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="text-8xl font-bold text-primary">404</div>
            </motion.div>
            <CardTitle className="text-2xl">Página Não Encontrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {isAuthenticated ? (
                <Button
                  className="flex-1"
                  onClick={() => navigate("/home")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Início
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Fazer Login
                </Button>
              )}
            </div>

            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  Use o menu lateral para navegar
                </p>
              ) : (
                <div className="text-sm text-center space-y-2">
                  <p className="text-muted-foreground">
                    Você pode:
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate("/")}
                    >
                      Voltar à página inicial
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate("/saiba-mais")}
                    >
                      Saber mais sobre o SGA
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

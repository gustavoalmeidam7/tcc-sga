import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import img_logo from "@/assets/Logo.png";

export function RegisterForm({
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6 max-w-5xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crie sua Conta</h1>
                <p className="text-muted-foreground text-balance">
                  Insira seus dados para se cadastrar na plataforma SGA.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone_number">Telefone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="birthday">Data de Nascimento</Label>
                <Input
                  id="birthday"
                  type="date"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit" className="w-full mt-2">
                Cadastrar
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-2">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Já Possui Conta?
                </span>
              </div>
              <div className="text-center text-sm mt-1">
                Faça o login.{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={img_logo}
              alt="Imagem de Cadastro"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
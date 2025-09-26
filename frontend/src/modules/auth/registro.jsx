import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import img_logo from '@/assets/Logo_Maior.webp'

const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome de usuário deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  cpf: z.string().min(11, { message: 'O CPF deve ter 11 dígitos.' }),
  telefone: z.string().min(10, { message: 'Insira um número de telefone válido.' }),
  nascimento: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Insira uma data de nascimento válida.' }),
  senha: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.senha === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
})

export function RegisterForm({ className, ...props }) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const userData = { ...values }
      delete userData.confirmPassword
      await register(userData)
      setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.')
      
      setTimeout(() => { navigate('/login') }, 500)

    } catch (err) {
      if (err.response?.data?.Erros) {
        setError(err.response.data.Erros.join(', '))
      } else {
        setError('Ocorreu um erro durante o cadastro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-5xl mx-auto', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid md:grid-cols-2">
          <div className="p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-foreground">Crie sua Conta</h1>
                  <p className="text-muted-foreground text-balance">
                    Insira seus dados para se cadastrar na plataforma SGA.
                  </p>
                </div>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}

                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Nome de Usuário</FormLabel>
                    <FormControl><Input placeholder="Seu nome de usuário" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">CPF</FormLabel>
                    <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Telefone</FormLabel>
                    <FormControl><Input type="tel" placeholder="(00) 00000-0000" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nascimento" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Data de Nascimento</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="senha" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Senha</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel className="text-foreground">Confirmar Senha</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage className="text-destructive-foreground" />
                  </FormItem>
                )} />

                <div className="mt-4 flex flex-col gap-2">
                  <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                  
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-2">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">Já Possui Conta?</span>
                  </div>

                  <div className="text-center text-sm mt-1">
                    Faça o login.{" "}
                    <Link to="/login" className="underline text-primary-foreground">
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-muted relative hidden md:flex items-center justify-center">
            <img
              src={img_logo}
              alt="Imagem de Cadastro"
              className="h-full w-full "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

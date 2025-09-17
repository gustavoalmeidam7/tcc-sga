'use client'

import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import img_logo from '@/assets/Logo.webp'

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
})

export function LoginForm({ className, ...props }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values) {
    setLoading(true)
    setError(null)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid md:grid-cols-2">
          <div className="p-10 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-foreground">Bem Vindo de Volta</h1>
                  <p className="text-muted-foreground text-balance">Realize login com sua conta SGA</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <div className="flex items-center">
                        <FormLabel className="text-foreground">Senha</FormLabel>
                        <Link
                          to="/rec_senha"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive-foreground" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Login'}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Não possui conta?
                  </span>
                </div>

                <div className="text-center text-sm">
                  Venha fazer parte?{' '}
                  <Link to="/registro" className="underline underline-offset-4">
                    Cadastre-se
                  </Link>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-muted relative hidden md:block">
            <img
              src={img_logo}
              alt="Imagem de Login"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

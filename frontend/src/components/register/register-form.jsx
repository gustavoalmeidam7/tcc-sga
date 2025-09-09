'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import img_logo from '@/assets/Logo.png'

const formSchema = z.object({
  username: z.string().min(2, { message: 'O nome de usuário deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  cpf: z.string().min(11, { message: 'O CPF deve ter 11 dígitos.' }),
  phone_number: z.string().min(10, { message: 'Insira um número de telefone válido.' }),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Insira uma data de nascimento válida.' }),
  password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

export function RegisterForm({ className, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      cpf: '',
      phone_number: '',
      birthday: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values) {
    delete values.confirmPassword;
    console.log('Valores validados para envio:', values);
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-5xl mx-auto', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Crie sua Conta</h1>
                  <p className="text-muted-foreground text-balance">
                    Insira seus dados para se cadastrar na plataforma SGA.
                  </p>
                </div>

                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Nome de Usuário</FormLabel><FormControl><Input placeholder="Seu nome de usuário" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>CPF</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone_number" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Telefone</FormLabel><FormControl><Input type="tel" placeholder="(00) 00000-0000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="birthday" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem className="grid gap-3"><FormLabel>Confirmar Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="mt-4 flex flex-col gap-2">
                  <Button type="submit" className="w-full mt-2">Cadastrar</Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-2">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">Já Possui Conta?</span>
                  </div>
                  <div className="text-center text-sm mt-1">
                    Faça o login.{" "}
                    <Link to="/login" className="underline underline-offset-4">Login</Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img src={img_logo} alt="Imagem de Cadastro" className="absolute inset-0 h-full w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

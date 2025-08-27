import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

function Home() {
  return (
    <main className="w-full flex items-center justify-center bg-gray-50 p-6 text-xl">
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 font-normal">
        <Card className="p-5 rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle>Página Inicial</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Bem-vindo ao sistema de gerenciamento de ambulâncias.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="p-5 rounded-xl shadow-xl">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Atalhos rápidos: cadastrar paciente, agendar viagens, gerenciar ambulâncias.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default Home









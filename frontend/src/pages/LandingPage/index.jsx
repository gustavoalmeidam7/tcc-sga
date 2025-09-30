import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Home from "@/pages/Home"

function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Home />;
  }

  return (
    <>
      <main>
        <section className="mx-auto mt-20 max-w-xl">
            <Card className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Futura Landing Page</h1>
                    <Link to="/login">
                    <Button>Sai fora curioso</Button>
                    </Link>
            </Card>
        </section>
      </main>
    </>
  )
}

export default LandingPage;

import { Link } from "react-router-dom"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@components/components/ui/navigation-menu"

function Header() {
    return (
        <header className="bg-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
            <Link to="/">
                <img
                    src="/logo.svg" alt="logo" className="h-9 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
                />
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/login" className="text-black font-semibold">Iniciar Sessão</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/viagens" className="text-black font-semibold">Viagens</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/ambulancias" className="text-black font-semibold">Ambulâncias</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/usuarios" className="text-black font-semibold">Usuários</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/saiba-mais" className="text-black font-semibold">Saiba Mais</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/suporte" className="text-black font-semibold">Suporte</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}

export default Header;
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Disc, Home } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/",
            label: "Home",
            icon: Home,
            active: pathname === "/",
        },
        {
            href: "/team-builder",
            label: "Team Builder",
            icon: Users,
            active: pathname === "/team-builder",
        },
        {
            href: "/wheel",
            label: "Wheel",
            icon: Disc,
            active: pathname === "/wheel",
        },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="font-bold text-white">TS</span>
                    </div>
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Team Sync
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                                route.active ? "text-white" : "text-white/60"
                            )}
                        >
                            <route.icon className="size-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

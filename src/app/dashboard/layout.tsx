"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, FileText, Users, Clock, Home, LogOut, Settings, Search } from "lucide-react"
import Image from "next/image"

interface DashboardLayoutProps {
	children: React.ReactNode
	currentUser: { role: string; username: string }
	activeModule: string
	onModuleChange: (module: string) => void
	onLogout: () => void
}

export default function DashboardLayout({
	children,
	currentUser = { role: "guest", username: "guest" },
	activeModule,
	onModuleChange,
	onLogout,
}: DashboardLayoutProps) {
	const navigation = [
		{
			name: "Resumen",
			id: "overview",
			icon: Home,
			roles: ["admin", "manager", "employee", "auditor"],
		},
		{
			name: "Gestión de archivos",
			id: "files",
			icon: FileText,
			roles: ["admin", "manager", "employee", "auditor"],
		},
		{ name: "Asistencia", id: "attendance", icon: Clock, roles: ["admin", "manager", "employee"] },
		{ name: "Empleados", id: "employees", icon: Users, roles: ["admin", "manager"] },
	]

	const filteredNavigation = navigation.filter((item) =>
		currentUser?.role ? item.roles.includes(currentUser.role) : true
	)

	return (
		<div className="min-h-screen bg-muted/40 dark:bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-muted bg-white/80 backdrop-blur-md backdrop-saturate-150 dark:bg-background/80">
				<div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-6 py-4">
					<div className="flex flex-1 items-center gap-6">
						<div className="flex items-center gap-3">
							<Image src="/logo.svg" alt="IS Logo" width={50} height={50} />
							<div>
								<h1 className="text-lg font-semibold text-foreground">Panel de control</h1>
								<p className="text-xs text-muted-foreground">Gestión de archivos y sistemas de asistencia</p>
							</div>
						</div>
						{/* Search Bar */}
						<div className="hidden flex-1 max-w-md md:block">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Buscar..."
									className="w-full pl-9 bg-background/50 border-muted"
									disabled
								/>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="flex items-center gap-2 rounded-xl hover:bg-muted/50 transition-all duration-150">
									<Avatar className="h-8 w-8">
										<AvatarFallback className="bg-primary/10 text-primary">
											{currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "G"}
										</AvatarFallback>
									</Avatar>
									<div className="hidden text-left md:block">
										<p className="text-sm font-medium text-foreground">{currentUser?.username || "Guest"}</p>
										<p className="text-xs text-muted-foreground">
											{currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : "Usuario"}
										</p>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Perfil</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Configuración
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={onLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									Cerrar sesión
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			<div className="flex">
				{/* Sidebar */}
				<nav className="sticky top-[73px] flex h-[calc(100vh-73px)] w-64 flex-col border-r border-muted bg-white/60 backdrop-blur-sm dark:bg-muted/20">
					<div className="flex-1 p-4">
						<ul className="space-y-1.5">
							{filteredNavigation.map((item) => (
								<li key={item.id}>
									<Button
										variant={activeModule === item.id ? "default" : "ghost"}
										className={`w-full justify-start transition-all duration-150 ${
											activeModule === item.id
												? "rounded-2xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-2"
												: "rounded-xl hover:bg-muted/50 focus-visible:bg-muted/50"
										}`}
										onClick={() => onModuleChange(item.id)}
									>
										<item.icon className="mr-2 h-3.5 w-3.5" />
										<span className="text-sm">{item.name}</span>
									</Button>
								</li>
							))}
						</ul>
					</div>
					{/* Footer Section */}
					<div className="border-t border-muted p-4">
						<div className="space-y-1">
							<p className="text-xs font-medium text-foreground">
								{currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : "Guest"}
							</p>
							<p className="text-xs text-muted-foreground">Entorno de demo</p>
						</div>
					</div>
				</nav>

				{/* Main Content */}
				<main className="flex-1">
					<div className="mx-auto max-w-[1600px] p-6">{children}</div>
				</main>
			</div>
		</div>
	)
}

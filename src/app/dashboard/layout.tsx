"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, FileText, Users, Clock, Home, LogOut, Settings } from "lucide-react"

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

	const filteredNavigation = navigation.filter((item) => currentUser?.role ? item.roles.includes(currentUser.role) : true)

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white shadow-sm">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<Building2 className="h-8 w-8 text-blue-600" />
							<h1 className="text-xl font-bold text-gray-900">DBJ Dashboard</h1>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="flex items-center space-x-2">
									<Avatar className="h-8 w-8">
										<AvatarFallback>{currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
									</Avatar>

									<p className="text-sm font-medium">{currentUser?.username || 'Guest'}</p>
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
				<nav className="min-h-screen w-64 bg-white shadow-sm">
					<div className="p-4">
						<ul className="space-y-2">
							{filteredNavigation.map((item) => (
								<li key={item.id}>
									<Button
										variant={activeModule === item.id ? "default" : "ghost"}
										className="w-full justify-start"
										onClick={() => onModuleChange(item.id)}
									>
										<item.icon className="mr-2 h-4 w-4" />
										{item.name}
									</Button>
								</li>
							))}
						</ul>
					</div>
				</nav>

				{/* Main Content */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	)
}

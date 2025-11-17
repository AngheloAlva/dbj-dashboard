"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, FileText, Clock, Users, TrendingUp, ArrowUp, ArrowDown, File, FileCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "./dashboard/layout"
import FileManagement from "./dashboard/files/page"
import AttendanceTracker from "./dashboard/attendance/page"
import EmployeeManagement from "./dashboard/employees/page"
import { CardContent as CardContentComponent } from "@/components/ui/card"
import { CardTitle as CardTitleComponent } from "@/components/ui/card"
import { CardHeader as CardHeaderComponent } from "@/components/ui/card"
import { Card as CardComponent } from "@/components/ui/card"
import { AttendanceProvider } from "@/contexts/AttendanceContext"
import Image from "next/image"

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [currentUser, setCurrentUser] = useState({ role: "", username: "" })
	const [activeModule, setActiveModule] = useState("overview")

	const handleLogin = (username: string) => {
		setCurrentUser({ role: "admin", username })
		setIsLoggedIn(true)
	}

	const handleLogout = () => {
		setIsLoggedIn(false)
		setCurrentUser({ role: "", username: "" })
		setActiveModule("overview")
	}

	if (!isLoggedIn) {
		return <LoginPage onLogin={handleLogin} />
	}

	return (
		<AttendanceProvider>
			<DashboardLayout
				currentUser={currentUser}
				activeModule={activeModule}
				onModuleChange={setActiveModule}
				onLogout={handleLogout}
			>
				{activeModule === "overview" && <DashboardOverview currentUser={currentUser} />}
				{activeModule === "files" && <FileManagement />}
				{activeModule === "attendance" && <AttendanceTracker />}
				{activeModule === "employees" && <EmployeeManagement />}
			</DashboardLayout>
		</AttendanceProvider>
	)
}

function LoginPage({ onLogin }: { onLogin: (role: string, username: string) => void }) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleLogin = () => {
		if (username && password) {
			onLogin("admin", username)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex w-auto items-center justify-center">
						<Image src="/logo.svg" alt="IS Logo" width={100} height={100} />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">IS Dashboard</CardTitle>
					<CardDescription>Inicia sesión para acceder a tu espacio de trabajo</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="username">Usuario</Label>
						<div className="relative">
							<User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="username"
								placeholder="Ingresa tu usuario"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Contraseña</Label>
						<div className="relative">
							<Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
							<Input
								id="password"
								type="password"
								placeholder="Ingresa tu contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<Button
						onClick={handleLogin}
						className="w-full bg-blue-500"
						disabled={!username || !password}
					>
						Iniciar Sesión
					</Button>
					<div className="text-center text-sm text-gray-600">
						<p>Credenciales de prueba:</p>
						<p>Usuario: demo | Contraseña: demo123</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

function DashboardOverview({ currentUser }: { currentUser: { role: string; username: string } }) {
	const stats = [
		{ title: "Total de archivos", value: "1,234", change: "+12%", trend: "up" },
		{ title: "Revisión pendiente", value: "23", change: "+5%", trend: "up" },
		{ title: "Empleados activos", value: "156", change: "+2%", trend: "up" },
		{ title: "Asistencia diaria", value: "142", change: "91%", trend: "up" },
	]

	const getFileIcon = (fileName: string) => {
		if (fileName.endsWith(".pdf")) return FileText
		if (fileName.endsWith(".docx")) return FileText
		if (fileName.endsWith(".pptx")) return File
		return File
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold text-foreground">Bienvenido, {currentUser.username}!</h1>
				<p className="text-muted-foreground">
					Aquí está lo que está sucediendo en su espacio de trabajo hoy.
				</p>
			</div>

			{/* Stats Grid - 12 columns: 3 cols each on large, 6 cols each on medium, 12 cols on small */}
			<div className="grid grid-cols-12 gap-6">
				{stats.map((stat, index) => {
					const isPositive = stat.trend === "up"
					return (
						<div key={index} className="col-span-12 md:col-span-6 lg:col-span-3">
							<CardComponent className="group rounded-2xl border-muted shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
								<CardHeaderComponent className="flex flex-row items-start justify-between space-y-0 pb-3">
									<div className="space-y-1">
										<CardTitleComponent className="text-xs font-medium text-muted-foreground">
											{stat.title}
										</CardTitleComponent>
										<div className="text-2xl font-bold text-foreground">{stat.value}</div>
									</div>
								</CardHeaderComponent>
								<CardContentComponent className="pt-0">
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											className={`h-5 rounded-full border-0 px-2 text-xs font-medium ${
												isPositive
													? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
													: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
											}`}
										>
											{isPositive ? (
												<ArrowUp className="mr-1 h-3 w-3" />
											) : (
												<ArrowDown className="mr-1 h-3 w-3" />
											)}
											{stat.change}
										</Badge>
										<span className="text-xs text-muted-foreground">desde el mes anterior</span>
									</div>
								</CardContentComponent>
							</CardComponent>
						</div>
					)
				})}
			</div>

			{/* Content Grid - 12 columns: 6 cols each on large, 12 cols on small */}
			<div className="grid grid-cols-12 gap-6">
				{/* Actividad reciente de archivos - 6 columns */}
				<div className="col-span-12 lg:col-span-6">
					<CardComponent className="rounded-2xl border-muted shadow-sm transition-all duration-150 hover:shadow-md">
						<CardHeaderComponent>
							<CardTitleComponent className="text-base font-semibold text-foreground">
								Actividad reciente de archivos
							</CardTitleComponent>
						</CardHeaderComponent>
						<CardContentComponent>
							<div className="space-y-3">
								{[
									{ name: "Reporte financiero Q4.pdf", action: "Subido", time: "2 horas atrás" },
									{ name: "Manual de empleado.docx", action: "Revisado", time: "4 horas atrás" },
									{ name: "Propuesta de proyecto.pptx", action: "Aprobado", time: "1 día atrás" },
								].map((activity, index) => {
									const FileIcon = getFileIcon(activity.name)
									return (
										<div key={index} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
												<FileIcon className="h-4 w-4" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-foreground truncate">{activity.name}</p>
												<p className="text-xs text-muted-foreground">
													{activity.action} • {activity.time}
												</p>
											</div>
										</div>
									)
								})}
							</div>
						</CardContentComponent>
					</CardComponent>
				</div>

				{/* Resumen de asistencia - 6 columns */}
				<div className="col-span-12 lg:col-span-6">
					<CardComponent className="rounded-2xl border-muted shadow-sm transition-all duration-150 hover:shadow-md">
						<CardHeaderComponent>
							<CardTitleComponent className="text-base font-semibold text-foreground">
								Resumen de asistencia
							</CardTitleComponent>
						</CardHeaderComponent>
						<CardContentComponent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Presente hoy</span>
									<span className="text-sm font-semibold text-foreground">142/156</span>
								</div>
								<div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
									<div className="h-full rounded-full bg-green-600 dark:bg-green-500" style={{ width: "91%" }}></div>
								</div>
								<div className="grid grid-cols-12 gap-4 pt-2">
									<div className="col-span-4">
										<p className="text-xs text-muted-foreground">En tiempo</p>
										<p className="text-base font-semibold text-foreground">128</p>
									</div>
									<div className="col-span-4">
										<p className="text-xs text-muted-foreground">Tarde</p>
										<p className="text-base font-semibold text-foreground">14</p>
									</div>
									<div className="col-span-4">
										<p className="text-xs text-muted-foreground">Ausentes</p>
										<p className="text-base font-semibold text-foreground">14</p>
									</div>
								</div>
							</div>
						</CardContentComponent>
					</CardComponent>
				</div>
			</div>
		</div>
	)
}

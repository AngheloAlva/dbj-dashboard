"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"
import DashboardLayout from "./dashboard/layout"
import FileManagement from "./dashboard/files/page"
import AttendanceTracker from "./dashboard/attendance/page"
import EmployeeManagement from "./dashboard/employees/page"
import { CardContent as CardContentComponent } from "@/components/ui/card"
import { CardTitle as CardTitleComponent } from "@/components/ui/card"
import { CardHeader as CardHeaderComponent } from "@/components/ui/card"
import { Card as CardComponent } from "@/components/ui/card"
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
						<Image src="/dbj-logo.jpg" alt="DBJ Logo" width={180} height={180} />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">DBJ Dashboard</CardTitle>
					<CardDescription>Inici sesión para acceder a tu espacio de trabajo</CardDescription>
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
		{ title: "Total de archivos", value: "1,234", change: "+12%" },
		{ title: "Revisión pendiente", value: "23", change: "+5%" },
		{ title: "Empleados activos", value: "156", change: "+2%" },
		{ title: "Asistencia diaria", value: "142", change: "91%" },
	]

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Bienvenido, {currentUser.username}!</h1>
				<p className="text-gray-600">
					Aquí está lo que está sucediendo en su espacio de trabajo hoy.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<CardComponent key={index}>
						<CardHeaderComponent className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitleComponent className="text-sm font-medium">{stat.title}</CardTitleComponent>
						</CardHeaderComponent>
						<CardContentComponent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-muted-foreground text-xs">
								<span className="text-green-600">{stat.change}</span> desde el mes anterior
							</p>
						</CardContentComponent>
					</CardComponent>
				))}
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<CardComponent>
					<CardHeaderComponent>
						<CardTitleComponent>Actividad reciente de archivos</CardTitleComponent>
					</CardHeaderComponent>
					<CardContentComponent>
						<div className="space-y-4">
							{[
								{ name: "Reporte financiero Q4.pdf", action: "Subido", time: "2 horas atrás" },
								{ name: "Manual de empleado.docx", action: "Revisado", time: "4 horas atrás" },
								{ name: "Propuesta de proyecto.pptx", action: "Aprobado", time: "1 día atrás" },
							].map((activity, index) => (
								<div key={index} className="flex items-center space-x-4">
									<div className="h-2 w-2 rounded-full bg-blue-600"></div>
									<div className="flex-1">
										<p className="text-sm font-medium">{activity.name}</p>
										<p className="text-xs text-gray-500">
											{activity.action} • {activity.time}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContentComponent>
				</CardComponent>

				<CardComponent>
					<CardHeaderComponent>
						<CardTitleComponent>Resumen de asistencia</CardTitleComponent>
					</CardHeaderComponent>
					<CardContentComponent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm">Presente hoy</span>
								<span className="text-sm font-medium">142/156</span>
							</div>
							<div className="h-2 w-full rounded-full bg-gray-200">
								<div className="h-2 rounded-full bg-green-600" style={{ width: "91%" }}></div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-gray-500">En tiempo</p>
									<p className="font-medium">128</p>
								</div>
								<div>
									<p className="text-gray-500">Tarde</p>
									<p className="font-medium">14</p>
								</div>
							</div>
						</div>
					</CardContentComponent>
				</CardComponent>
			</div>
		</div>
	)
}

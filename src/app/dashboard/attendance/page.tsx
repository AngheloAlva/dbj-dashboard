"use client"

import { useState } from "react"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Clock, CalendarIcon, Users, TrendingUp, CheckCircle, XCircle } from "lucide-react"

interface AttendanceRecord {
	id: string
	employeeId: string
	employeeName: string
	department: string
	date: string
	checkIn: string
	checkOut: string
	status: "presente" | "tardia" | "ausente" | "medio-dia"
	workingHours: string
}

// This is the actual page component that Next.js will use
/* eslint-disable @next/next/no-typed-document-default-export */
// @ts-ignore - Disabling Next.js page export type check as requested
export default function AttendanceTracker() {
	// Handle the case where props or currentUser might be undefined during server-side rendering
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [searchQuery, setSearchQuery] = useState("")

	const mockAttendance: AttendanceRecord[] = [
		{
			id: "1",
			employeeId: "EMP001",
			employeeName: "John Doe",
			department: "Ingeniería",
			date: "2024-01-16",
			checkIn: "09:00 AM",
			checkOut: "06:00 PM",
			status: "presente",
			workingHours: "9h 0m",
		},
		{
			id: "2",
			employeeId: "EMP002",
			employeeName: "Jane Smith",
			department: "Marketing",
			date: "2024-01-16",
			checkIn: "09:15 AM",
			checkOut: "06:15 PM",
			status: "tardia",
			workingHours: "9h 0m",
		},
		{
			id: "3",
			employeeId: "EMP003",
			employeeName: "Mike Johnson",
			department: "Finanzas",
			date: "2024-01-16",
			checkIn: "09:00 AM",
			checkOut: "01:00 PM",
			status: "medio-dia",
			workingHours: "4h 0m",
		},
		{
			id: "4",
			employeeId: "EMP004",
			employeeName: "Sarah Wilson",
			department: "Recursos Humanos",
			date: "2024-01-16",
			checkIn: "-",
			checkOut: "-",
			status: "ausente",
			workingHours: "0h 0m",
		},
		{
			id: "5",
			employeeId: "EMP005",
			employeeName: "David Brown",
			department: "Ingeniería",
			date: "2024-01-16",
			checkIn: "08:45 AM",
			checkOut: "05:45 PM",
			status: "presente",
			workingHours: "9h 0m",
		},
	]

	const filteredAttendance = mockAttendance.filter(
		(record) =>
			record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
			record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const getStatusColor = (status: string) => {
		switch (status) {
			case "presente":
				return "bg-green-100 text-green-800"
			case "tardia":
				return "bg-yellow-100 text-yellow-800"
			case "ausente":
				return "bg-red-100 text-red-800"
			case "medio-dia":
				return "bg-blue-100 text-blue-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "presente":
				return <CheckCircle className="h-4 w-4 text-green-600" />
			case "tardia":
				return <Clock className="h-4 w-4 text-yellow-600" />
			case "ausente":
				return <XCircle className="h-4 w-4 text-red-600" />
			case "medio-dia":
				return <Clock className="h-4 w-4 text-blue-600" />
			default:
				return null
		}
	}

	const stats = [
		{ title: "Presentes", value: "142", icon: CheckCircle, color: "text-green-600" },
		{ title: "Tardanzas", value: "14", icon: Clock, color: "text-yellow-600" },
		{ title: "Ausentes", value: "14", icon: XCircle, color: "text-red-600" },
		{ title: "Tasa de Asistencia", value: "91%", icon: TrendingUp, color: "text-blue-600" },
	]

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Rastreo de Asistencia</h1>
					<p className="text-gray-600">Monitorizar la asistencia diaria y las horas de trabajo</p>
				</div>
				{true && (
					<Dialog>
						<DialogTrigger asChild>
							<Button className="bg-blue-500 text-white">
								<CalendarIcon className="mr-2 h-4 w-4" />
								Generar Reporte
							</Button>
						</DialogTrigger>

						<DialogContent className="w-fit">
							<DialogHeader>
								<DialogTitle>Generar Reporte de Asistencia</DialogTitle>
								<DialogDescription>
									Seleccionar rango de fechas y filtros para el reporte de asistencia
								</DialogDescription>
							</DialogHeader>
							<div className="mx-auto space-y-5">
								<Calendar
									mode="single"
									locale={es}
									selected={selectedDate}
									onSelect={(date) => date && setSelectedDate(date)}
									className="rounded-md border"
								/>
								<div className="flex justify-center space-x-2">
									<Button variant="outline">Cancelar</Button>
									<Button className="bg-blue-500 text-white">Generar Reporte</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<stat.icon className={`h-4 w-4 ${stat.color}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Search and Filters */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex space-x-4">
						<div className="flex-1">
							<Input
								placeholder="Buscar empleados..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button variant="outline">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{selectedDate.toLocaleDateString()}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Attendance Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Users className="mr-2 h-5 w-5" />
						Asistencia de Hoy
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Empleado</TableHead>
								<TableHead>Departamento</TableHead>
								<TableHead>Entrada</TableHead>
								<TableHead>Salida</TableHead>
								<TableHead>Horas de Trabajo</TableHead>
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAttendance.map((record) => (
								<TableRow key={record.id}>
									<TableCell>
										<div>
											<p className="font-medium">{record.employeeName}</p>
											<p className="text-sm text-gray-500">{record.employeeId}</p>
										</div>
									</TableCell>
									<TableCell>{record.department}</TableCell>
									<TableCell>{record.checkIn}</TableCell>
									<TableCell>{record.checkOut}</TableCell>
									<TableCell>{record.workingHours}</TableCell>
									<TableCell>
										<div className="flex items-center space-x-2">
											{getStatusIcon(record.status)}
											<Badge className={getStatusColor(record.status)}>{record.status}</Badge>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

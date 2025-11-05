"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Users, UserPlus, MoreHorizontal, Edit, Trash2, Mail, Phone, Calendar } from "lucide-react"

interface Employee {
	id: string
	employeeId: string
	name: string
	email: string
	phone: string
	department: string
	position: string
	status: "activo" | "inactivo" | "en-licencia"
	joinDate: string
	salary: string
}

export default function EmployeeManagement() {
	// Handle the case where props or currentUser might be undefined during server-side rendering
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
	const [addEmployeeDialog, setAddEmployeeDialog] = useState(false)
	const [editEmployeeDialog, setEditEmployeeDialog] = useState(false)

	const mockEmployees: Employee[] = [
		{
			id: "1",
			employeeId: "EMP001",
			name: "John Doe",
			email: "john.doe@ingsimple.com",
			phone: "+56 9 1234 5678",
			department: "Ingeniería",
			position: "Desarrollador Senior",
			status: "activo",
			joinDate: "2023-01-15",
			salary: "$350,000",
		},
		{
			id: "2",
			employeeId: "EMP002",
			name: "Jane Smith",
			email: "jane.smith@ingsimple.com",
			phone: "+56 9 2345 6789",
			department: "Marketing",
			position: "Gerente de Marketing",
			status: "activo",
			joinDate: "2022-11-20",
			salary: "$250,000",
		},
		{
			id: "3",
			employeeId: "EMP003",
			name: "Mike Johnson",
			email: "mike.johnson@ingsimple.com",
			phone: "+56 9 3456 7890",
			department: "Finanzas",
			position: "Analista Financiero",
			status: "en-licencia",
			joinDate: "2023-03-10",
			salary: "$250,000",
		},
		{
			id: "4",
			employeeId: "EMP004",
			name: "Sarah Wilson",
			email: "sarah.wilson@ingsimple.com",
			phone: "+56 9 4567 8901",
			department: "Recursos Humanos",
			position: "Especialista en Recursos Humanos",
			status: "activo",
			joinDate: "2022-08-05",
			salary: "$250,000",
		},
		{
			id: "5",
			employeeId: "EMP005",
			name: "David Brown",
			email: "david.brown@ingsimple.com",
			phone: "+56 9 5678 9012",
			department: "Ingeniería",
			position: "Desarrollador Junior",
			status: "activo",
			joinDate: "2023-06-01",
			salary: "$250,000",
		},
	]

	// Safe filtering that won't crash during server-side rendering
	const filteredEmployees = mockEmployees
		? mockEmployees.filter(
				(employee) =>
					employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
					employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
					employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
			)
		: []

	const getStatusColor = (status: string) => {
		switch (status) {
			case "activo":
				return "bg-green-100 text-green-800"
			case "inactivo":
				return "bg-red-100 text-red-800"
			case "en-licencia":
				return "bg-yellow-100 text-yellow-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const departmentStats = [
		{ name: "Ingeniería", count: 45, color: "bg-blue-100 text-blue-800" },
		{ name: "Marketing", count: 23, color: "bg-purple-100 text-purple-800" },
		{ name: "Finanzas", count: 18, color: "bg-green-100 text-green-800" },
		{ name: "Recursos Humanos", count: 12, color: "bg-orange-100 text-orange-800" },
	]

	// Safe role check with fallback for server-side rendering
	const canManageEmployees = true

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Gestión de Colaboradores</h1>
					<p className="text-gray-600">Gestionar información y registros de colaboradores</p>
				</div>
				{canManageEmployees && (
					<Dialog open={addEmployeeDialog} onOpenChange={setAddEmployeeDialog}>
						<DialogTrigger asChild>
							<Button className="bg-blue-500 text-white">
								<UserPlus className="mr-2 h-4 w-4" />
								Agregar Colaborador
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Agregar Nuevo Colaborador</DialogTitle>
								<DialogDescription>Ingrese información del colaborador</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">Nombre</Label>
										<Input id="firstName" placeholder="Juan" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Apellido</Label>
										<Input id="lastName" placeholder="Pérez" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="john.doe@ingsimple.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Teléfono</Label>
									<Input id="phone" placeholder="+56 9 1234 5678" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="department">Departamento</Label>
										<Select>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Departamento" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="engineering">Ingeniería</SelectItem>
												<SelectItem value="marketing">Marketing</SelectItem>
												<SelectItem value="finance">Finanzas</SelectItem>
												<SelectItem value="hr">Recursos Humanos</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="position">Posición</Label>
										<Input id="position" placeholder="Posición" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="salary">Salario</Label>
									<Input id="salary" placeholder="Salario" />
								</div>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setAddEmployeeDialog(false)}>
										Cancelar
									</Button>
									<Button onClick={() => setAddEmployeeDialog(false)}>Agregar Colaborador</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</div>

			{/* Department Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{departmentStats.map((dept, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
							<Users className="text-muted-foreground h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{dept.count}</div>
							<Badge className={dept.color}>Activo</Badge>
						</CardContent>
					</Card>
				))}
			</div>

			<Input
				className="bg-white shadow"
				placeholder="Buscar colaboradores por nombre, email, departamento, o ID..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{/* Employee Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Users className="mr-2 h-5 w-5" />
						Employee Directory
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Colaborador</TableHead>
								<TableHead>Contacto</TableHead>
								<TableHead>Departamento</TableHead>
								<TableHead>Posición</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Fecha de Inicio</TableHead>
								{canManageEmployees && <TableHead>Acciones</TableHead>}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredEmployees.map((employee) => (
								<TableRow key={employee.id}>
									<TableCell>
										<div>
											<p className="font-medium">{employee.name}</p>
											<p className="text-sm text-gray-500">{employee.employeeId}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center text-sm">
												<Mail className="mr-1 h-3 w-3" />
												{employee.email}
											</div>
											<div className="flex items-center text-sm">
												<Phone className="mr-1 h-3 w-3" />
												{employee.phone}
											</div>
										</div>
									</TableCell>
									<TableCell>{employee.department}</TableCell>
									<TableCell>{employee.position}</TableCell>
									<TableCell>
										<Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center text-sm">
											<Calendar className="mr-1 h-3 w-3" />
											{employee.joinDate}
										</div>
									</TableCell>
									{canManageEmployees && (
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => {
															setSelectedEmployee(employee)
															setEditEmployeeDialog(true)
														}}
													>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem className="text-red-600">
														<Trash2 className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Edit Employee Dialog */}
			<Dialog open={editEmployeeDialog} onOpenChange={setEditEmployeeDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Editar Colaborador</DialogTitle>
						<DialogDescription>Actualizar información del colaborador</DialogDescription>
					</DialogHeader>
					{selectedEmployee && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="editFirstName">Nombre</Label>
									<Input id="editFirstName" defaultValue={selectedEmployee.name.split(" ")[0]} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="editLastName">Apellido</Label>
									<Input id="editLastName" defaultValue={selectedEmployee.name.split(" ")[1]} />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editEmail">Email</Label>
								<Input id="editEmail" defaultValue={selectedEmployee.email} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="editPhone">Teléfono</Label>
								<Input id="editPhone" defaultValue={selectedEmployee.phone} />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="editDepartment">Departamento</Label>
									<Select defaultValue={selectedEmployee.department.toLowerCase()}>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="engineering">Ingeniería</SelectItem>
											<SelectItem value="marketing">Marketing</SelectItem>
											<SelectItem value="finance">Finanzas</SelectItem>
											<SelectItem value="hr">Recursos Humanos</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="editPosition">Posición</Label>
									<Input id="editPosition" defaultValue={selectedEmployee.position} />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="editStatus">Estado</Label>
								<Select defaultValue={selectedEmployee.status}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="on-leave">On Leave</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="mt-6 flex justify-end space-x-2">
								<Button variant="outline" onClick={() => setEditEmployeeDialog(false)}>
									Cancelar
								</Button>
								<Button
									className="bg-blue-500 hover:bg-blue-600"
									onClick={() => setEditEmployeeDialog(false)}
								>
									Guardar Cambios
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

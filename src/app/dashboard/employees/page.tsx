"use client"

import { useMemo, useState, useCallback, useTransition } from "react"
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
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid"
import { DataGridPagination } from "@/components/ui/data-grid-pagination"
import { DataGridTable } from "@/components/ui/data-grid-table"
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Users,
	UserPlus,
	MoreHorizontal,
	Edit,
	Trash2,
	Mail,
	Phone,
	Calendar,
	FileText,
	Upload,
	Download,
	Eye,
	X as XIcon,
} from "lucide-react"

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

interface EmployeeFile {
	id: string
	name: string
	type: string
	size: string
	uploadDate: string
	uploadedBy: string
}

export default function EmployeeManagement() {
	// Handle the case where props or currentUser might be undefined during server-side rendering
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
	const [addEmployeeDialog, setAddEmployeeDialog] = useState(false)
	const [editEmployeeDialog, setEditEmployeeDialog] = useState(false)
	const [viewFilesDialog, setViewFilesDialog] = useState(false)
	const [uploadFileDialog, setUploadFileDialog] = useState(false)
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	})
	const [sorting, setSorting] = useState<SortingState>([])
	const [isPending, startTransition] = useTransition()

	// Mock data para archivos de empleados
	const [employeeFiles, setEmployeeFiles] = useState<Record<string, EmployeeFile[]>>({
		"1": [
			{
				id: "f1",
				name: "Contrato_JohnDoe.pdf",
				type: "PDF",
				size: "2.3 MB",
				uploadDate: "2023-01-20",
				uploadedBy: "Admin",
			},
			{
				id: "f2",
				name: "Certificado_Estudios.pdf",
				type: "PDF",
				size: "1.1 MB",
				uploadDate: "2023-01-20",
				uploadedBy: "RRHH",
			},
		],
		"2": [
			{
				id: "f3",
				name: "Contrato_JaneSmith.pdf",
				type: "PDF",
				size: "2.5 MB",
				uploadDate: "2022-11-25",
				uploadedBy: "Admin",
			},
		],
	})

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

	// Safe filtering that won't crash during server-side rendering - memoizado
	const filteredEmployees = useMemo(
		() =>
			mockEmployees
				? mockEmployees.filter(
						(employee) =>
							employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
							employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
							employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
					)
				: [],
		[searchQuery]
	)

	const getStatusColor = useCallback((status: string) => {
		switch (status) {
			case "activo":
				return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800"
			case "inactivo":
				return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800"
			case "en-licencia":
				return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
			default:
				return "bg-muted text-muted-foreground"
		}
	}, [])

	const getInitials = useCallback((name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}, [])

	// Safe role check with fallback for server-side rendering
	const canManageEmployees = true

	// Handlers memoizados para evitar re-renders innecesarios con transiciones no-bloqueantes
	const handleEditEmployee = useCallback((employee: Employee) => {
		startTransition(() => {
			setSelectedEmployee(employee)
			setEditEmployeeDialog(true)
		})
	}, [])

	const handleViewFiles = useCallback((employee: Employee) => {
		startTransition(() => {
			setSelectedEmployee(employee)
			setViewFilesDialog(true)
		})
	}, [])

	const columns = useMemo<ColumnDef<Employee>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Colaborador",
				cell: (info) => {
					const employee = info.row.original
					const initials = getInitials(employee.name)
					return (
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
								{initials}
							</div>
							<div>
								<p className="text-foreground font-medium">{employee.name}</p>
								<p className="text-muted-foreground text-xs">{employee.employeeId}</p>
							</div>
						</div>
					)
				},
				size: 200,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "email",
				header: "Contacto",
				cell: (info) => {
					const employee = info.row.original
					return (
						<div className="space-y-1">
							<div className="text-foreground flex items-center text-xs">
								<Mail className="text-muted-foreground mr-1.5 h-3 w-3" />
								{employee.email}
							</div>
							<div className="text-foreground flex items-center text-xs">
								<Phone className="text-muted-foreground mr-1.5 h-3 w-3" />
								{employee.phone}
							</div>
						</div>
					)
				},
				size: 200,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "department",
				header: "Departamento",
				cell: (info) => <span className="text-foreground">{info.getValue() as string}</span>,
				size: 150,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "position",
				header: "Posición",
				cell: (info) => <span className="text-foreground">{info.getValue() as string}</span>,
				size: 180,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "status",
				header: "Estado",
				cell: (info) => {
					const status = info.getValue() as string
					return (
						<Badge className={`${getStatusColor(status)} rounded-full border text-xs font-medium`}>
							{status}
						</Badge>
					)
				},
				size: 120,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "joinDate",
				header: "Fecha de Inicio",
				cell: (info) => {
					const date = info.getValue() as string
					return (
						<div className="text-foreground flex items-center">
							<Calendar className="text-muted-foreground mr-1.5 h-3 w-3" />
							<span>{date}</span>
						</div>
					)
				},
				size: 150,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			...(canManageEmployees
				? [
						{
							id: "actions",
							header: "Acciones",
							cell: (info) => {
								const employee = info.row.original
								return (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="rounded-lg transition-all duration-150"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault()
													handleEditEmployee(employee)
												}}
											>
												<Edit className="mr-2 h-4 w-4" />
												Editar
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault()
													handleViewFiles(employee)
												}}
											>
												<FileText className="mr-2 h-4 w-4" />
												Gestionar Archivos
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600 dark:text-red-400"
												onSelect={(e) => {
													e.preventDefault()
													// Aquí iría la lógica para eliminar
												}}
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Eliminar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)
							},
							size: 100,
							meta: {
								headerClassName: "",
								cellClassName: "",
							},
						} as ColumnDef<Employee>,
					]
				: []),
		],
		[canManageEmployees, handleEditEmployee, handleViewFiles, getStatusColor, getInitials]
	)

	const table = useReactTable({
		columns,
		data: filteredEmployees,
		pageCount: Math.ceil((filteredEmployees?.length || 0) / pagination.pageSize),
		getRowId: (row: Employee) => row.id,
		state: {
			pagination,
			sorting,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	})

	const departmentStats = useMemo(
		() => [
			{
				name: "Ingeniería",
				count: 45,
				color:
					"bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
			},
			{
				name: "Marketing",
				count: 23,
				color:
					"bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
			},
			{
				name: "Finanzas",
				count: 18,
				color:
					"bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800",
			},
			{
				name: "Recursos Humanos",
				count: 12,
				color:
					"bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
			},
		],
		[]
	)

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold">Gestión de Colaboradores</h1>
					<p className="text-muted-foreground">
						Gestionar información y registros de colaboradores
					</p>
				</div>
				{canManageEmployees && (
					<Dialog open={addEmployeeDialog} onOpenChange={setAddEmployeeDialog}>
						<DialogTrigger asChild>
							<Button className="rounded-xl transition-all duration-150">
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
			<div className="grid grid-cols-12 gap-6">
				{departmentStats.map((dept, index) => (
					<div key={index} className="col-span-12 md:col-span-6 lg:col-span-3">
						<Card className="border-muted rounded-2xl shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
							<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
								<div className="flex-1 space-y-1">
									<CardTitle className="text-muted-foreground text-xs font-medium">
										{dept.name}
									</CardTitle>
									<div className="text-foreground text-2xl font-bold">{dept.count}</div>
								</div>
								<Users className="text-muted-foreground h-4 w-4 shrink-0" />
							</CardHeader>
							<CardContent className="pt-0">
								<Badge className={`${dept.color} rounded-full border text-xs font-medium`}>
									Activo
								</Badge>
							</CardContent>
						</Card>
					</div>
				))}
			</div>

			<Input
				className="border-muted rounded-xl"
				placeholder="Buscar colaboradores por nombre, email, departamento, o ID..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{/* Employee Table */}
			<Card className="border-muted rounded-2xl shadow-sm">
				<CardHeader>
					<CardTitle className="text-foreground flex items-center text-base font-semibold">
						<Users className="mr-2 h-5 w-5" />
						Directorio de Colaboradores
					</CardTitle>
				</CardHeader>
				<CardContent style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
					<DataGrid
						table={table}
						recordCount={filteredEmployees?.length || 0}
						tableLayout={{
							stripped: true,
							rowBorder: true,
							headerBackground: true,
							headerBorder: true,
						}}
					>
						<div className="w-full space-y-2.5">
							<DataGridContainer border={false}>
								<DataGridTable />
							</DataGridContainer>
							<DataGridPagination />
						</div>
					</DataGrid>
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

			{/* View Files Dialog */}
			<Dialog open={viewFilesDialog} onOpenChange={setViewFilesDialog}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>Archivos del Colaborador</DialogTitle>
						<DialogDescription>
							{selectedEmployee && `Gestionar archivos de ${selectedEmployee.name}`}
						</DialogDescription>
					</DialogHeader>
					{selectedEmployee && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="text-muted-foreground flex items-center gap-2 text-sm">
									<FileText className="h-4 w-4" />
									<span>
										{employeeFiles[selectedEmployee.id]?.length || 0} archivo(s) disponible(s)
									</span>
								</div>
								<Button
									size="sm"
									onClick={() => {
										setUploadFileDialog(true)
									}}
									className="rounded-lg"
								>
									<Upload className="mr-2 h-4 w-4" />
									Subir Archivo
								</Button>
							</div>

							<div className="max-h-[400px] divide-y overflow-y-auto rounded-lg border">
								{employeeFiles[selectedEmployee.id]?.length > 0 ? (
									employeeFiles[selectedEmployee.id].map((file) => (
										<div
											key={file.id}
											className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
										>
											<div className="flex flex-1 items-center gap-3">
												<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
													<FileText className="text-primary h-5 w-5" />
												</div>
												<div className="flex-1">
													<p className="text-foreground font-medium">{file.name}</p>
													<div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
														<span>{file.type}</span>
														<span>•</span>
														<span>{file.size}</span>
														<span>•</span>
														<span>Subido: {file.uploadDate}</span>
														<span>•</span>
														<span>Por: {file.uploadedBy}</span>
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Eye className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<Download className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
													onClick={() => {
														// Eliminar archivo
														setEmployeeFiles((prev) => ({
															...prev,
															[selectedEmployee.id]:
																prev[selectedEmployee.id]?.filter((f) => f.id !== file.id) || [],
														}))
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))
								) : (
									<div className="text-muted-foreground p-8 text-center">
										<FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
										<p>No hay archivos disponibles</p>
										<p className="mt-1 text-sm">Sube un archivo para comenzar</p>
									</div>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Upload File Dialog */}
			<Dialog open={uploadFileDialog} onOpenChange={setUploadFileDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Subir Archivo</DialogTitle>
						<DialogDescription>
							Sube un nuevo archivo para {selectedEmployee?.name}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="fileName">Nombre del Archivo</Label>
							<Input id="fileName" placeholder="Ej: Contrato_Laboral.pdf" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="fileType">Tipo de Documento</Label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seleccionar tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="contract">Contrato</SelectItem>
									<SelectItem value="certificate">Certificado</SelectItem>
									<SelectItem value="identification">Identificación</SelectItem>
									<SelectItem value="resume">Currículum</SelectItem>
									<SelectItem value="other">Otro</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="fileUpload">Archivo</Label>
							<div className="hover:bg-muted/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors">
								<Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
								<p className="text-muted-foreground mb-1 text-sm">
									Haz clic para seleccionar o arrastra el archivo aquí
								</p>
								<p className="text-muted-foreground text-xs">PDF, DOC, DOCX hasta 10MB</p>
								<Input id="fileUpload" type="file" className="hidden" />
							</div>
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button variant="outline" onClick={() => setUploadFileDialog(false)}>
								Cancelar
							</Button>
							<Button
								onClick={() => {
									// Simular subida de archivo
									if (selectedEmployee) {
										const newFile: EmployeeFile = {
											id: `f${Date.now()}`,
											name: "Nuevo_Documento.pdf",
											type: "PDF",
											size: "1.5 MB",
											uploadDate: new Date().toISOString().split("T")[0],
											uploadedBy: "Usuario Actual",
										}
										setEmployeeFiles((prev) => ({
											...prev,
											[selectedEmployee.id]: [...(prev[selectedEmployee.id] || []), newFile],
										}))
									}
									setUploadFileDialog(false)
								}}
							>
								<Upload className="mr-2 h-4 w-4" />
								Subir Archivo
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

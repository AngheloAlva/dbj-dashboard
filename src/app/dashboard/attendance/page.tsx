"use client"

import { useMemo, useState, useCallback, useTransition, memo } from "react"
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
import {
	Clock,
	CalendarIcon,
	Users,
	TrendingUp,
	CheckCircle,
	XCircle,
	ClipboardCheck,
} from "lucide-react"
import { useAttendance, AttendanceRecord } from "@/contexts/AttendanceContext"

// Componente memoizado para cada fila de empleado en el diálogo
const EmployeeAttendanceRow = memo(
	({
		record,
		getStatusIcon,
		getStatusColor,
		onMarkAttendance,
	}: {
		record: AttendanceRecord
		getStatusIcon: (status: string) => React.ReactElement | null
		getStatusColor: (status: string) => string
		onMarkAttendance: (
			employeeId: string,
			status: "presente" | "tardia" | "ausente" | "medio-dia"
		) => void
	}) => (
		<div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors">
			<div className="flex flex-1 items-center gap-4">
				<div className="flex-1">
					<p className="text-foreground font-medium">{record.employeeName}</p>
					<p className="text-muted-foreground text-sm">
						{record.employeeId} • {record.department}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{getStatusIcon(record.status)}
					<Badge
						className={`${getStatusColor(record.status)} rounded-full border text-xs font-medium`}
					>
						{record.status}
					</Badge>
				</div>
			</div>
			<div className="ml-4 flex gap-2">
				<Button
					variant={record.status === "presente" ? "primary" : "outline"}
					size="sm"
					onClick={() => onMarkAttendance(record.employeeId, "presente")}
					className="h-8"
				>
					<CheckCircle className="mr-1.5 h-3.5 w-3.5" />
					Presente
				</Button>
				<Button
					variant={record.status === "tardia" ? "primary" : "outline"}
					size="sm"
					onClick={() => onMarkAttendance(record.employeeId, "tardia")}
					className="h-8"
				>
					<Clock className="mr-1.5 h-3.5 w-3.5" />
					Tardía
				</Button>
				<Button
					variant={record.status === "ausente" ? "primary" : "outline"}
					size="sm"
					onClick={() => onMarkAttendance(record.employeeId, "ausente")}
					className="h-8"
				>
					<XCircle className="mr-1.5 h-3.5 w-3.5" />
					Ausente
				</Button>
				<Button
					variant={record.status === "medio-dia" ? "primary" : "outline"}
					size="sm"
					onClick={() => onMarkAttendance(record.employeeId, "medio-dia")}
					className="h-8"
				>
					<Clock className="mr-1.5 h-3.5 w-3.5" />
					Medio Día
				</Button>
			</div>
		</div>
	)
)

EmployeeAttendanceRow.displayName = "EmployeeAttendanceRow"

// This is the actual page component that Next.js will use
/* eslint-disable @next/next/no-typed-document-default-export */
// @ts-ignore - Disabling Next.js page export type check as requested
export default function AttendanceTracker() {
	// Handle the case where props or currentUser might be undefined during server-side rendering
	const { attendanceRecords, markAttendance, todayAttendance } = useAttendance()
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [searchQuery, setSearchQuery] = useState("")
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	})
	const [sorting, setSorting] = useState<SortingState>([])
	const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false)
	const [dialogSearchQuery, setDialogSearchQuery] = useState("")
	const [isPending, startTransition] = useTransition()

	const filteredAttendance = useMemo(
		() =>
			todayAttendance.filter(
				(record) =>
					record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
					record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
			),
		[todayAttendance, searchQuery]
	)

	const filteredDialogAttendance = useMemo(
		() =>
			todayAttendance.filter(
				(record: AttendanceRecord) =>
					record.employeeName.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
					record.employeeId.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
					record.department.toLowerCase().includes(dialogSearchQuery.toLowerCase())
			),
		[todayAttendance, dialogSearchQuery]
	)

	const handleMarkAttendance = useCallback(
		(employeeId: string, status: "presente" | "tardia" | "ausente" | "medio-dia") => {
			startTransition(() => {
				markAttendance(employeeId, status)
			})
		},
		[markAttendance]
	)

	const getStatusColor = useCallback((status: string) => {
		switch (status) {
			case "presente":
				return "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800"
			case "tardia":
				return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
			case "ausente":
				return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800"
			case "medio-dia":
				return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
			default:
				return "bg-muted text-muted-foreground"
		}
	}, [])

	const getStatusIcon = useCallback((status: string) => {
		switch (status) {
			case "presente":
				return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
			case "tardia":
				return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
			case "ausente":
				return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
			case "medio-dia":
				return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
			default:
				return null
		}
	}, [])

	const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
		() => [
			{
				accessorKey: "employeeName",
				header: "Empleado",
				cell: (info) => {
					const record = info.row.original
					return (
						<div>
							<p className="text-foreground font-medium">{record.employeeName}</p>
							<p className="text-muted-foreground text-xs">{record.employeeId}</p>
						</div>
					)
				},
				size: 175,
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
				accessorKey: "checkIn",
				header: "Entrada",
				cell: (info) => <span className="text-foreground">{info.getValue() as string}</span>,
				size: 120,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "checkOut",
				header: "Salida",
				cell: (info) => <span className="text-foreground">{info.getValue() as string}</span>,
				size: 120,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
			{
				accessorKey: "workingHours",
				header: "Horas de Trabajo",
				cell: (info) => <span className="text-foreground">{info.getValue() as string}</span>,
				size: 130,
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
						<div className="flex items-center gap-2">
							{getStatusIcon(status)}
							<Badge
								className={`${getStatusColor(status)} rounded-full border text-xs font-medium`}
							>
								{status}
							</Badge>
						</div>
					)
				},
				size: 140,
				meta: {
					headerClassName: "",
					cellClassName: "",
				},
			},
		],
		[]
	)

	const table = useReactTable({
		columns,
		data: filteredAttendance,
		pageCount: Math.ceil((filteredAttendance?.length || 0) / pagination.pageSize),
		getRowId: (row: AttendanceRecord) => row.id,
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

	// Calcular estadísticas basadas en la asistencia de hoy
	const stats = useMemo(() => {
		const presentes = todayAttendance.filter(
			(r: AttendanceRecord) => r.status === "presente"
		).length
		const tardias = todayAttendance.filter((r: AttendanceRecord) => r.status === "tardia").length
		const ausentes = todayAttendance.filter((r: AttendanceRecord) => r.status === "ausente").length
		const total = todayAttendance.length
		const tasa = total > 0 ? Math.round(((presentes + tardias) / total) * 100) : 0

		return [
			{
				title: "Presentes",
				value: presentes.toString(),
				icon: CheckCircle,
				color: "text-green-600",
			},
			{ title: "Tardanzas", value: tardias.toString(), icon: Clock, color: "text-yellow-600" },
			{ title: "Ausentes", value: ausentes.toString(), icon: XCircle, color: "text-red-600" },
			{ title: "Tasa de Asistencia", value: `${tasa}%`, icon: TrendingUp, color: "text-blue-600" },
		]
	}, [todayAttendance])

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold">Rastreo de Asistencia</h1>
					<p className="text-muted-foreground">
						Monitorizar la asistencia diaria y las horas de trabajo
					</p>
				</div>
				<div className="flex gap-3">
					<Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
						<DialogTrigger asChild>
							<Button className="rounded-xl transition-all duration-150">
								<ClipboardCheck className="mr-2 h-4 w-4" />
								Pasar Asistencia
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									Pasar Asistencia - {new Date().toLocaleDateString("es-ES")}
								</DialogTitle>
								<DialogDescription>
									Marca la asistencia de los empleados para la fecha actual
								</DialogDescription>
							</DialogHeader>
							<div className="mt-4 space-y-4">
								<Input
									placeholder="Buscar empleado..."
									value={dialogSearchQuery}
									onChange={(e) => setDialogSearchQuery(e.target.value)}
									className="border-muted"
								/>
								<div
									className="max-h-[60vh] space-y-2 overflow-y-auto"
									style={{ opacity: isPending ? 0.6 : 1 }}
								>
									{filteredDialogAttendance.map((record: AttendanceRecord) => (
										<EmployeeAttendanceRow
											key={record.id}
											record={record}
											getStatusIcon={getStatusIcon}
											getStatusColor={getStatusColor}
											onMarkAttendance={handleMarkAttendance}
										/>
									))}
								</div>
							</div>
						</DialogContent>
					</Dialog>
					{true && (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" className="rounded-xl transition-all duration-150">
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
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-12 gap-6">
				{stats.map((stat, index) => (
					<div key={index} className="col-span-12 md:col-span-6 lg:col-span-3">
						<Card className="border-muted rounded-2xl shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
							<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
								<div className="space-y-1">
									<CardTitle className="text-muted-foreground text-xs font-medium">
										{stat.title}
									</CardTitle>
									<div className="text-foreground text-2xl font-bold">{stat.value}</div>
								</div>
								<stat.icon className={`h-4 w-4 shrink-0 ${stat.color}`} />
							</CardHeader>
						</Card>
					</div>
				))}
			</div>

			{/* Search and Filters */}
			<Card className="border-muted rounded-2xl">
				<CardContent className="pt-6">
					<div className="flex gap-4">
						<div className="flex-1">
							<Input
								placeholder="Buscar empleados..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="border-muted"
							/>
						</div>
						<Button variant="outline" className="rounded-xl transition-all duration-150">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{selectedDate.toLocaleDateString()}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Attendance Table */}
			<Card className="border-muted rounded-2xl shadow-sm">
				<CardHeader>
					<CardTitle className="text-foreground flex items-center text-base font-semibold">
						<Users className="mr-2 h-5 w-5" />
						Asistencia de Hoy
					</CardTitle>
				</CardHeader>
				<CardContent>
					<DataGrid
						table={table}
						recordCount={filteredAttendance?.length || 0}
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
		</div>
	)
}

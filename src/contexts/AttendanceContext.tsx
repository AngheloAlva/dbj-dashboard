"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface AttendanceRecord {
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

interface AttendanceContextType {
	attendanceRecords: AttendanceRecord[]
	markAttendance: (employeeId: string, status: "presente" | "tardia" | "ausente" | "medio-dia", date?: string) => void
	getAttendanceByDate: (date: string) => AttendanceRecord[]
	getTodayAttendance: () => AttendanceRecord[]
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined)

// Función para obtener datos iniciales con fecha actual
const getInitialAttendance = (): AttendanceRecord[] => {
	const today = new Date().toISOString().split("T")[0]
	return [
		{
			id: "1",
			employeeId: "EMP001",
			employeeName: "John Doe",
			department: "Ingeniería",
			date: today,
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
			date: today,
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
			date: today,
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
			date: today,
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
			date: today,
			checkIn: "08:45 AM",
			checkOut: "05:45 PM",
			status: "presente",
			workingHours: "9h 0m",
		},
	]
}

export function AttendanceProvider({ children }: { children: ReactNode }) {
	const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(getInitialAttendance())

	const markAttendance = (
		employeeId: string,
		status: "presente" | "tardia" | "ausente" | "medio-dia",
		date?: string
	) => {
		const targetDate = date || new Date().toISOString().split("T")[0]
		const now = new Date()
		const currentTime = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })

		setAttendanceRecords((prev) => {
			// Buscar si ya existe un registro para este empleado en esta fecha
			const existingIndex = prev.findIndex(
				(record) => record.employeeId === employeeId && record.date === targetDate
			)

			if (existingIndex !== -1) {
				// Actualizar registro existente
				const updated = [...prev]
				const record = updated[existingIndex]

				// Generar horas según el estado
				let checkIn = record.checkIn
				let checkOut = record.checkOut
				let workingHours = record.workingHours

				if (status === "presente") {
					checkIn = currentTime
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "tardia") {
					// Simular llegada tarde (después de las 9:00 AM)
					const lateTime = new Date(now)
					lateTime.setHours(9, 30, 0)
					checkIn = lateTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "ausente") {
					checkIn = "-"
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "medio-dia") {
					checkIn = currentTime
					// Simular salida a medio día
					const halfDayOut = new Date(now)
					halfDayOut.setHours(13, 0, 0)
					checkOut = halfDayOut.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
					workingHours = "4h 0m"
				}

				updated[existingIndex] = {
					...record,
					status,
					checkIn,
					checkOut,
					workingHours,
				}

				return updated
			} else {
				// Crear nuevo registro
				const employee = prev.find((r) => r.employeeId === employeeId)
				if (!employee) return prev

				let checkIn = "-"
				let checkOut = "-"
				let workingHours = "0h 0m"

				if (status === "presente") {
					checkIn = currentTime
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "tardia") {
					const lateTime = new Date(now)
					lateTime.setHours(9, 30, 0)
					checkIn = lateTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "ausente") {
					checkIn = "-"
					checkOut = "-"
					workingHours = "0h 0m"
				} else if (status === "medio-dia") {
					checkIn = currentTime
					const halfDayOut = new Date(now)
					halfDayOut.setHours(13, 0, 0)
					checkOut = halfDayOut.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })
					workingHours = "4h 0m"
				}

				const newRecord: AttendanceRecord = {
					id: `${employeeId}-${targetDate}`,
					employeeId: employee.employeeId,
					employeeName: employee.employeeName,
					department: employee.department,
					date: targetDate,
					checkIn,
					checkOut,
					status,
					workingHours,
				}

				return [...prev, newRecord]
			}
		})
	}

	const getAttendanceByDate = (date: string): AttendanceRecord[] => {
		return attendanceRecords.filter((record) => record.date === date)
	}

	const getTodayAttendance = (): AttendanceRecord[] => {
		const today = new Date().toISOString().split("T")[0]
		return getAttendanceByDate(today)
	}

	return (
		<AttendanceContext.Provider
			value={{
				attendanceRecords,
				markAttendance,
				getAttendanceByDate,
				getTodayAttendance,
			}}
		>
			{children}
		</AttendanceContext.Provider>
	)
}

export function useAttendance() {
	const context = useContext(AttendanceContext)
	if (context === undefined) {
		throw new Error("useAttendance debe ser usado dentro de un AttendanceProvider")
	}
	return context
}


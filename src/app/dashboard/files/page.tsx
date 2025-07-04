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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
	Folder,
	File,
	Upload,
	Search,
	MoreHorizontal,
	Download,
	Edit,
	Trash2,
	Eye,
	CheckCircle,
	XCircle,
	FolderPlus,
	ChevronRight,
	Home,
	ArrowLeft,
} from "lucide-react"

interface FileItem {
	id: string
	name: string
	type: "folder" | "file"
	size?: string
	modified: string
	status: "pending" | "approved" | "rejected" | "draft"
	author: string
	path: string
	parentPath: string
}

export default function FileManagement() {
	// Handle the case where props or currentUser might be undefined during server-side rendering
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPath, setCurrentPath] = useState("/")
	const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
	const [reviewDialog, setReviewDialog] = useState(false)
	const [uploadDialog, setUploadDialog] = useState(false)
	const [createFolderDialog, setCreateFolderDialog] = useState(false)

	const mockFiles: FileItem[] = [
		// Root level folders
		{
			id: "1",
			name: "Informes financieros",
			type: "folder",
			modified: "2024-01-15",
			status: "approved",
			author: "admin",
			path: "/Reportes Financieros",
			parentPath: "/",
		},
		{
			id: "2",
			name: "Documentos de Recursos Humanos",
			type: "folder",
			modified: "2024-01-14",
			status: "approved",
			author: "manager",
			path: "/Documentos de Recursos Humanos",
			parentPath: "/",
		},
		{
			id: "3",
			name: "Documentos legales",
			type: "folder",
			modified: "2024-01-13",
			status: "approved",
			author: "admin",
			path: "/Documentos legales",
			parentPath: "/",
		},
		{
			id: "4",
			name: "Documentos de marketing",
			type: "folder",
			modified: "2024-01-12",
			status: "approved",
			author: "manager",
			path: "/Documentos de marketing",
			parentPath: "/",
		},

		// Financial Reports subfolders and files
		{
			id: "5",
			name: "Reportes 2024",
			type: "folder",
			modified: "2024-01-16",
			status: "approved",
			author: "Gerente Financiero",
			path: "/Reportes Financieros/Reportes 2024",
			parentPath: "/Reportes Financieros",
		},
		{
			id: "6",
			name: "Reportes 2023",
			type: "folder",
			modified: "2024-01-10",
			status: "approved",
			author: "Gerente Financiero",
			path: "/Reportes Financieros/Reportes 2023",
			parentPath: "/Reportes Financieros",
		},
		{
			id: "7",
			name: "Planificación presupuestaria",
			type: "folder",
			modified: "2024-01-08",
			status: "approved",
			author: "Gerente Financiero",
			path: "/Reportes Financieros/Planificación presupuestaria",
			parentPath: "/Reportes Financieros",
		},
		{
			id: "8",
			name: "Resumen_anual_2023.pdf",
			type: "file",
			size: "3.2 MB",
			modified: "2024-01-15",
			status: "approved",
			author: "Gerente Financiero",
			path: "/Reportes Financieros/Resumen_anual_2023.pdf",
			parentPath: "/Reportes Financieros",
		},

		// 2024 Reports subfolder files
		{
			id: "9",
			name: "Reporte_Q1_2024.pdf",
			type: "file",
			size: "2.1 MB",
			modified: "2024-01-16",
			status: "pending",
			author: "John Doe",
			path: "/Reportes Financieros/Reportes 2024/Reporte_Q1_2024.pdf",
			parentPath: "/Reportes Financieros/Reportes 2024",
		},
		{
			id: "10",
			name: "Reporte_Q4_2024.pdf",
			type: "file",
			size: "2.4 MB",
			modified: "2024-01-16",
			status: "pending",
			author: "John Doe",
			path: "/Reportes Financieros/Reportes 2024/Reporte_Q4_2024.pdf",
			parentPath: "/Reportes Financieros/Reportes 2024",
		},
		{
			id: "11",
			name: "Análisis_mensual",
			type: "folder",
			modified: "2024-01-14",
			status: "approved",
			author: "Analista Financiero",
			path: "/Reportes Financieros/Reportes 2024/Análisis_mensual",
			parentPath: "/Reportes Financieros/Reportes 2024",
		},

		// Monthly Analysis files
		{
			id: "12",
			name: "Análisis_enero.xlsx",
			type: "file",
			size: "1.8 MB",
			modified: "2024-01-14",
			status: "approved",
			author: "Analista Financiero",
			path: "/Reportes Financieros/Reportes 2024/Análisis_mensual/Análisis_enero.xlsx",
			parentPath: "/Reportes Financieros/Reportes 2024/Análisis_mensual",
		},
		{
			id: "13",
			name: "Análisis_febrero.xlsx",
			type: "file",
			size: "1.9 MB",
			modified: "2024-01-14",
			status: "draft",
			author: "Analista Financiero",
			path: "/Reportes Financieros/Reportes 2024/Análisis_mensual/Análisis_febrero.xlsx",
			parentPath: "/Reportes Financieros/Reportes 2024/Análisis_mensual",
		},

		// HR Documents subfolders and files
		{
			id: "14",
			name: "Políticas",
			type: "folder",
			modified: "2024-01-12",
			status: "approved",
			author: "Gerente HR",
			path: "/Documentos de Recursos Humanos/Políticas",
			parentPath: "/Documentos de Recursos Humanos",
		},
		{
			id: "15",
			name: "Registros_empleados",
			type: "folder",
			modified: "2024-01-11",
			status: "approved",
			author: "Gerente HR",
			path: "/Documentos de Recursos Humanos/Registros_empleados",
			parentPath: "/Documentos de Recursos Humanos",
		},
		{
			id: "16",
			name: "Material_de_formación",
			type: "folder",
			modified: "2024-01-10",
			status: "approved",
			author: "Especialista HR",
			path: "/Documentos de Recursos Humanos/Material_de_formación",
			parentPath: "/Documentos de Recursos Humanos",
		},
		{
			id: "17",
			name: "Guía_empleado.docx",
			type: "file",
			size: "1.8 MB",
			modified: "2024-01-15",
			status: "approved",
			author: "Gerente HR",
			path: "/Documentos de Recursos Humanos/Guía_empleado.docx",
			parentPath: "/Documentos de Recursos Humanos",
		},

		// HR Policies files
		{
			id: "18",
			name: "Política_trabajo_remoto.pdf",
			type: "file",
			size: "856 KB",
			modified: "2024-01-12",
			status: "approved",
			author: "Gerente HR",
			path: "/Documentos de Recursos Humanos/Políticas/Política_trabajo_remoto.pdf",
			parentPath: "/Documentos de Recursos Humanos/Políticas",
		},
		{
			id: "19",
			name: "Política_de_licencia.pdf",
			type: "file",
			size: "742 KB",
			modified: "2024-01-11",
			status: "pending",
			author: "Especialista HR",
			path: "/Documentos de Recursos Humanos/Políticas/Política_de_licencia.pdf",
			parentPath: "/Documentos de Recursos Humanos/Políticas",
		},

		// Legal Documents
		{
			id: "20",
			name: "Contratos",
			type: "folder",
			modified: "2024-01-13",
			status: "approved",
			author: "Team Legal",
			path: "/Documentos legales/Contratos",
			parentPath: "/Documentos legales",
		},
		{
			id: "21",
			name: "Cumplimiento",
			type: "folder",
			modified: "2024-01-12",
			status: "approved",
			author: "Team Legal",
			path: "/Documentos legales/Cumplimiento",
			parentPath: "/Documentos legales",
		},

		// Marketing Materials
		{
			id: "22",
			name: "Assets",
			type: "folder",
			modified: "2024-01-12",
			status: "approved",
			author: "Team Marketing",
			path: "/Documentos de Marketing/Brand Assets",
			parentPath: "/Documentos de Marketing",
		},
		{
			id: "23",
			name: "Materiales_de_campana",
			type: "folder",
			modified: "2024-01-11",
			status: "approved",
			author: "Team Marketing",
			path: "/Documentos de Marketing/Materiales_de_campana",
			parentPath: "/Documentos de Marketing",
		},
	]

	// Filter files based on current path and search query
	const getCurrentFolderFiles = () => {
		let files = mockFiles.filter((file) => file.parentPath === currentPath)

		if (searchQuery) {
			// When searching, show all matching files regardless of path
			files = mockFiles.filter(
				(file) =>
					file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
					file.author.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		return files
	}

	const currentFiles = getCurrentFolderFiles()

	// Generate breadcrumb navigation
	const getBreadcrumbs = () => {
		if (currentPath === "/") return [{ name: "Home", path: "/" }]

		const pathParts = currentPath.split("/").filter(Boolean)
		const breadcrumbs = [{ name: "Home", path: "/" }]

		let currentBreadcrumbPath = ""
		pathParts.forEach((part) => {
			currentBreadcrumbPath += `/${part}`
			breadcrumbs.push({ name: part, path: currentBreadcrumbPath })
		})

		return breadcrumbs
	}

	const breadcrumbs = getBreadcrumbs()

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800"
			case "rejected":
				return "bg-red-100 text-red-800"
			case "pending":
				return "bg-yellow-100 text-yellow-800"
			case "draft":
				return "bg-gray-100 text-gray-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const canReview = (file: FileItem) => {
		return true
	}

	const handleReview = (action: "approve" | "reject", comment?: string) => {
		console.log(`${action} file ${selectedFile?.name}`, comment)
		setReviewDialog(false)
		setSelectedFile(null)
	}

	const handleFolderClick = (folder: FileItem) => {
		if (folder.type === "folder") {
			setCurrentPath(folder.path)
			setSearchQuery("") // Clear search when navigating
		}
	}

	const handleBreadcrumbClick = (path: string) => {
		setCurrentPath(path)
		setSearchQuery("") // Clear search when navigating
	}

	const goBack = () => {
		if (currentPath !== "/") {
			const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/"
			setCurrentPath(parentPath)
			setSearchQuery("")
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Gestión de archivos</h1>
					<p className="text-gray-600">Gestiona documentos y carpetas con controles de auditoría</p>
				</div>

				<div className="flex space-x-2">
					<Dialog open={createFolderDialog} onOpenChange={setCreateFolderDialog}>
						<DialogTrigger asChild>
							<Button variant="outline">
								<FolderPlus className="mr-2 h-4 w-4" />
								Nueva carpeta
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Crear nueva carpeta</DialogTitle>
								<DialogDescription>
									Introduce un nombre para la nueva carpeta en {currentPath}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-5">
								<div className="space-y-2">
									<Label htmlFor="folderName">Nombre de la carpeta</Label>
									<Input id="folderName" placeholder="Introduce el nombre de la carpeta" />
								</div>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setCreateFolderDialog(false)}>
										Cancelar
									</Button>
									<Button onClick={() => setCreateFolderDialog(false)} className="bg-blue-500">
										Crear carpeta
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					<Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
						<DialogTrigger asChild>
							<Button className="bg-blue-500">
								<Upload className="mr-2 h-4 w-4" />
								Subir archivo
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Subir archivo</DialogTitle>
								<DialogDescription>
									Selecciona un archivo para subir a {currentPath}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
									<Upload className="mx-auto h-12 w-12 text-gray-400" />
									<p className="mt-2 text-sm text-gray-600">Click para subir o arrastra y suelta</p>
									<p className="text-xs text-gray-500">PDF, DOC, XLS hasta 10MB</p>
								</div>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setUploadDialog(false)}>
										Cancelar
									</Button>
									<Button onClick={() => setUploadDialog(false)} className="bg-blue-500">
										Subir
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Breadcrumb Navigation */}
			{!searchQuery && (
				<div className="flex items-center space-x-2">
					{currentPath !== "/" && (
						<Button variant="ghost" size="sm" onClick={goBack} className="p-1">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					)}
					<nav className="flex items-center space-x-1 text-sm">
						{breadcrumbs.map((crumb, index) => (
							<div key={crumb.path} className="flex items-center">
								{index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleBreadcrumbClick(crumb.path)}
									className={`h-auto p-1 ${
										crumb.path === currentPath
											? "font-medium text-blue-600"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{index === 0 ? <Home className="h-4 w-4" /> : crumb.name}
								</Button>
							</div>
						))}
					</nav>
				</div>
			)}

			<div className="relative">
				<Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
				<Input
					placeholder="Buscar archivos y carpetas..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="rounded-xl bg-white pl-10 shadow"
				/>
			</div>
			{searchQuery && (
				<div className="mt-2 text-sm text-gray-600">
					Resultados de búsqueda para &quot;{searchQuery}&quot; en todos los carpetas
				</div>
			)}

			{/* File List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>
							{searchQuery
								? `Resultados de búsqueda (${currentFiles.length} items)`
								: `${currentPath === "/" ? "Directorio raíz" : currentPath.split("/").pop()} (${currentFiles.length} items)`}
						</span>
						{!searchQuery && currentPath !== "/" && (
							<Badge variant="outline" className="text-xs">
								{currentPath}
							</Badge>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{currentFiles.length === 0 ? (
						<div className="py-8 text-center text-gray-500">
							{searchQuery
								? "No se encontraron archivos que coincidan con su búsqueda."
								: "Esta carpeta está vacía."}
						</div>
					) : (
						<div className="space-y-2">
							{currentFiles.map((file) => (
								<div
									key={file.id}
									className={`flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 ${
										file.type === "folder" ? "cursor-pointer" : ""
									}`}
									onClick={() => file.type === "folder" && handleFolderClick(file)}
								>
									<div className="flex items-center space-x-3">
										{file.type === "folder" ? (
											<Folder className="h-5 w-5 text-blue-600" />
										) : (
											<File className="h-5 w-5 text-gray-600" />
										)}
										<div>
											<p className="flex items-center font-medium">
												{file.name}
												{file.type === "folder" && (
													<ChevronRight className="ml-1 h-4 w-4 text-gray-400" />
												)}
											</p>
											<p className="text-sm text-gray-500">
												{file.size && `${file.size} • `}Modificado {file.modified} por {file.author}
												{searchQuery && (
													<span className="ml-2 text-blue-600">
														en {file.parentPath === "/" ? "Directorio raíz" : file.parentPath}
													</span>
												)}
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Badge className={getStatusColor(file.status)}>
											{file.status === "pending"
												? "Pendiente"
												: file.status === "approved"
													? "Aprobado"
													: "Rechazado"}
										</Badge>

										{canReview(file) && file.type === "file" && (
											<div className="flex space-x-1">
												<Button
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.stopPropagation()
														setSelectedFile(file)
														setReviewDialog(true)
													}}
												>
													<Eye className="h-4 w-4" />
												</Button>
											</div>
										)}

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{file.type === "file" && (
													<DropdownMenuItem>
														<Download className="mr-2 h-4 w-4" />
														Descargar
													</DropdownMenuItem>
												)}
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													Renombrar
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="mr-2 h-4 w-4" />
													Eliminar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Review Dialog */}
			<Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Revisión de documento</DialogTitle>
						<DialogDescription>
							Revisa y proporciona comentarios para: {selectedFile?.name}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="rounded-lg bg-gray-50 p-3">
							<p className="text-sm text-gray-600">Ubicación del archivo:</p>
							<p className="font-medium">{selectedFile?.path}</p>
						</div>
						<div>
							<Label htmlFor="comment">Comentario (Opcional)</Label>
							<Textarea id="comment" placeholder="Add your review comments..." className="mt-1" />
						</div>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => handleReview("reject")}
								className="border-red-200 text-red-600 hover:bg-red-50"
							>
								<XCircle className="mr-2 h-4 w-4" />
								Rechazar
							</Button>
							<Button
								onClick={() => handleReview("approve")}
								className="bg-green-600 hover:bg-green-700"
							>
								<CheckCircle className="mr-2 h-4 w-4" />
								Aprobar
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

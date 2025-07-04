import { Manrope } from "next/font/google"

import "./globals.css"

import type { Metadata } from "next"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "DBJ Dashboard - Gestión de archivos & Sistemas de asistencia",
	description: "Gestión de archivos y seguimiento de asistencia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={manrope.className}>{children}</body>
		</html>
	)
}

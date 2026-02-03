import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reclama.AI - Conecta con el abogado perfecto",
  description: "Plataforma inteligente para conectar casos legales con abogados calificados",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

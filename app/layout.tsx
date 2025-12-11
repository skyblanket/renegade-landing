import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start"
})

export const metadata: Metadata = {
  title: "Renegade - Prediction Markets Reimagined",
  description: "Swipe. Predict. Flex. The social prediction market where creators prove they called it.",
  generator: "v0.app",
  icons: {
    icon: "/images/img-3916.jpg",
    apple: "/images/img-3916.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${pressStart2P.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import './globals.css'
import type { Metadata } from 'next'
import { Josefin_Sans } from 'next/font/google'
import Footer from "@/app/_components/footer";

const josefinSans = Josefin_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "blink — by bymse",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={josefinSans.className}>
        {children}
        <Footer/>
      </body>
    </html>
  )
}

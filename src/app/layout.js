// src/app/layout.js
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'TalentoNova - Abroad Education & Job Consultancy',
  description:
    'Expert guidance for studying and working abroad. UK, USA, Canada, Australia.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#FFF6DE',
          color: '#3E2C23',
        }}
      >
        <AuthProvider>
          <Navbar />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
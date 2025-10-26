
import { Geist, } from 'next/font/google'
import '../styles/main.scss'
import '../styles/modal-animations.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui'



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body  >
        <QueryProvider>
          <ToastProvider>
            <div className="mainStyles" >
              {children}
            </div>

          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

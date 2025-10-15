
import { Geist, } from 'next/font/google'
import '../styles/main.scss'
import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout'
import { QueryProvider } from '@/components/providers/QueryProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${geistSans.variable}  `}>
        <QueryProvider>
          <div className="parent">
            <WithNavbarLayout>
            <div className="mainStyles">
              {children}
            </div>
            </WithNavbarLayout>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}

import { ReactNode } from 'react'
interface WithHeaderLayoutProps {
  children: ReactNode
}
function Header() {
  return (
    <header
      style={{
        height: 60,
        background: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      هدر سفارشی
    </header>
  )
}
export default function WithHeaderLayout({ children }: WithHeaderLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

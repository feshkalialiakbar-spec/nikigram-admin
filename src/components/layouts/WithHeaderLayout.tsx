import { ReactNode } from 'react'
interface WithHeaderLayoutProps {
  children: ReactNode
}

export default function WithHeaderLayout({ children }: WithHeaderLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}

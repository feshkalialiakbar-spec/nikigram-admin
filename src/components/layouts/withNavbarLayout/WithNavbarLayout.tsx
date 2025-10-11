'use client'
import { ReactNode, useState } from 'react'
import styles from './WithNavbarLayout.module.scss'
import TopNavigation from '@/components/hub/TopNavigation/TopNavigation'
import SidebarMenu from '@/components/hub/SideBar/SidebarMenu'
interface WithNavbarLayoutProps {
  children: ReactNode
  className?: string
}

export default function WithNavbarLayout({
  children,
  className,
}: WithNavbarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className={styles.container}>
      <TopNavigation />

      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpen={() => setIsSidebarOpen(true)}
      />
      <main className={`${styles['body-container']} ${className ?? ''}`}>
        {children}
      </main>
    </div>
  )
}

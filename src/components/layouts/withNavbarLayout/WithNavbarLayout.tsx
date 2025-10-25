'use client'
import { ReactNode, useState } from 'react'
import styles from './WithNavbarLayout.module.scss'
import TopNavigation from '@/components/hub/TopNavigation/TopNavigation'
import SidebarMenu from '@/components/hub/SideBar/SidebarMenu'
interface WithNavbarLayoutProps {
  children: ReactNode

}

export default function WithNavbarLayout({
  children,

}: WithNavbarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={styles.container}>
      <TopNavigation />

      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpen={() => setIsSidebarOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className={`${styles.mainContent} ${isSidebarOpen ? (isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentOpen) : styles.mainContentClosed}`}>
        {children}
      </main>
    </div >
  )
}

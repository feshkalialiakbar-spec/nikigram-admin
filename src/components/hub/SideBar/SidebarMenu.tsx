'use client'
import { useState, useEffect,  useCallback, } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CloseSquare, SearchNormal, ArrowLeft2, Menu } from 'iconsax-react'
import styles from './SidebarMenu.module.scss'
import { quickActions, TaskMenuItem } from './items'
 
import Link from 'next/link'
import { SidebarSkeleton } from '@/components/ui/SidebarSkeleton'
import Button from '@/components/ui/actions/button/Button'
interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
  loading?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}


const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  onOpen,
  loading = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string>('')
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [selectedParent, setSelectedParent] = useState<TaskMenuItem | null>(null)

  const handleItemClick = useCallback((href: string) => {
    setActiveItem(href)
    router.push(href)
    // Close children dock when navigating to a child item
    setSelectedParent(null)
  }, [router])

  const handleParentToggle = useCallback((label: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }, [])

  const handleRailClickWhenOpen = useCallback((action: {
    href: string
    label: string
    children?: TaskMenuItem['children']
  }) => {
    if (action.children && action.children.length > 0) {
      // If this parent is already selected, toggle its expansion
      if (selectedParent && selectedParent.label === action.label) {
        handleParentToggle(action.label)
        // If collapsing, hide the children dock
        if (expandedParents.has(action.label)) {
          setSelectedParent(null)
        }
      } else {
        // Select this parent and expand it
        handleParentToggle(action.label)
        setSelectedParent(action as unknown as TaskMenuItem)
      }
    } else {
      // Navigate if no children
      handleItemClick(action.href)
      setSelectedParent(null)
    }
  }, [selectedParent, expandedParents, handleParentToggle, handleItemClick])



  // Initialize active item based on current pathname
  useEffect(() => {
    if (pathname) {
      // Check if pathname matches any parent or child item
      for (const action of quickActions) {
        if (action.href === pathname) {
          setActiveItem(pathname)
          setSelectedParent(null)
          return
        }
        if (action.children) {
          for (const child of action.children) {
            if (child.href === pathname) {
              setActiveItem(pathname)
              // Ensure the matched parent's children are expanded when open
              setExpandedParents((prev) => {
                const newSet = new Set(prev)
                newSet.add(action.label)
                return newSet
              })
              setSelectedParent(action)
              return
            }
          }
        }
      }
      // If no exact match found, check for partial matches (for nested routes)
      for (const action of quickActions) {
        if (pathname.startsWith(action.href) && action.href !== '/') {
          setActiveItem(action.href)
          setSelectedParent(null)
          return
        }
        if (action.children) {
          for (const child of action.children) {
            if (pathname.startsWith(child.href) && child.href !== '/') {
              setActiveItem(child.href)
              setExpandedParents((prev) => {
                const newSet = new Set(prev)
                newSet.add(action.label)
                return newSet
              })
              setSelectedParent(action)
              return
            }
          }
        }
      }
    }
  }, [pathname])

  // Initialize device detection
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 900)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => {
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])

  // Handle escape key to close drawer and cleanup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])


  return (
    <>
      {loading ? (
        <SidebarSkeleton />
      ) : (
        <>
          <div className={`${styles.rail} ${isOpen ? styles.railOpen : ''} ${isCollapsed ? styles.railCollapsed : ''}`} style={{ scrollbarWidth: 'none' }}>
            {isOpen && !isDesktop && (
              <Button buttonClassName={styles.closeButton} onClick={onClose}>
                <CloseSquare
                  size={18}
                  variant="Outline"
                  color="currentColor"
                  className={styles.icon}
                />
              </Button>
            )}
            {isOpen && isDesktop && onToggleCollapse && (
              <Button buttonClassName={styles.collapseButton} onClick={onToggleCollapse}>
                <Menu
                  size={18}
                  variant="Outline"
                  color="currentColor"
                  className={styles.icon}
                />
              </Button>
            )}
            {isOpen && !isCollapsed && selectedParent && selectedParent.children?.length && (
              <div className={styles.searchBox}>
                <SearchNormal
                  size={16}
                  variant="Outline"
                  color="var(--gray-500)"
                  className={styles.searchIcon}
                />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className={styles.searchInput}
                />
              </div>
            )}
            <div
              className={`${styles.columns} ${isOpen && !isCollapsed && selectedParent && selectedParent.children?.length
                ? styles.withDock
                : ''
                }`}
            >
              <div className={styles.menuCol}>
                <div className={styles.menuItems}>
                  {quickActions.map((action, idx) => (
                    <div key={idx} className={styles.menuItemWrapper}>
                      {(() => {
                        const isParentActive =
                          activeItem === action.href ||
                          (!!action.children && action.children.some((c) => c.href === activeItem)) ||
                          (selectedParent && selectedParent.label === action.label)
                        return (
                          <Button
                            buttonClassName={`${styles.parentItem} ${isParentActive ? styles.active : ''}`}
                            onClick={() => {
                              if (isOpen) {
                                handleRailClickWhenOpen(action)
                              } else if (onOpen) {
                                onOpen()
                              }
                            }}
                            title={action.label}
                          >
                            <action.icon
                              size={isOpen ? 20 : 24}
                              variant="Bulk"
                              color="currentColor"
                              className={styles.icon}
                            />
                            {isOpen && !isCollapsed && !(selectedParent && selectedParent.children?.length) && (
                              <span className={styles.itemLabel}>{action.label}</span>
                            )}
                          </Button>
                        )
                      })()}
                    </div>
                  ))}
                </div>
              </div>
              {isOpen && !isCollapsed && selectedParent && selectedParent.children?.length ? (
                <div className={styles.childrenDock}>
                  <div className={styles.childrenPopupContent}>
                    <Link href={selectedParent.href} className={styles.childrenPopupHeader}>
                      <ArrowLeft2
                        size={16}
                        variant="Bold"
                        color="currentColor"
                        className={styles.icon}
                      />
                      {selectedParent.label}</Link>
                    <div className={styles.childrenPopupList}>
                      {selectedParent.children.map((child, idx) => (
                        <Link
                          key={`dock-${idx}`}
                          className={`${styles.childrenPopupItem} ${activeItem === child.href ? styles.active : ''
                            }`}
                          href={child.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleItemClick(child.href)
                          }}
                        >
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {isOpen && !isDesktop && (
            <div className={styles.overlay} onClick={onClose} />
          )}
        </>
      )}
    </>
  )
}

export default SidebarMenu

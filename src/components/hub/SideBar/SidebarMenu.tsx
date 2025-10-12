'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CloseSquare, SearchNormal, ArrowLeft2 } from 'iconsax-react'
import styles from './SidebarMenu.module.scss'
import { quickActions, TaskMenuItem } from './items'
import { SidebarSkeleton } from '@/components/ui'
import Link from 'next/link'
interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
  loading?: boolean
}


const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  onOpen,
  loading = false,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string>('')
  const childrenPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const railIconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())
  const [showShortcutToolbox, setShowShortcutToolbox] = useState<boolean>(false)
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, { key: string; description: string }>>({})
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [selectedParent, setSelectedParent] = useState<TaskMenuItem | null>(null)

  const handleItemClick = useCallback((href: string, _label: string) => {
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
      handleItemClick(action.href, action.label)
      setSelectedParent(null)
    }
  }, [selectedParent, expandedParents, handleParentToggle, handleItemClick])


  // Cookie management for shortcuts
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }
  const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`
  }

  // Default shortcuts
  const defaultShortcuts = {
    toggleSidebar: { key: 'Ctrl+Alt+F', description: 'باز/بستن منوی کناری' },
    toggleShortcuts: {
      key: 'Ctrl+Shift+K',
      description: 'نمایش/مخفی کردن کلیدهای میانبر',
    },
    navigateUp: { key: 'ArrowUp', description: 'حرکت به بالا در منو' },
    navigateDown: { key: 'ArrowDown', description: 'حرکت به پایین در منو' },
    navigateLeft: { key: 'ArrowLeft', description: 'حرکت به چپ در منو' },
    navigateRight: { key: 'ArrowRight', description: 'حرکت به راست در منو' },
    activate: { key: 'Enter', description: 'فعال‌سازی آیتم انتخاب شده' },
    close: { key: 'Escape', description: 'بستن منو یا لغو' },
  }

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

  // Initialize device detection and shortcuts
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 900)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    // Load custom shortcuts from cookies
    const savedShortcuts = getCookie('sidebarShortcuts')
    if (savedShortcuts) {
      try {
        setCustomShortcuts(JSON.parse(savedShortcuts))
      } catch (_e) {
        setCustomShortcuts(defaultShortcuts)
      }
    } else {
      setCustomShortcuts(defaultShortcuts)
    }

    return () => {
      window.removeEventListener('resize', checkDesktop)
    }
  }, [defaultShortcuts])

  // Save shortcuts to cookies when changed
  useEffect(() => {
    setCookie('sidebarShortcuts', JSON.stringify(customShortcuts))
  }, [customShortcuts])

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
      document.body.style.overflow = 'hidden'
    } else {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      if (childrenPopupTimeoutRef.current) {
        clearTimeout(childrenPopupTimeoutRef.current)
      }
    }
  }, [isOpen, onClose, childrenPopupTimeoutRef])

  // Enhanced keyboard shortcuts with custom key support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Check for toggle sidebar shortcut
      const toggleKey = customShortcuts.toggleSidebar?.key || 'Ctrl+Alt+F'
      const isToggle = checkShortcut(e, toggleKey)
      if (isToggle) {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          onOpen && onOpen()
        }
        return
      }

      // Check for toggle shortcuts toolbox
      const shortcutsKey =
        customShortcuts.toggleShortcuts?.key || 'Ctrl+Shift+K'
      const isToggleShortcuts = checkShortcut(e, shortcutsKey)
      if (isToggleShortcuts) {
        e.preventDefault()
        setShowShortcutToolbox(!showShortcutToolbox)
        return
      }

      if (!isOpen) return

      // Enhanced navigation with left/right support
      const upKey = customShortcuts.navigateUp?.key || 'ArrowUp'
      const downKey = customShortcuts.navigateDown?.key || 'ArrowDown'
      const leftKey = customShortcuts.navigateLeft?.key || 'ArrowLeft'
      const rightKey = customShortcuts.navigateRight?.key || 'ArrowRight'
      const activateKey = customShortcuts.activate?.key || 'Enter'

      if (checkShortcut(e, downKey)) {
        e.preventDefault()
        const next = (focusedIndex + 1) % quickActions.length
        setFocusedIndex(next)
        return
      }

      if (checkShortcut(e, upKey)) {
        e.preventDefault()
        const prev =
          (focusedIndex - 1 + quickActions.length) % quickActions.length
        setFocusedIndex(prev)
        return
      }

      // Left/Right navigation for future grid layout support
      if (checkShortcut(e, leftKey)) {
        e.preventDefault()
        const prev =
          (focusedIndex - 1 + quickActions.length) % quickActions.length
        setFocusedIndex(prev)
        return
      }

      if (checkShortcut(e, rightKey)) {
        e.preventDefault()
        const next = (focusedIndex + 1) % quickActions.length
        setFocusedIndex(next)
        return
      }

      if (checkShortcut(e, activateKey)) {
        e.preventDefault()
        const current = quickActions[focusedIndex]
        if (current) {
          handleRailClickWhenOpen(current)
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [
    isOpen,
    onClose,
    onOpen,
    focusedIndex,
    customShortcuts,
    showShortcutToolbox,
    handleRailClickWhenOpen,
  ])

  // Helper function to check if pressed keys match shortcut
  const checkShortcut = (e: KeyboardEvent, shortcut: string) => {
    const parts = shortcut.toLowerCase().split('+')
    const key = parts[parts.length - 1].toLowerCase()

    let ctrl = false,
      alt = false,
      shift = false,
      meta = false

    if (parts.includes('ctrl')) ctrl = true
    if (parts.includes('alt')) alt = true
    if (parts.includes('shift')) shift = true
    if (parts.includes('meta')) meta = true

    return (
      e.ctrlKey === ctrl &&
      e.altKey === alt &&
      e.shiftKey === shift &&
      e.metaKey === meta &&
      e.key.toLowerCase() === key
    )
  }

  return (
    <>
      {loading ? (
        <SidebarSkeleton />
      ) : (
        <>
          <div className={`${styles.rail} ${isOpen ? styles.railOpen : ''}`} style={{ scrollbarWidth: 'none' }}>
            {isOpen && !isDesktop && (
              <button className={styles.closeButton} onClick={onClose}>
                <CloseSquare
                  size={18}
                  variant="Outline"
                  color="currentColor"
                  className={styles.icon}
                />
              </button>
            )}
            {isOpen && selectedParent && selectedParent.children?.length && (
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
              className={`${styles.columns} ${isOpen && selectedParent && selectedParent.children?.length
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
                          <button
                            ref={(el) => {
                              railIconRefs.current[idx] = el
                            }}
                            className={`${styles.parentItem} ${isParentActive ? styles.active : ''}`}
                            aria-expanded={expandedParents.has(action.label)}
                            onClick={() =>
                              isOpen ? handleRailClickWhenOpen(action) : onOpen && onOpen()
                            }
                            title={action.label}
                          >
                            <action.icon
                              size={isOpen ? 20 : 24}
                              variant="Bulk"
                              color="currentColor"
                              className={styles.icon}
                            />
                            {isOpen && !(selectedParent && selectedParent.children?.length) && (
                              <span className={styles.itemLabel}>{action.label}</span>
                            )}
                          </button>
                        )
                      })()}
                    </div>
                  ))}
                </div>
              </div>
              {isOpen && selectedParent && selectedParent.children?.length ? (
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
                            handleItemClick(child.href, child.label)
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

'use client'
import { useState, useMemo, useEffect } from 'react'
import { Task, FilterOptions, PaginationInfo } from '@/types/task'
import FilterBar from './FilterBar'
import TaskTable from './TaskTable'
import Pagination from './Pagination' 
import styles from './TaskDashboard.module.scss'
import { getTasks } from '@/services/task'

// Mock data removed; data will be fetched from API and normalized in service

const TaskDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    process: '',
    date: '',
    performerPersonnel: '',
    status: '',
    operations: '',
  })
  const [data, setData] = useState<Task[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return data.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.taskName.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.process.toLowerCase().includes(filters.search.toLowerCase())

      const matchesProcess =
        !filters.process || task.process === filters.process
      const matchesDate = !filters.date || task.date === filters.date
      const matchesPerformerPersonnel = 
        !filters.performerPersonnel || 
        task.performerPersonnel.some(person => person.id === filters.performerPersonnel)
      const matchesStatus = !filters.status || task.status === filters.status
      const matchesOperations = !filters.operations || task.operation.type === filters.operations

      return matchesSearch && matchesProcess && matchesDate && matchesPerformerPersonnel && matchesStatus && matchesOperations
    })
  }, [filters, data])

  // Paginate filtered tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredTasks.slice(startIndex, endIndex)
  }, [filteredTasks, currentPage, itemsPerPage])

  const pagination: PaginationInfo = {
    currentPage,
    totalPages: Math.ceil(filteredTasks.length / itemsPerPage),
    totalItems: filteredTasks.length,
    itemsPerPage,
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleOperationClick = (taskId: string, operation: string) => {
    console.log(`Operation ${operation} clicked for task ${taskId}`)
    // Here you would typically navigate to a detail page or open a modal
  }


  useEffect(() => {
    getTasks().then((data: Task[]) => {
      setData(data)
    })
  }, [])

  return (
    <div className={styles.dashboard}>


      <div className={styles.mainContent}>
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <TaskTable
          tasks={paginatedTasks}
          onOperationClick={handleOperationClick}
        />

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default TaskDashboard

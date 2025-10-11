import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDashboard from '../TaskDashboard';
import { FilterOptions } from '@/types/task';

// Mock the child components
jest.mock('../FilterBar', () => {
  return function MockFilterBar({ filters, onFilterChange }: { filters: FilterOptions; onFilterChange: (filters: FilterOptions) => void }) {
    return (
      <div data-testid="filter-bar">
        <input
          data-testid="search-input"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="جستجو"
        />
        <select
          data-testid="process-select"
          value={filters.process}
          onChange={(e) => onFilterChange({ ...filters, process: e.target.value })}
        >
          <option value="">انتخاب فرآیند</option>
          <option value="cooperation">درخواست همکاری</option>
        </select>
      </div>
    );
  };
});

jest.mock('../TaskTable', () => {
  return function MockTaskTable({ tasks, onOperationClick }: { tasks: any[]; onOperationClick: (taskId: string, operation: string) => void }) {
    return (
      <div data-testid="task-table">
        {tasks.map((task) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            <span>{task.taskName}</span>
            <button onClick={() => onOperationClick(task.id, task.operation.type)}>
              {task.operation.label}
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../Pagination', () => {
  return function MockPagination({ pagination, onPageChange }: { pagination: any; onPageChange: (page: number) => void }) {
    return (
      <div data-testid="pagination">
        <button onClick={() => onPageChange(pagination.currentPage - 1)}>Previous</button>
        <span data-testid="current-page">{pagination.currentPage}</span>
        <button onClick={() => onPageChange(pagination.currentPage + 1)}>Next</button>
      </div>
    );
  };
});

jest.mock('../SidebarMenu', () => {
  return function MockSidebarMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
      <div data-testid="sidebar-menu" style={{ display: isOpen ? 'block' : 'none' }}>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../layouts/TopNavigation', () => {
  return function MockTopNavigation({ onMenuToggle, isMenuOpen }: { onMenuToggle: () => void; isMenuOpen: boolean }) {
    return (
      <div data-testid="top-navigation">
        <button onClick={onMenuToggle}>Toggle Menu</button>
        <span data-testid="menu-state">{isMenuOpen ? 'open' : 'closed'}</span>
      </div>
    );
  };
});

describe('TaskDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with all components', () => {
    render(<TaskDashboard />);
    
    expect(screen.getByTestId('top-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('task-table')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('displays mock tasks correctly', () => {
    render(<TaskDashboard />);
    
    // Check if tasks are rendered (should have 15 mock tasks)
    const taskElements = screen.getAllByTestId(/task-\d+/);
    expect(taskElements).toHaveLength(15);
    
    // Check first task
    expect(screen.getByTestId('task-0')).toBeInTheDocument();
    expect(screen.getByText('بررسی دست نیکی')).toBeInTheDocument();
  });

  test('handles search filter correctly', async () => {
    render(<TaskDashboard />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'بررسی' } });
    
    await waitFor(() => {
      // Should still show tasks since they match the search
      const taskElements = screen.getAllByTestId(/task-\d+/);
      expect(taskElements.length).toBeGreaterThan(0);
    });
  });

  test('handles process filter correctly', async () => {
    render(<TaskDashboard />);
    
    const processSelect = screen.getByTestId('process-select');
    fireEvent.change(processSelect, { target: { value: 'cooperation' } });
    
    await waitFor(() => {
      // Should show filtered tasks
      const taskElements = screen.getAllByTestId(/task-\d+/);
      expect(taskElements.length).toBeGreaterThan(0);
    });
  });

  test('handles pagination correctly', async () => {
    render(<TaskDashboard />);
    
    const currentPageElement = screen.getByTestId('current-page');
    expect(currentPageElement).toHaveTextContent('1');
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(currentPageElement).toHaveTextContent('2');
    });
  });

  test('handles sidebar menu toggle', async () => {
    render(<TaskDashboard />);
    
    const toggleButton = screen.getByText('Toggle Menu');
    const menuState = screen.getByTestId('menu-state');
    const sidebarMenu = screen.getByTestId('sidebar-menu');
    
    expect(menuState).toHaveTextContent('closed');
    expect(sidebarMenu).toHaveStyle({ display: 'none' });
    
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(menuState).toHaveTextContent('open');
      expect(sidebarMenu).toHaveStyle({ display: 'block' });
    });
  });

  test('handles sidebar menu close', async () => {
    render(<TaskDashboard />);
    
    const toggleButton = screen.getByText('Toggle Menu');
    const closeButton = screen.getByText('Close');
    
    // Open sidebar first
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar-menu')).toHaveStyle({ display: 'block' });
    });
    
    // Close sidebar
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar-menu')).toHaveStyle({ display: 'none' });
    });
  });

  test('handles task operation clicks', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<TaskDashboard />);
    
    const operationButtons = screen.getAllByText('انجام عملیات');
    fireEvent.click(operationButtons[0]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Operation perform clicked for task 0');
    
    consoleSpy.mockRestore();
  });

  test('resets to first page when filters change', async () => {
    render(<TaskDashboard />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    });
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });
  });

  test('calculates pagination correctly', () => {
    render(<TaskDashboard />);
    
    // With 15 mock tasks and 15 items per page, should have 1 page
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
  });
});

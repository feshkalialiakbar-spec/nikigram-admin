import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterBar from '../FilterBar';
import { FilterOptions } from '@/types/task';

describe('FilterBar', () => {
  const mockFilters: FilterOptions = {
    search: '',
    process: '',
    date: '',
    status: '',
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter inputs', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByPlaceholderText('جستجو')).toBeInTheDocument();
    expect(screen.getByDisplayValue('انتخاب فرآیند')).toBeInTheDocument();
    expect(screen.getByDisplayValue('وضعیت')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
  });

  test('handles search input changes', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('جستجو');
    fireEvent.change(searchInput, { target: { value: 'بررسی دست نیکی' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      search: 'بررسی دست نیکی',
    });
  });

  test('handles process selection changes', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const processSelect = screen.getByDisplayValue('انتخاب فرآیند');
    fireEvent.change(processSelect, { target: { value: 'cooperation' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      process: 'cooperation',
    });
  });

  test('handles date input changes', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const dateInput = screen.getByRole('button', { name: /calendar/i }).closest('div')?.querySelector('input[type="date"]');
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...mockFilters,
        date: '2024-01-15',
      });
    }
  });

  test('handles status selection changes', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const statusSelect = screen.getByDisplayValue('وضعیت');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      status: 'pending',
    });
  });

  test('displays all process options correctly', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const processSelect = screen.getByDisplayValue('انتخاب فرآیند');
    
    expect(processSelect).toContainHTML('<option value="cooperation">درخواست همکاری</option>');
    expect(processSelect).toContainHTML('<option value="help">درخواست کمک</option>');
    expect(processSelect).toContainHTML('<option value="template">تمپلیت پروژه</option>');
    expect(processSelect).toContainHTML('<option value="critical">بحرانی شدن پروژه</option>');
    expect(processSelect).toContainHTML('<option value="tender">مناقصه</option>');
    expect(processSelect).toContainHTML('<option value="comments">نظرات</option>');
    expect(processSelect).toContainHTML('<option value="support">پشتیبانی</option>');
    expect(processSelect).toContainHTML('<option value="sales">مدیریت فروش</option>');
    expect(processSelect).toContainHTML('<option value="profile">پروفایل</option>');
    expect(processSelect).toContainHTML('<option value="financial">مالی</option>');
    expect(processSelect).toContainHTML('<option value="niki-yar">نیکی یار</option>');
    expect(processSelect).toContainHTML('<option value="pos">درخواست پوز</option>');
  });

  test('displays all status options correctly', () => {
    render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const statusSelect = screen.getByDisplayValue('وضعیت');
    
    expect(statusSelect).toContainHTML('<option value="pending">در انتظار انجام</option>');
    expect(statusSelect).toContainHTML('<option value="stopped">متوقف شده</option>');
    expect(statusSelect).toContainHTML('<option value="rejected">رد شده</option>');
    expect(statusSelect).toContainHTML('<option value="completed">انجام شده</option>');
  });

  test('maintains filter values when other filters change', () => {
    const filtersWithValues: FilterOptions = {
      search: 'test search',
      process: 'cooperation',
      date: '2024-01-15',
      status: 'pending',
    };

    render(<FilterBar filters={filtersWithValues} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('جستجو');
    expect(searchInput).toHaveValue('test search');
    
    const processSelect = screen.getByDisplayValue('درخواست همکاری');
    expect(processSelect).toBeInTheDocument();
    
    const statusSelect = screen.getByDisplayValue('در انتظار انجام');
    expect(statusSelect).toBeInTheDocument();
  });

  test('preserves existing filter values when updating a single filter', () => {
    const filtersWithValues: FilterOptions = {
      search: 'existing search',
      process: 'existing process',
      date: '2024-01-01',
      status: 'existing status',
    };

    render(<FilterBar filters={filtersWithValues} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('جستجو');
    fireEvent.change(searchInput, { target: { value: 'new search' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'new search',
      process: 'existing process',
      date: '2024-01-01',
      status: 'existing status',
    });
  });

  test('renders with correct CSS classes', () => {
    const { container } = render(<FilterBar filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    expect(container.querySelector('.filterBar')).toBeInTheDocument();
    expect(container.querySelector('.filterContainer')).toBeInTheDocument();
    expect(container.querySelector('.searchInput')).toBeInTheDocument();
  });
});

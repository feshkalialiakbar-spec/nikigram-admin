'use client';

import { useEffect, useState } from 'react';
import { type CharityOrganization, type CharityListParams } from '@/services/charity';
import { getImageUrl } from '@/utils/imageUtils';
import styles from './CharityList.module.scss';
import { Edit, SearchNormal } from 'iconsax-react';

// SVG Icons
const PlusIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="white" opacity="0.4" />
      <path d="M18 11.25H12.75V6C12.75 5.59 12.41 5.25 12 5.25C11.59 5.25 11.25 5.59 11.25 6V11.25H6C5.59 11.25 5.25 11.59 5.25 12C5.25 12.41 5.59 12.75 6 12.75H11.25V18C11.25 18.41 11.59 18.75 12 18.75C12.41 18.75 12.75 18.41 12.75 18V12.75H18C18.41 12.75 18.75 12.41 18.75 12C18.75 11.59 18.41 11.25 18 11.25Z" fill="white" />
    </g>
  </svg>
);

const DropdownIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z" fill="#1F2B37" opacity="0.4" />
      <path d="M17.92 8.18H11.69L15.48 13.23L18.69 10.02C19.36 9.34 18.88 8.18 17.92 8.18Z" fill="#1F2B37" />
    </g>
  </svg>
);




const DeleteIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M21.07 5.23C19.46 5.07 17.85 4.95 16.23 4.86V4.85L16.01 3.55C15.86 2.63 15.64 1.25 13.3 1.25H10.68C8.35 1.25 8.13 2.57 7.97 3.54L7.76 4.82C6.83 4.88 5.9 4.94 4.97 5.03L2.93 5.23C2.51 5.27 2.21 5.64 2.25 6.05C2.29 6.46 2.65 6.76 3.07 6.72L5.11 6.52C10.35 6 15.63 6.2 20.93 6.73C20.96 6.73 20.98 6.73 21.01 6.73C21.39 6.73 21.72 6.44 21.76 6.05C21.79 5.64 21.49 5.27 21.07 5.23Z" fill="#E70218" />
      <path d="M19.23 8.14C18.99 7.89 18.66 7.75 18.32 7.75H5.68C5.34 7.75 5 7.89 4.77 8.14C4.54 8.39 4.41 8.73 4.43 9.08L5.05 19.34C5.16 20.86 5.3 22.76 8.79 22.76H15.21C18.7 22.76 18.84 20.87 18.95 19.34L19.57 9.09C19.59 8.73 19.46 8.39 19.23 8.14Z" fill="#E70218" opacity="0.3991" />
      <path d="M9.58 17C9.58 16.5858 9.91579 16.25 10.33 16.25H13.66C14.0742 16.25 14.41 16.5858 14.41 17C14.41 17.4142 14.0742 17.75 13.66 17.75H10.33C9.91579 17.75 9.58 17.4142 9.58 17Z" fill="#E70218" fillRule="evenodd" clipRule="evenodd" />
      <path d="M8.75 13C8.75 12.5858 9.08579 12.25 9.5 12.25H14.5C14.9142 12.25 15.25 12.5858 15.25 13C15.25 13.4142 14.9142 13.75 14.5 13.75H9.5C9.08579 13.75 8.75 13.4142 8.75 13Z" fill="#E70218" fillRule="evenodd" clipRule="evenodd" />
    </g>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg fill="none" viewBox="0 0 32 32" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M21.5867 2.66667H10.4133C5.56 2.66667 2.66667 5.56 2.66667 10.4133V21.5733C2.66667 26.44 5.56 29.3333 10.4133 29.3333H21.5733C26.4267 29.3333 29.32 26.44 29.32 21.5867V10.4133C29.3333 5.56 26.44 2.66667 21.5867 2.66667Z" fill="#007BFF" opacity="0.4" />
      <path d="M17.68 21.7067C17.4267 21.7067 17.1733 21.6133 16.9733 21.4133L12.2667 16.7067C11.88 16.32 11.88 15.68 12.2667 15.2933L16.9733 10.5867C17.36 10.2 18 10.2 18.3867 10.5867C18.7733 10.9733 18.7733 11.6133 18.3867 12L14.3867 16L18.3867 20C18.7733 20.3867 18.7733 21.0267 18.3867 21.4133C18.2 21.6133 17.9467 21.7067 17.68 21.7067Z" fill="#007BFF" />
      <path d="M32 0H0V32H32V0Z" fill="#007BFF" opacity="0" />
    </g>
  </svg>
);

const ChevronRightIcon = () => (
  <svg fill="none" viewBox="0 0 32 32" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M21.5867 2.66667H10.4133C5.56 2.66667 2.66667 5.56 2.66667 10.4133V21.5733C2.66667 26.44 5.56 29.3333 10.4133 29.3333H21.5733C26.4267 29.3333 29.32 26.44 29.32 21.5867V10.4133C29.3333 5.56 26.44 2.66667 21.5867 2.66667Z" fill="#007BFF" opacity="0.4" />
      <path d="M14.32 21.7067C14.0667 21.7067 13.8133 21.6133 13.6133 21.4133C13.2267 21.0267 13.2267 20.3867 13.6133 20L17.6133 16L13.6133 12C13.2267 11.6133 13.2267 10.9733 13.6133 10.5867C14 10.2 14.64 10.2 15.0267 10.5867L19.7333 15.2933C20.12 15.68 20.12 16.32 19.7333 16.7067L15.0267 21.4133C14.8267 21.6133 14.5733 21.7067 14.32 21.7067Z" fill="#007BFF" />
      <path d="M32 0H0V32H32V0Z" fill="#007BFF" opacity="0" />
    </g>
  </svg>
);

const PhoneIcon = () => (
  <svg fill="none" viewBox="0 0 20 20" style={{ display: 'block', width: '100%', height: '100%' }}>
    <g>
      <path d="M9.175 16.6833C13.3217 16.6833 16.6833 13.3217 16.6833 9.175C16.6833 5.02826 13.3217 1.66667 9.175 1.66667C5.02826 1.66667 1.66667 5.02826 1.66667 9.175C1.66667 13.3217 5.02826 16.6833 9.175 16.6833Z" fill="#1F2B37" opacity="0.4" />
      <path d="M18.325 15.7917C18.05 15.2833 17.4667 15 16.6834 15C16.0917 15 15.5834 15.2417 15.2834 15.6583C14.9834 16.075 14.9167 16.6333 15.1 17.1917C15.4584 18.275 16.0834 18.5167 16.425 18.5583C16.475 18.5667 16.525 18.5667 16.5834 18.5667C16.95 18.5667 17.5167 18.4083 18.0667 17.5833C18.5084 16.9417 18.5917 16.3 18.325 15.7917Z" fill="#1F2B37" />
    </g>
  </svg>
);

interface CharityListProps {
  initialData?: CharityOrganization[];
  initialTotal?: number;
}

export default function CharityList({ initialData = [], initialTotal = 0 }: CharityListProps) {
  const [charities, setCharities] = useState<CharityOrganization[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CharityListParams>({
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 10,
    offset: 0,
  });

  const loadCharities = async (params: CharityListParams) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sort_by: params.sort_by || 'created_at',
        sort_order: params.sort_order || 'desc',
        limit: (params.limit || 10).toString(),
        offset: (params.offset || 0).toString(),
      });

      const response = await fetch(`/api/charity/organizations?${queryParams.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setCharities(result.data.data);
        setTotalCount(result.data.total_count);
      } else {
        console.error('Error loading charities:', result.error);
      }
    } catch (error) {
      console.error('Error loading charities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData.length === 0) {
      loadCharities(filters);
    }
  }, []);

  const handleSearch = () => {
    const newFilters = { ...filters, offset: 0 };
    setCurrentPage(1);
    loadCharities(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (filters.limit || 10);
    const newFilters = { ...filters, offset: newOffset };
    setCurrentPage(page);
    loadCharities(newFilters);
  };

  const totalPages = Math.ceil(totalCount / (filters.limit || 10));

  return (
    <div className={styles.container} dir="rtl">
      {/* Create Button */}
      <button className={styles.createButton}>
        <span className={styles.buttonText}>ایجاد خیریه</span>
        <span className={styles.buttonIcon}>
          <PlusIcon />
        </span>
      </button>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchCard}>
          <div className={styles.searchCardContent}>
            <div className={styles.searchFilters}>
              {/* First Row */}
              <div className={styles.filterRow}>
                <div className={styles.filterInput}>
                  <div className={styles.inputFrame}>
                    <div className={styles.inputContent}>
                      <span className={styles.inputIcon}>
                        <DropdownIcon />
                      </span>
                      <input
                        type="text"
                        placeholder="نوع کاربر"
                        className={styles.input}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.filterInput}>
                  <div className={styles.inputFrame}>
                    <div className={styles.inputContent}>
                      <input
                        type="text"
                        placeholder="شماره تماس"
                        className={styles.input}
                        dir="rtl"
                      />
                      <span className={styles.inputIconSmall}>
                        <PhoneIcon />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.filterInput}>
                  <div className={styles.inputFrame}>
                    <div className={styles.inputContent}>
                      <input
                        type="text"
                        placeholder="نام و نام‌خانوادگی"
                        className={styles.input}
                        dir="rtl"
                      />
                      <span className={styles.inputIconSmall}>
                        <PhoneIcon />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className={styles.filterRow}>
                <div className={styles.filterInput}>
                  <div className={styles.inputFrame}>
                    <div className={styles.inputContent}>
                      <span className={styles.inputIcon}>
                        <DropdownIcon />
                      </span>
                      <input
                        type="text"
                        placeholder="وضعیت"
                        className={styles.input}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.filterInput}>
                  <div className={styles.inputFrame}>
                    <div className={styles.inputContent}>
                      <span className={styles.inputIcon}>
                        <DropdownIcon />
                      </span>
                      <input
                        type="text"
                        placeholder="سطح"
                        className={styles.input}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className={styles.checkboxRow}>
                <label className={styles.checkboxItem}>
                  <span className={styles.checkboxText}>عضو چهارشنبه نیکی باشد.</span>
                  <input type="checkbox" className={styles.checkbox} defaultChecked />
                </label>

                <label className={styles.checkboxItem}>
                  <span className={styles.checkboxText}>عضو نیکی‌یار باشد.</span>
                  <input type="checkbox" className={styles.checkbox} defaultChecked />
                </label>
              </div>
            </div>

            {/* Search Button */}
            <button className={styles.searchButton} onClick={handleSearch}>
              <span className={styles.searchButtonText}>جستجو</span>
              <span className={styles.searchButtonIcon}>
                <SearchNormal size={20} color="#1F2B37" />
              </span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className={styles.tableSection}>
          <div className={styles.table}>
            {/* Table Header */}
            <div className={styles.tableRow}>
              <div className={`${styles.tableHeader} ${styles.tableHeaderFirst}`}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>عملیات</span>
                </div>
                <div className={styles.separator} />
              </div>

              <div className={styles.tableHeader}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>نام مدیر خیریه</span>
                </div>
                <div className={styles.separator} />
              </div>

              <div className={styles.tableHeader}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>شماره ثبت</span>
                </div>
                <div className={styles.separator} />
              </div>

              <div className={styles.tableHeader}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>حوزه فعالیت</span>
                </div>
                <div className={styles.separator} />
              </div>

              <div className={styles.tableHeader}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>شماره تماس</span>
                </div>
                <div className={styles.separator} />
              </div>

              <div className={`${styles.tableHeader} ${styles.tableHeaderLast}`}>
                <div className={styles.headerContent}>
                  <span className={styles.headerText}>نام خیریه</span>
                </div>
                <div className={styles.separator} />
              </div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div className={styles.loadingRow}>
                <span>در حال بارگذاری...</span>
              </div>
            ) : charities.length === 0 ? (
              <div className={styles.emptyRow}>
                <span>هیچ خیریه‌ای یافت نشد</span>
              </div>
            ) : (
              charities.map((charity, index) => (
                <div key={charity.charity_id} className={styles.tableRow}>
                  {/* Actions Column */}
                  <div className={`${styles.tableCell} ${index === charities.length - 1 ? styles.tableCellFirst : ''}`}>
                    <div className={styles.cellContent}>
                      <div className={styles.actionIcons}>
                        <button className={styles.actionButton} title="ویرایش">
                          <Edit size={24} color="#1F2B37" />
                        </button>
                        <button className={styles.actionButton} title="حذف">
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>

                  {/* Manager Name Column */}
                  <div className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>-</span>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>

                  {/* Registration Number Column */}
                  <div className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>{charity.charity_id}</span>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>

                  {/* Activity Field Column */}
                  <div className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>-</span>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>

                  {/* Phone Column */}
                  <div className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>{charity.phone || '-'}</span>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>

                  {/* Name Column with Avatar */}
                  <div className={`${styles.tableCell} ${index === charities.length - 1 ? styles.tableCellLast : ''}`}>
                    <div className={styles.cellContent}>
                      <div className={styles.charityNameCell}>
                        <span className={styles.cellText}>{charity.name}</span>
                        <div className={styles.avatar}>
                          <img
                            src={getImageUrl(charity.logo_file_uid)}
                            alt={charity.name}
                            className={styles.avatarImg}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/avatar.png';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {index < charities.length - 1 && <div className={styles.separator} />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationShadow} />
              <div className={styles.paginationButton}>
                <div className={styles.paginationContent}>
                  <button
                    className={styles.paginationArrow}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronRightIcon />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`${styles.pageNumber} ${currentPage === pageNum ? styles.pageNumberActive : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className={styles.paginationArrow}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronLeftIcon />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


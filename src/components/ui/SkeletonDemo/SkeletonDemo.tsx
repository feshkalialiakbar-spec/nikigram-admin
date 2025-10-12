import React, { useState } from 'react';
import Skeleton from '../Skeleton/Skeleton';
import SidebarSkeleton from '../SidebarSkeleton/SidebarSkeleton';
import TaskTableSkeleton from '../TaskTableSkeleton/TaskTableSkeleton';

// Demo component showing different skeleton loading states
const SkeletonDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h2>نمونه‌های اسکلت لودینگ</h2>
      
      <button 
        onClick={toggleLoading}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'توقف لودینگ' : 'شروع لودینگ'}
      </button>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Sidebar Skeleton */}
        <div style={{ width: '300px' }}>
          <h3>اسکلت منوی کناری</h3>
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            <div style={{ 
              width: '280px', 
              height: '400px', 
              background: '#f0f0f0', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              محتوای منوی کناری
            </div>
          )}
        </div>

        {/* Task Table Skeleton */}
        <div style={{ flex: 1, minWidth: '500px' }}>
          <h3>اسکلت جدول وظایف</h3>
          {isLoading ? (
            <TaskTableSkeleton rows={5} />
          ) : (
            <div style={{ 
              height: '400px', 
              background: '#f0f0f0', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              محتوای جدول وظایف
            </div>
          )}
        </div>
      </div>

      {/* Individual Skeleton Examples */}
      <div style={{ marginTop: '30px' }}>
        <h3>نمونه‌های اسکلت جداگانه</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Skeleton width="100%" height="20px" />
          <Skeleton width="80%" height="20px" />
          <Skeleton width="60%" height="20px" />
          <Skeleton width={50} height={50} variant="circular" />
          <Skeleton width="200px" height="40px" borderRadius={20} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonDemo;

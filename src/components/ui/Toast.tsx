'use client';

import { useEffect, useState } from 'react';
import { TickCircle, CloseCircle, InfoCircle, Warning2 } from 'iconsax-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastComponentProps extends ToastProps {
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastComponentProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto remove
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, onRemove]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <TickCircle size={20} variant="Bold" color="#10B981" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'error':
        return {
          icon: <CloseCircle size={20} variant="Bold" color="#EF4444" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        };
      case 'warning':
        return {
          icon: <Warning2 size={20} variant="Bold" color="#F59E0B" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
        };
      default:
        return {
          icon: <InfoCircle size={20} variant="Bold" color="#3B82F6" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        maxWidth: '24rem',
        width: '100%',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className={`${typeStyles.bgColor} ${typeStyles.borderColor} border rounded-lg shadow-lg p-4`}
        style={{
          backgroundColor: type === 'success' ? '#f0fdf4' : type === 'error' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#eff6ff',
          borderColor: type === 'success' ? '#bbf7d0' : type === 'error' ? '#fecaca' : type === 'warning' ? '#fed7aa' : '#bfdbfe',
          border: '1px solid',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '1rem'
        }}
      >
        <div 
          className="flex items-start"
          style={{
            display: 'flex',
            alignItems: 'flex-start'
          }}
        >
          <div 
            className="flex-shrink-0"
            style={{
              flexShrink: 0
            }}
          >
            {typeStyles.icon}
          </div>
          <div 
            className="mr-3 flex-1"
            style={{
              marginRight: '0.75rem',
              flex: 1
            }}
          >
            <h4 
              className={`text-sm font-semibold ${typeStyles.textColor}`}
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#1e40af',
                margin: 0
              }}
            >
              {title}
            </h4>
            {message && (
              <p 
                className={`text-sm mt-1 ${typeStyles.textColor} opacity-80`}
                style={{
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                  color: type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#1e40af',
                  opacity: 0.8,
                  margin: 0
                }}
              >
                {message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(id), 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            style={{
              flexShrink: 0,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <CloseCircle size={16} variant="Outline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

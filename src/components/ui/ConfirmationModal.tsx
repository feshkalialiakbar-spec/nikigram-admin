'use client';

import { ReactNode } from 'react';
import { CloseCircle, TickCircle } from 'iconsax-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'approve' | 'reject' | 'warning' | 'info';
  loading?: boolean;
  children?: ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تایید',
  cancelText = 'لغو',
  type = 'info',
  loading = false,
  children,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'approve':
        return {
          icon: <TickCircle size={48} variant="Bold" color="#10B981" />,
          confirmButton: 'bg-green-600 hover:bg-green-700 text-white',
          iconBg: 'bg-green-50',
        };
      case 'reject':
        return {
          icon: <CloseCircle size={48} variant="Bold" color="#EF4444" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-50',
        };
      case 'warning':
        return {
          icon: <CloseCircle size={48} variant="Bold" color="#F59E0B" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          iconBg: 'bg-yellow-50',
        };
      default:
        return {
          icon: <TickCircle size={48} variant="Bold" color="#3B82F6" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          iconBg: 'bg-blue-50',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.3s ease'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all"
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '28rem',
          width: '100%',
          margin: '0 1rem',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          className="p-6"
          style={{
            padding: '1.5rem'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-center mb-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <div 
              className={`p-3 rounded-full ${typeStyles.iconBg}`}
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: type === 'approve' ? '#f0fdf4' : type === 'reject' ? '#fef2f2' : type === 'warning' ? '#fffbeb' : '#eff6ff'
              }}
            >
              {typeStyles.icon}
            </div>
          </div>
          
          {/* Title */}
          <h3 
            className="text-xl font-bold text-gray-900 text-center mb-2"
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}
          >
            {title}
          </h3>
          
          {/* Message */}
          <p 
            className="text-gray-600 text-center mb-6 leading-relaxed"
            style={{
              color: '#4b5563',
              textAlign: 'center',
              marginBottom: '1.5rem',
              lineHeight: '1.625'
            }}
          >
            {message}
          </p>
          
          {/* Children content */}
          {children && (
            <div 
              className="mb-6"
              style={{
                marginBottom: '1.5rem'
              }}
            >
              {children}
            </div>
          )}
          
          {/* Actions */}
          <div 
            className="flex gap-3"
            style={{
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 ${typeStyles.confirmButton}`}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: type === 'approve' ? '#10b981' : type === 'reject' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = type === 'approve' ? '#059669' : type === 'reject' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = type === 'approve' ? '#10b981' : type === 'reject' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6';
                }
              }}
            >
              {loading ? (
                <div 
                  className="flex items-center justify-center"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid #ffffff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.5rem'
                    }}
                  />
                  در حال پردازش...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

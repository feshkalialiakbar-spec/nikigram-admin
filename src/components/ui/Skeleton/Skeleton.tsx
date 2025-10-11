import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
}) => {
  const skeletonStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
  };

  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={skeletonClasses}
      style={skeletonStyle}
      aria-hidden="true"
    />
  );
};

export default Skeleton;

import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  variant?: 'rectangular' | 'circular';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  variant = 'rectangular',
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular'
      ? '50%'
      : borderRadius
        ? `${borderRadius}px`
        : undefined,
  };
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;


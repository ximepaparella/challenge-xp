import React from 'react';
import styles from './LoadingSpinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'light';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  fullPage?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  fullPage = false,
  className,
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    className || '',
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    fullPage ? styles.fullPage : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={spinnerClasses} aria-hidden="true"></div>
      {label && <p className={styles.label}>{label}</p>}
      {label ? null : <span className="sr-only">Loading...</span>}
    </div>
  );
};

export default LoadingSpinner; 
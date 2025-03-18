import React, { ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  isActive?: boolean;
  isLoading?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  label,
  isActive = false,
  isLoading = false,
  className,
  disabled,
  ...rest
}) => {
  const buttonClasses = [
    styles.iconButton,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    isActive ? styles.active : '',
    isLoading ? styles.loading : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      aria-label={label}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
};

export default IconButton; 
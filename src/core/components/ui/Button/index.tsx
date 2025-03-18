import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      
      <span className={styles.content}>{children}</span>
      
      {icon && iconPosition === 'right' && !isLoading && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </button>
  );
};

export default Button; 
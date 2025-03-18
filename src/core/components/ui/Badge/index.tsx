import React, { HTMLAttributes } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label: string;
  icon?: React.ReactNode;
  dot?: boolean;
  customColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon,
  dot = false,
  customColor,
  className,
  style,
  ...rest
}) => {
  const badgeClasses = [
    styles.badge,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    dot ? styles.dot : '',
    className || ''
  ].filter(Boolean).join(' ');

  const customStyle = customColor ? {
    ...style,
    backgroundColor: customColor,
    color: getContrastColor(customColor)
  } : style;

  return (
    <span className={badgeClasses} style={customStyle} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </span>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove the # if it exists
  const color = hexColor.replace('#', '');
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  // Calculate brightness (using the luminance formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Return white or black based on brightness
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default Badge; 
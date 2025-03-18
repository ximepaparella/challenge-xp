import React from 'react';
import Image from 'next/image';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasBorder?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  hasBorder = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 200
  };

  const pixelSize = sizeMap[size];

  return (
    <div 
      className={`${styles.avatarContainer} ${styles[size]} ${hasBorder ? styles.hasBorder : ''} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Image
        src={src}
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        className={styles.avatar}
        loading={size === 'xl' ? 'eager' : 'lazy'}
        priority={size === 'xl'}
      />
    </div>
  );
};

export default Avatar; 
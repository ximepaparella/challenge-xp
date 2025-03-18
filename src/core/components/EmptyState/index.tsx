import React from 'react';
import { Card, Button } from '@/core/components/ui';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No hay resultados',
  message = 'No se encontraron resultados para tu búsqueda.',
  icon,
  actionLabel,
  onAction
}) => {
  return (
    <Card className={styles.emptyState}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </Card>
  );
};

export default EmptyState; 
import React from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  icon
}) => {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.titleContainer}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
};

export default PageHeader; 
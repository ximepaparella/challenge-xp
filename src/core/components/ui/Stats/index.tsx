import React from 'react';
import styles from './Stats.module.css';

export interface StatItem {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export interface StatsProps {
  stats: StatItem[];
  variant?: 'default' | 'card' | 'inline' | 'small';
  className?: string;
}

const Stats: React.FC<StatsProps> = ({ 
  stats, 
  variant = 'default',
  className = ''
}) => {
  return (
    <div className={`${styles.statsContainer} ${styles[variant]} ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.stat}>
          {stat.icon && <div className={styles.statIcon}>{stat.icon}</div>}
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {stat.value?.toLocaleString() || 0}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats; 
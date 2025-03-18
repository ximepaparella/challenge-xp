import React from 'react';
import { Repository } from '@/types/github';
import { LoadingSpinner } from '@/core/components/ui';
import RepositoryCard from '../RepositoryCard';
import styles from './RepositoryList.module.css';

export interface RepositoryListProps {
  repositories: Repository[];
  isLoading?: boolean;
  title?: string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  isLoading = false,
  title = 'Repositorios'
}) => {
  return (
    <section className={styles.repositoriesSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner label="Cargando repositorios..." />
        </div>
      ) : repositories.length === 0 ? (
        <p className={styles.emptyMessage}>No hay repositorios disponibles.</p>
      ) : (
        <ul className={styles.repoGrid}>
          {repositories.map(repo => (
            <li key={repo.id} className={styles.repoItem}>
              <RepositoryCard repository={repo} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RepositoryList; 
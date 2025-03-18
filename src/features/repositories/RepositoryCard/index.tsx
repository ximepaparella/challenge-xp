import React from 'react';
import { Card, Badge } from '@/core/components/ui';
import { Repository } from '@/types/github';
import { getLanguageColor } from '@/core/utils/colors';
import styles from './RepositoryCard.module.css';

export interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  return (
    <Card className={styles.repoCard}>
      <article>
        <h3 className={styles.repoName}>
          <a 
            href={repository.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            {repository.name}
          </a>
        </h3>
        
        {repository.description && (
          <p className={styles.repoDescription}>{repository.description}</p>
        )}
        
        <div className={styles.repoDetails}>
          {repository.language && (
            <Badge 
              label={repository.language}
              size="sm"
              customColor={getLanguageColor(repository.language)}
            />
          )}
          
          <span className={styles.repoStat}>
            <span className={styles.repoStatIcon}>★</span> {repository.stargazers_count}
          </span>
          
          <span className={styles.repoStat}>
            <span className={styles.repoStatIcon}>🍴</span> {repository.forks_count}
          </span>
        </div>
      </article>
    </Card>
  );
};

export default RepositoryCard; 
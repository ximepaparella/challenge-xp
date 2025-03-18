import { memo } from 'react';
import Link from 'next/link';
import { User } from '@/features/users/types';
import { Avatar } from '@/core/components/ui';
import { FavoriteButton } from '@/features/favorites';
import styles from './UserCard.module.css';
import UserStats from '../UserStats';

export interface UserCardViewProps {
  user: User;
}

/**
 * Componente de presentación pura para mostrar información de un usuario
 * Este componente se encarga sólo del renderizado y no contiene lógica de negocio.
 */
const UserCardView = ({ user }: UserCardViewProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
          <Avatar 
            src={user.avatar_url} 
            alt={`${user.login}'s avatar`}
            size="lg"
          />
          
          <FavoriteButton 
            user={user}
            variant="icon"
            size="md"
            className={styles.favoriteButton}
          />
      </div>
      
      <div className={styles.cardBody}>
        <h3 className={styles.userName}>{user.name || user.login}</h3>
        <div className={styles.userLogin}>@{user.login}</div>
        
        {user.bio && (
          <p className={styles.userBio}>{user.bio}</p>
        )}
        
        {user.public_repos && user.followers && user.following && (
          <UserStats 
            followers={user.followers} 
            following={user.following} 
            publicRepos={user.public_repos} 
            variant="small"
            className={styles.userStats}
          />
        )}
        
        {(user.location || user.company) && (
          <div className={styles.userDetails}>
            {user.location && (
              <div className={styles.detailItem}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{user.location}</span>
              </div>
            )}
            
            {user.company && (
              <div className={styles.detailItem}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <span>{user.company}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.cardFooter}>
        <Link href={`/user/${user.login}`} className={styles.viewProfileButton}>
          Ver perfil
        </Link>
        <a 
          href={user.html_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.githubButton}
          onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.githubIcon}>
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default memo(UserCardView); 
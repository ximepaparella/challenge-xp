import React from 'react';
import { User } from '@/features/users/types';
import { Avatar } from '@/core/components/ui';
import styles from './UserProfile.module.css';

export interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <article className={styles.profile}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          size="xl"
          hasBorder={true}
        />
      </div>
      
      <div className={styles.info}>
        <h1 className={styles.name}>{user.name || user.login}</h1>
        <p className={styles.username}>@{user.login}</p>
        
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        
        <div className={styles.detailsContainer}>
          {user.location && (
            <div className={styles.detail}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Ubicación:</span> {user.location}
              </span>
            </div>
          )}
          
          {user.company && (
            <div className={styles.detail}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Empresa:</span> {user.company}
              </span>
            </div>
          )}
          
          {user.blog && (
            <div className={styles.detail}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Sitio Web:</span>{' '}
                <a 
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {user.blog}
                </a>
              </span>
            </div>
          )}

          {user.twitter_username && (
            <div className={styles.detail}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Twitter:</span>{' '}
                <a 
                  href={`https://twitter.com/${user.twitter_username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  @{user.twitter_username}
                </a>
              </span>
            </div>
          )}
        </div>
        
        <a 
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className={styles.githubIcon}>
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Ver perfil de GitHub
        </a>
      </div>
    </article>
  );
};

export default UserProfile; 
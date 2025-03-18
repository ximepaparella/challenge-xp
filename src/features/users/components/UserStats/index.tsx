import React from 'react';
import { Stats, StatItem } from '@/core/components/ui';

export interface UserStatsProps {
  followers: number;
  following: number;
  publicRepos: number;
  variant?: 'default' | 'card' | 'inline' | 'small';
  className?: string;
}

const UserStats: React.FC<UserStatsProps> = ({ 
  followers, 
  following, 
  publicRepos, 
  variant = 'default',
  className = '' 
}) => {
  const statsData: StatItem[] = [
    {
      label: 'Seguidores',
      value: followers
    },
    {
      label: 'Siguiendo',
      value: following
    },
    {
      label: 'Repositorios',
      value: publicRepos
    }
  ];

  return (
    <Stats 
      stats={statsData} 
      variant={variant} 
      className={className} 
    />
  );
};

export default UserStats; 
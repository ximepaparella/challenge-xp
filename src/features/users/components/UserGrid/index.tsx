import { memo } from 'react';
import { User } from '../../types';
import UserGridView from './UserGridView';

export interface UserGridProps {
  users: User[];
  loading: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * Container component for UserGrid
 * This component could handle additional logic in the future,
 * such as filtering, sorting, or specific interactions.
 */
const UserGrid = memo((props: UserGridProps) => {
  // In the future, there could be additional logic here such as:
  // - User filtering
  // - Sorting
  // - Selection handling
  // - Data transformation
  
  // For now, simply pass the props to the presentation component
  return <UserGridView {...props} />;
});

// Add display name to facilitate debugging
UserGrid.displayName = 'UserGrid';

export default UserGrid; 
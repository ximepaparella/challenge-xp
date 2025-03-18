import { memo } from 'react';
import { User } from '@/features/users/types';
import UserCardView from './UserCardView';

export interface UserCardProps {
  user: User;
}

/**
 * Container component for UserCard
 * This component could handle additional logic in the future,
 * such as specific user interactions or loading additional data.
 */
const UserCard = (props: UserCardProps) => {
  // In the future, there could be additional logic here such as:
  // - Loading additional user data
  // - Managing specific states (selected, highlighted)
  // - Tracking interactions
  
  // For now, simply pass the props to the presentation component
  return <UserCardView {...props} />;
};

// Memoize component to prevent unnecessary re-renders
export default memo(UserCard); 
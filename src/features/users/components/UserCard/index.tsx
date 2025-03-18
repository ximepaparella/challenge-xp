import { memo } from 'react';
import { User } from '@/features/users/types';
import UserCardView from './UserCardView';

export interface UserCardProps {
  user: User;
}

/**
 * Componente contenedor para UserCard
 * Este componente podría manejar lógica adicional en el futuro,
 * como interacciones específicas del usuario o carga de datos adicionales.
 */
const UserCard = (props: UserCardProps) => {
  // En un futuro, aquí podría haber lógica adicional como:
  // - Carga de datos adicionales del usuario
  // - Gestión de estados específicos (seleccionado, destacado)
  // - Tracking de interacciones
  
  // Por ahora, simplemente pasar las props al componente de presentación
  return <UserCardView {...props} />;
};

// Memoize component to prevent unnecessary re-renders
export default memo(UserCard); 
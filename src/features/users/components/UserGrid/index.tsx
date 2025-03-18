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
 * Componente contenedor para UserGrid
 * Este componente podría manejar lógica adicional en el futuro,
 * como filtrado, clasificación o interacciones específicas.
 */
const UserGrid = memo((props: UserGridProps) => {
  // En un futuro, aquí podría haber lógica adicional como:
  // - Filtrado de usuarios
  // - Ordenamiento
  // - Manejo de selección
  // - Transformación de datos
  
  // Por ahora, simplemente pasar las props al componente de presentación
  return <UserGridView {...props} />;
});

// Agregar nombre de visualización para facilitar la depuración
UserGrid.displayName = 'UserGrid';

export default UserGrid; 
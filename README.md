# GitHub Explorer

Aplicación web que permite explorar perfiles de usuarios de GitHub, desarrollada con Next.js y TypeScript.

## Características

- **Exploración de Usuarios:** Interfaz intuitiva para descubrir perfiles de GitHub.
- **Búsqueda en Tiempo Real:** Sistema de búsqueda optimizado con debounce.
- **Gestión de Favoritos:** Guarda tus perfiles favoritos para acceso rápido.
- **Perfiles Detallados:** Visualiza información completa de cada usuario y sus repositorios.
- **Modo Offline:** Sistema de mockups para continuar trabajando sin conexión o cuando se exceden los límites de la API.
- **Componentes Reutilizables:** Arquitectura basada en componentes modulares y extensibles.
- **Diseño Responsivo:** Experiencia óptima en dispositivos móviles y escritorio.

## Tecnologías Utilizadas

- **Frontend:** Next.js con TypeScript
- **Estilizado:** CSS Modules con variables CSS
- **Estado:** Context API para gestión de favoritos
- **API:** Integración con GitHub API
- **Testing:** Jest y React Testing Library

## Estructura del Proyecto

```
/src
  /core            # Componentes y utilidades del núcleo
    /components    # Componentes reutilizables UI
    /utils         # Utilidades y helpers
  /features        # Funcionalidades organizadas por dominio
    /users         # Todo lo relacionado con usuarios
      /components  # Componentes específicos de usuarios
      /hooks       # Hooks personalizados
      /services    # Servicios de API
      /types       # Tipado TypeScript
  /context         # Contextos globales React
  /mockups         # Datos mock para desarrollo sin API
  /pages           # Páginas Next.js
  /styles          # Estilos globales
```

## Componentes Reutilizables

El proyecto incluye varios componentes UI reutilizables:

- **Avatar:** Componentes para mostrar avatares de usuario con múltiples tamaños.
- **Stats:** Visualización de estadísticas con varias variantes (default, card, inline, small).
- **UserCard:** Tarjeta de usuario con información relevante.
- **UserProfile:** Visualización completa del perfil de usuario.

## Sistema de Mockups

La aplicación incluye un sistema robusto de datos mock que permite:

- Trabajar sin depender de la API de GitHub durante el desarrollo.
- Continuar usando la aplicación cuando se exceden los límites de la API.
- Generar perfiles dinámicos para cualquier nombre de usuario solicitado.

Los mockups están estructurados en:
- Perfiles de usuario predefinidos
- Repositorios para cada usuario
- Generación dinámica de datos para usuarios no predefinidos

## Instalación y Ejecución

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/github-explorer.git
   cd github-explorer
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. (Opcional) Configurar variables de entorno:
   Crea un archivo `.env.local` y añade tu token de GitHub para aumentar los límites de API:
   ```
   NEXT_PUBLIC_GITHUB_TOKEN=tu_token_aquí
   ```

4. Ejecutar en modo desarrollo:
   ```
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construye la aplicación
- `npm run start` - Inicia en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta tests unitarios

## Optimizaciones

- Componentes memoizados para evitar renders innecesarios
- Debounce en búsquedas para reducir llamadas a la API
- Lazy loading de imágenes con Next/Image
- Server-Side Rendering en páginas de detalle
- Sistema de caché para respuestas de API

## Capturas de Pantalla

- Página principal con búsqueda y listado de usuarios
- Página de perfil detallado
- Sección de favoritos
- Vista responsiva móvil

## Consideraciones Técnicas

- Implementación de manejo de errores y estados de carga
- Estrategia de fallback a datos mock cuando la API falla
- Estructura escalable para facilitar la expansión de funcionalidades

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos o envía un PR directamente.

## Refactorización Pendiente

Durante la revisión del código se identificaron las siguientes oportunidades de mejora:

### Archivos Duplicados o Redundantes

1. **Servicios de GitHub duplicados**:
   - ✅ Se ha consolidado la funcionalidad en `src/features/users/api/github.service.ts`
   - ✅ Se eliminó el archivo proxy de compatibilidad redundante
   - ✅ Se han actualizado las importaciones en componentes clave para usar directamente `GithubService`

2. **Hooks con funcionalidades superpuestas**:
   - ✅ Se ha eliminado completamente `useGithubSearch.ts` ya que no se utilizaba
   - ✅ Se ha eliminado completamente `useGithubUser.ts` ya que no se utilizaba y su funcionalidad puede ser manejada por `useUserList`
   - ✅ Se ha actualizado el archivo de índice de hooks para reflejar estos cambios

3. **Reexportaciones innecesarias**:
   - ✅ La reexportación de `useDebounce` en `src/features/users/hooks/index.ts` fue eliminada ya que creaba una redirección innecesaria
   - ✅ Se corrigieron problemas de reexportación en los componentes, usando las rutas correctas

### Mejoras Implementadas

1. **Eliminación de console.logs**:
   - ✅ Se han eliminado las declaraciones de console.log/error del código para producción

2. **Corrección de reexportaciones innecesarias**:
   - ✅ Se eliminaron reexportaciones redundantes en archivos de índice
   - ✅ Se agregó la exportación de `EmptyState` en el índice de componentes core
   - ✅ Se creó una estructura de exportación correcta para componentes de repositorios
   - ✅ Se actualizaron las importaciones en el índice de componentes de usuarios

3. **Consolidación de servicios y hooks**:
   - ✅ Se unificó toda la funcionalidad en `GithubService`
   - ✅ Se eliminaron hooks redundantes no utilizados (`useGithubSearch`, `useGithubUser`)
   - ✅ Se eliminó el archivo proxy de compatibilidad redundante

### Beneficios de la Refactorización

Estas mejoras han ayudado a:

1. **Reducir la complejidad del código**: Al eliminar archivos y funcionalidades duplicadas
2. **Mejorar la mantenibilidad**: Facilitando la comprensión de la estructura del proyecto
3. **Aumentar la coherencia**: Asegurando que los componentes y servicios se utilicen de manera consistente
4. **Optimizar el tamaño del bundle**: Al eliminar código no utilizado

La aplicación ahora tiene una estructura más clara, con límites bien definidos entre sus diferentes módulos.

---

Desarrollado como parte de un desafío técnico.

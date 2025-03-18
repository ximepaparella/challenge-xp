import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { User, Repository } from '@/features/users/types';
import { GithubService } from '@/features/users/api/github.service';
import { PageHeader, RepositoryList, UserProfile, UserStats } from '@/features/users/components';
import { FavoriteButton } from '@/features/favorites';
import { useFavorites } from '@/features/favorites/hooks';
import styles from '@/styles/UserDetail.module.css';

interface UserDetailProps {
  user: User | null;
  repositories: Repository[];
}

export default function UserDetail({ user, repositories }: UserDetailProps) {
  const { isFavorite, updateFavoriteData } = useFavorites();

  // Update favorite data when viewing a profile, but only once on mount
  useEffect(() => {
    let isMounted = true;

    const updateFavorite = async () => {
      if (user && isFavorite(user.login)) {
        await updateFavoriteData(user.login);
      }
    };

    updateFavorite();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to update once on mount

  if (!user) {
    return (
      <div className={styles.error}>
        <h1>User not found</h1>
        <Link href="/" className={styles.backLink}>
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${user.name || user.login} | GitHub Explorer`}</title>
        <meta name="description" content={`Perfil de GitHub ${user.login}${user.bio ? ` - ${user.bio.substring(0, 160)}` : ''}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${user.name || user.login} | GitHub Explorer`} />
        <meta property="og:description" content={`Perfil de GitHub de ${user.login}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://github-explorer.example.com/user/${user.login}`} />
        <meta property="og:image" content={user.avatar_url} />
        <meta property="profile:username" content={user.login} />
        <link rel="canonical" href={`https://github-explorer.example.com/user/${user.login}`} />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": user.name || user.login,
            "url": user.html_url,
            "image": user.avatar_url,
            "jobTitle": user.company || "Developer",
            "description": user.bio,
            "sameAs": [user.html_url]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
           Volver
          </Link>
          
          <FavoriteButton 
            user={user}
            variant="button"
            size="md"
            className={styles.favoriteButton}
            label={{ add: "Agregar a favoritos", remove: "Favorito" }}
          />
        </header>

        <PageHeader 
          title={user.name || user.login}
          description={`@${user.login}`}
        />

        <div className={styles.content}>
          <UserProfile user={user} />
          <UserStats 
            followers={user.followers || 0}
            following={user.following || 0}
            publicRepos={user.public_repos || 0}
            variant="card"
            className={styles.userStats}
          />
        </div>

        <RepositoryList 
          repositories={repositories}
          isLoading={false}
          title="Repositorios"
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };
  
  try {
    const user = await GithubService.getUser(username);
    const repositories = user ? await GithubService.getUserRepos(username) : [];
    
    return {
      props: {
        user,
        repositories,
      },
    };
  } catch (error) {
    // Manejo silencioso del error
    return {
      props: {
        user: null,
        repositories: [],
      },
    };
  }
}; 
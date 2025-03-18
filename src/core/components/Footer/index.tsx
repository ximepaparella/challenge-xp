import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <p>&copy; {currentYear} GitHub Explorer. Todos los derechos reservados.</p>
        </div>
        
        <div className={styles.links}>
          <nav className={styles.nav} aria-label="Footer Navigation">
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                  Inicio
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?showFavorites=true" className={styles.navLink}>
                  Favoritos
                </Link>
              </li>
              <li className={styles.navItem}>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
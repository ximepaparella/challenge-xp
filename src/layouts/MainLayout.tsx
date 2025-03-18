import { ReactNode } from 'react';
import Header from '@/core/components/Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>GitHub Explorer &copy; {new Date().getFullYear()}</p>
          <p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Powered by GitHub API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/features/favorites";
import { MainLayout } from "@/layouts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </FavoritesProvider>
  );
}

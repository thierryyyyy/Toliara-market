import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Providers from '@/providers/Providers';
import AppRoutes from './AppRoutes';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/** Frozen shell - ne pas éditer. Routes régénérées dans src/AppRoutes.tsx (pipeline). */
export default function App() {
  return (
    <Providers>
      <ScrollToTop />
      <AppRoutes />
    </Providers>
  );
}

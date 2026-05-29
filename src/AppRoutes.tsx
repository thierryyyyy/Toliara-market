import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AdminPage from './pages/Admin';
import CatalogPage from './pages/Catalog';
import ContactPage from './pages/Contact';
import HowItWorksPage from './pages/HowItWorks';
import ProductDetailPage from './pages/ProductDetail';
import SellPage from './pages/Sell';
import NotFoundPage from './pages/NotFound';
import AppLayout from './components/AppLayout';

/** Pipeline-owned routes - régénéré depuis src/pages/*.tsx */
export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/sell" element={<SellPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

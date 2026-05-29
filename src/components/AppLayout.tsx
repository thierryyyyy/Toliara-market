import { Outlet } from 'react-router-dom';
import { customSiteConfig } from '@/data/custom-site-config';
import HeaderCustom from "./Header.custom";
import FooterCustom from "./Footer.custom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderCustom config={customSiteConfig} />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterCustom config={customSiteConfig} />
    </div>
  );
}

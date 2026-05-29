/**
 * V1650 - Page /admin (propriétaire uniquement).
 */
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SiteOwnerAdminPanel from '@/components/site-admin/SiteOwnerAdminPanel';

function isOwnerRole(user: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const role =
    (user.user_metadata?.role as string | undefined) ||
    (user.app_metadata?.role as string | undefined) ||
    '';
  if (!role) return true;
  if (role === "owner" || role === "admin") return true;
  return false;
}

export default function Admin() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        Vérification de l'accès...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (!isOwnerRole(user)) {
    return (
      <div style={{ padding: 48, maxWidth: 480, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
        <h1>Accès réservé</h1>
        <p>Cette page est réservée au propriétaire du site.</p>
        <p>
          <Link to="/">Retour à l'accueil</Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Administration du site</strong>
        <span style={{ fontSize: 13, color: "#64748b" }}>{user?.email || ''}</span>
      </header>
      <SiteOwnerAdminPanel />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mt-4">
          Page non trouvée
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Home className="w-4 h-4" strokeWidth={1.5} />
            Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl hover:bg-muted transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

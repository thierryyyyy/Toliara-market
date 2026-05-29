import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, X, ChevronRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';


export const pageMeta = {
  label: "Vendre",
  path: "/sell",
  nav: true,
  order: 3,
};

const categoryOptions = siteContent.categories.map((c) => c.label);
const conditionOptions = [
  "Neuf avec etiquette",
  "Neuf sans etiquette",
  "Tres bon etat",
  "Bon etat",
  "Satisfaisant",
];

export default function Sell() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    brand: "",
    size: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <ChevronRight strokeWidth={1.25} className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Annonce publiee !
          </h2>
          <p className="text-muted-foreground mb-6">
            Ton article est maintenant visible par des milliers d'acheteurs sur
            Toliara market.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm({
                title: "",
                description: "",
                category: "",
                condition: "",
                price: "",
                brand: "",
                size: "",
              });
            }}
            className="px-6 py-2.5 rounded-xl font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            Vendre un autre article
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="py-16 md:py-20 bg-primary/5 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl font-bold text-foreground mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Vends tes articles
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple, rapide et securise. Rejoins des milliers de vendeurs sur
            Toliara market.
          </p>
        </div>
      </section>

      {/* Steps indicator */}
      <div className="sticky top-14 z-20 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => s < step && setStep(s)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                s === step
                  ? "text-primary"
                  : s < step
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                      ? "bg-muted text-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {s === 1 && "Photos"}
              {s === 2 && "Details"}
              {s === 3 && "Prix"}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Step 1: Photos */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-foreground">
                Ajoute des photos
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {i === 1 ? (
                      <>
                        <Camera
                          strokeWidth={1.5}
                          className="h-6 w-6 text-muted-foreground"
                        />
                        <span className="text-xs text-muted-foreground">
                          Photo principale
                        </span>
                      </>
                    ) : (
                      <Plus
                        strokeWidth={1.5}
                        className="h-5 w-5 text-muted-foreground"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  Suivant
                  <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold text-foreground">
                Decris ton article
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  required
                  value={(form?.title ?? "")}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Ex: Veste Carhartt taille L - Tres bon etat"
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Categorie *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Choisir...</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Etat *
                  </label>
                  <select
                    required
                    value={form.condition}
                    onChange={(e) => handleChange("condition", e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Choisir...</option>
                    {conditionOptions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Marque
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    placeholder="Nike, Zara, H&M..."
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Taille
                  </label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                    placeholder="M, L, XL, 38..."
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Decris l'etat de l'article, la matiere, les details importants..."
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <X strokeWidth={1.5} className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  Suivant
                  <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Price */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-foreground">
                Fixe ton prix
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Prix (Ar) *
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0"
                    className="w-full pl-4 pr-12 py-3 border border-border rounded-xl bg-background text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    Ar
                  </span>
                </div>
                {form.price && (
                  <p className="text-xs text-muted-foreground mt-2">
                    L'acheteur paiera{" "}
                    {(parseFloat(form.price) * 1.1).toFixed(0)} Ar (frais de
                    protection inclus)
                  </p>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Tu recevras
                </p>
                <p className="text-2xl font-bold text-primary">
                  {form.price
                    ? `${parseFloat(form.price).toFixed(0)} Ar`
                    : "- Ar"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Paiement securise apres confirmation de la reception par
                  l'acheteur.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <X strokeWidth={1.5} className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  Publier mon annonce
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}

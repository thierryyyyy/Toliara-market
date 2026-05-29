import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Truck, CreditCard } from 'lucide-react';
import { siteContent } from '@/content/site-content';
export const pageMeta = {
  label: "Comment ca marche",
  path: "/how-it-works",
  nav: true,
  order: 4,
};

const buyingSteps = [
  {
    number: "01",
    title: "Parcours les articles",
    description:
      "Recherche parmi des milliers d\\'articles par categorie, marque, taille ou etat.",
  },
  {
    number: "02",
    title: "Achete en securite",
    description:
      "Paie en ligne avec la Protection acheteurs. Ton argent est securise jusqu\\'a reception.' },",
  },
  {
    number: "03",
    title: "Recois ton article",
    description:
      "Le vendeur envoie le colis, tu confirmes la reception et liberes le paiement.",
  },
];

const trustItems = [
  {
    icon: Shield,
    title: "Protection acheteurs",
    description:
      "Ton paiement est conserve jusqu\\'a ce que tu confirmes la reception en bon etat.' },",
  },
  {
    icon: Truck,
    title: "Livraison suivie",
    description:
      "Tous les colis sont envoyes avec un numero de suivi. Tu sais toujours ou est ton article.",
  },
  {
    icon: CreditCard,
    title: "Paiement securise",
    description:
      "Tes donnees bancaires sont chiffrees et jamais partagees avec les vendeurs.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Comment ca marche ?
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Toliara market c'est simple : tu vends ce dont tu n'as plus besoin,
            tu achetes ce que tu desires.
          </p>
        </div>
      </section>

      {/* Selling steps */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Vendre sur Toliara market
          </h2>
          <p className="text-muted-foreground mb-10">
            Quelques minutes suffisent pour mettre en vente ton premier article.
          </p>
          <div className="space-y-0">
            {siteContent.howItWorks.steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex gap-6 py-10 border-b border-border last:border-0"
              >
                <span
                  className="text-7xl font-bold leading-none shrink-0 select-none"
                  style={{
                    color: "hsl(var(--primary) / 0.15)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.number}
                </span>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {(step?.title ?? "")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying steps */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Acheter sur Toliara market
          </h2>
          <p className="text-muted-foreground mb-10">
            Des milliers d'articles disponibles, livres directement chez toi.
          </p>
          <div className="space-y-0">
            {buyingSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex gap-6 py-10 border-b border-border last:border-0"
              >
                <span
                  className="text-7xl font-bold leading-none shrink-0 select-none"
                  style={{
                    color: "hsl(var(--primary) / 0.15)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.number}
                </span>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {(step?.title ?? "")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-foreground mb-10 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ta securite, notre priorite
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trustItems.map((item, idx) => (
              <motion.div
                key={(item?.title ?? "")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <item.icon
                  strokeWidth={1.25}
                  className="h-8 w-8 text-primary mb-4"
                />
                <h3 className="font-semibold text-foreground mb-2">
                  {(item?.title ?? "")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-primary/5 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pret a te lancer ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoins la communaute Toliara market et commence a acheter ou vendre
            des aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/sell"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Commencer a vendre
              <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
            </Link>
            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              Explorer les articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

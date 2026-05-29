import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';


export const pageMeta = {
  label: "Contact",
  path: "/contact",
  nav: true,
  order: 5,
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="py-20 md:py-28 bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nous contacter
          </h1>
          <p className="text-xl text-muted-foreground">
            Une question, un probleme ou une suggestion ? Notre equipe est la
            pour toi.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[2fr_3fr] gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">
                Informations de contact
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                    <Mail strokeWidth={1.5} className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      support@toliaramarket.mg
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                    <Phone strokeWidth={1.5} className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Telephone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +261 34 00 000 00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                    <MapPin
                      strokeWidth={1.5}
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Adresse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toliara, Madagascar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-10 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send strokeWidth={1.25} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Message envoye !
                </h3>
                <p className="text-muted-foreground">
                  Nous te repondrons dans les 24 heures. Merci de nous avoir
                  contactes.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-2xl p-8 space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Ton prenom et nom"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="ton@email.mg"
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Decris ta demande en detail..."
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Send strokeWidth={1.5} className="h-4 w-4" />
                  Envoyer le message
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

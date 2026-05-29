export const customSiteConfig = {
  /** V1623 - Référence design (URL vivante, pas blueprint) */
  designSeed: {
    id: "user-reference",
    url: "https://www.vinted.fr/",
    vertical: "vitrine-corporate",
  },
  name: "Toliara market",
  brandIcon: "ShoppingCart",
  siteType: "ecommerce",
  chromeMode: "full",
  header: { variant: "custom" },
  footer: { variant: "custom" },
  navigation: {
    headerNav: [
    { label: "Accueil", path: "/" },
    { label: "Catalogue", path: "/catalog" },
    { label: "Vendre", path: "/sell" },
    { label: "Comment ca marche", path: "/how-it-works" },
    { label: "Contact", path: "/contact" },
    { label: "Admin", path: "/admin" },
  ],
  },
};
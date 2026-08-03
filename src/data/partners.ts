export type BrandLogo = {
  id: string;
  name: string;
  logo: string;
  href?: string;
};

/** Placeholder logos — replace via admin / public assets as needed. */
export const partners: BrandLogo[] = [
  { id: "p1", name: "Partner One", logo: "/images/sucitalogo_use.png" },
  { id: "p2", name: "Partner Two", logo: "/images/sucitalogo_use.png" },
  { id: "p3", name: "Partner Three", logo: "/images/sucitalogo_use.png" },
  { id: "p4", name: "Partner Four", logo: "/images/sucitalogo_use.png" },
  { id: "p5", name: "Partner Five", logo: "/images/sucitalogo_use.png" },
  { id: "p6", name: "Partner Six", logo: "/images/sucitalogo_use.png" },
];

export const clients: BrandLogo[] = [
  { id: "c1", name: "Client One", logo: "/images/sucitalogo_use.png" },
  { id: "c2", name: "Client Two", logo: "/images/sucitalogo_use.png" },
  { id: "c3", name: "Client Three", logo: "/images/sucitalogo_use.png" },
  { id: "c4", name: "Client Four", logo: "/images/sucitalogo_use.png" },
  { id: "c5", name: "Client Five", logo: "/images/sucitalogo_use.png" },
  { id: "c6", name: "Client Six", logo: "/images/sucitalogo_use.png" },
];

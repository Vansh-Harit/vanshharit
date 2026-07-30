export const siteConfig = {
  name: "Vansh Harit",
  title: "Vansh Harit | Full-Stack Developer & AI Builder",
  description:
    "Vansh Harit is a full-stack developer and computer science student building Next.js products, AI agents, automation systems, and cloud platforms.",
  url: "https://vanshharit.vercel.app",
  locale: "en_IN",
  language: "en-IN",
  email: "vanshharit@gmail.com",
  social: {
    github: "https://github.com/Vansh-Harit",
    linkedin: "https://www.linkedin.com/in/vansh-harit-5590512b2",
    x: "https://x.com/VansHx349",
  },
} as const;

export const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteConfig.url}/#profile`,
      url: siteConfig.url,
      name: siteConfig.title,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      dateModified: "2026-07-30",
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
      mainEntity: {
        "@id": `${siteConfig.url}/#person`,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      alternateName: ["Vansh-Harit", "@VansHx349"],
      url: siteConfig.url,
      email: `mailto:${siteConfig.email}`,
      description: siteConfig.description,
      jobTitle: [
        "Full-Stack Developer",
        "AI Builder",
        "Product Support & Testing Associate",
      ],
      worksFor: {
        "@type": "Organization",
        name: "OnePlay",
      },
      knowsAbout: [
        "Full-stack web development",
        "Next.js",
        "TypeScript",
        "Supabase",
        "Artificial intelligence agents",
        "Multi-agent systems",
        "n8n automation",
      ],
      sameAs: [
        siteConfig.social.github,
        siteConfig.social.linkedin,
        siteConfig.social.x,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: `${siteConfig.name} Portfolio`,
      alternateName: ["Vansh Harit", "Vansh Harit Portfolio"],
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      author: {
        "@id": `${siteConfig.url}/#person`,
      },
    },
  ],
};

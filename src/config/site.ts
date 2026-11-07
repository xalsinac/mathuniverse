export const site = {
  name: 'Math Universe',
  description:
    'Un universo de proyectos, aplicaciones y recursos para aprender y enseñar matemáticas.',
  // Sustituir con la variable PUBLIC_SITE_URL al conectar el dominio definitivo.
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://math-universe.vercel.app',
  author: 'Xavier Alsina',
} as const;

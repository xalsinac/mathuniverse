export type Resource = {
  id: string;
  number: string;
  name: string;
  /** Parte del título que recibe el color propio de la App (como "Craft" en ArtCraft) */
  accentWord: string;
  /** Resto del título en color de tinta principal */
  restWord?: string;
  eyebrow: string;
  description: string;
  detail: string;
  href: string;
  icon: 'lab' | 'dojo' | 'junior' | 'practice' | 'exams' | 'selectividad' | 'lessons' | 'games' | 'tools';
  color: string;
};

// Punto único de edición para los proyectos y recursos que aparecen en la portada.
export const resources: Resource[] = [
  {
    id: 'lab',
    number: '01',
    name: 'Math Lab',
    accentWord: 'Math',
    restWord: ' Lab',
    eyebrow: 'Explorar y experimentar',
    description: 'Lecciones cortas e interactivas de todos los temas de matemáticas en el instituto.',
    detail: 'Un laboratorio de ideas para observar, probar y construir intuición.',
    href: 'https://mathlab-phi.vercel.app/',
    icon: 'lab',
    color: '#4d94ff',
  },
  {
    id: 'dojo',
    number: '02',
    name: 'Math Dojo',
    accentWord: 'Math',
    restWord: ' Dojo',
    eyebrow: 'Entrenar con propósito',
    description: 'Juegos rápidos pensados para afianzar técnica, estrategia y confianza.',
    detail: 'Práctica inteligente, progresiva y sin ruido. Instalable en el teléfono.',
    href: 'https://mathdojo-one.vercel.app/',
    icon: 'dojo',
    color: '#ff8a5b',
  },
  {
    id: 'junior',
    number: '03',
    name: 'Math Dojo Junior',
    accentWord: 'Math',
    restWord: ' Dojo Junior',
    eyebrow: 'Primeras exploraciones',
    description: 'Retos de cálculo para los alumnos de Primaria.',
    detail: 'Pensados para afianzar técnica, estrategia y confianza. Instalable en el móvil.',
    href: 'https://mathdojojr.vercel.app/',
    icon: 'junior',
    color: '#38c8ff',
  },
  {
    id: 'practice',
    number: '04',
    name: 'Math Gym',
    accentWord: 'Math',
    restWord: ' Gym',
    eyebrow: 'Practicar con sentido',
    description: 'Ejercicios y repaso: descarga problemas y hojas de entrenamiento con los que practicar.',
    detail: 'Colecciones organizadas por temas y niveles para consolidar cada paso a tu ritmo.',
    href: '/gym',
    icon: 'practice',
    color: '#3fe0b5',
  },
  {
    id: 'exams',
    number: '05',
    name: 'Math Challenge',
    accentWord: 'Math',
    restWord: ' Challenge',
    eyebrow: 'Ponerse a prueba',
    description: 'Exámenes de todos los temas para practicar en situaciones reales.',
    detail: 'Modelos de evaluación resueltos y comentados para medir tu progreso sin sorpresas.',
    href: '#',
    icon: 'exams',
    color: '#ff70a6',
  },
  {
    id: 'selectividad',
    number: '06',
    name: 'Selectividad',
    accentWord: 'Selectividad',
    eyebrow: 'Rumbo a la universidad',
    description: 'Descarga, estudia y comprueba las soluciones con exámenes de Selectividad de años anteriores.',
    detail: 'Convocatorias oficiales clasificadas por bloques, con criterios de corrección y desarrollo paso a paso.',
    href: '/selectividad',
    icon: 'selectividad',
    color: '#7ea3ff',
  },
  {
    id: 'lessons',
    number: '07',
    name: 'Math Academy',
    accentWord: 'Math',
    restWord: ' Academy',
    eyebrow: 'Entender de verdad',
    description: 'Lecciones y explicaciones completas, libros y documentos para comprender y recordar lo que necesitas.',
    detail: 'Apuntes claros, teoría estructurada y guías de referencia para ir del porqué al cómo.',
    href: '/academy',
    icon: 'lessons',
    color: '#ffc14d',
  },
  {
    id: 'games',
    number: '08',
    name: 'Math Craft',
    accentWord: 'Math',
    restWord: ' Craft',
    eyebrow: 'Comunidad y retos',
    description: 'Juegos creados tanto por profesores como por alumnos con una base matemática. ¿Te unes?',
    detail: 'Experimentos lúdicos, acertijos y proyectos interactivos donde jugar es otra forma de pensar.',
    href: '/craft',
    color: '#b48cff',
  },
  {
    id: 'tools',
    number: '09',
    name: 'Math Tools',
    accentWord: 'Math',
    restWord: ' Tools',
    eyebrow: 'Utilidades al instante',
    description: 'Calculadora científica, graficador y herramientas para cuando necesitas una pequeña ayuda.',
    detail: 'Encuentra calculadoras, conversores, escalas, representación de funciones y todo aquello que necesites.',
    href: '/herramientas',
    icon: 'tools',
    color: '#e68aff',
  },
];

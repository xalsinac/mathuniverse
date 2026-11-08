// =============================================================================
// CATÁLOGO Y CONFIGURACIÓN DE CLOUDFLARE R2 PARA MATH GYM (HOJAS DE EJERCICIOS)
// =============================================================================
// Convención de carpetas sencilla en tu bucket de Cloudflare R2:
//   gym/<curso>/<rama>/<archivo>.pdf
// Ejemplo:
//   gym/2eso/algebra/ecuaciones-primer-grado.pdf
//   gym/4eso/geometria/trigonometria.pdf
// =============================================================================

import { R2_BASE_URL } from './selectividad';

export type GymLevelId = '1eso' | '2eso' | '3eso' | '4eso' | '1bach' | '2bach';
export type GymBranchId = 'numeros' | 'algebra' | 'geometria' | 'funciones' | 'estadistica';

export interface GymLevelInfo {
  id: GymLevelId;
  short: string;
  name: string;
  stage: 'ESO' | 'Bachillerato';
}

export interface GymBranchInfo {
  id: GymBranchId;
  code: string;
  name: string;
  symbol: string;
  color: string;
  subtopics: string[];
}

export interface GymWorksheet {
  id: string;
  level: GymLevelId;
  branch: GymBranchId;
  topic: string;
  title: string;
  description: string;
  /** Ruta relativa dentro del bucket de Cloudflare R2 (un único PDF por hoja) */
  pdfPath: string;
  /** Cambia a true cuando subas el PDF al bucket R2 para activar el visor embebido */
  available: boolean;
}

export const GYM_LEVELS: GymLevelInfo[] = [
  { id: '1eso', short: '1.º ESO', name: '1.º de ESO', stage: 'ESO' },
  { id: '2eso', short: '2.º ESO', name: '2.º de ESO', stage: 'ESO' },
  { id: '3eso', short: '3.º ESO', name: '3.º de ESO', stage: 'ESO' },
  { id: '4eso', short: '4.º ESO', name: '4.º de ESO', stage: 'ESO' },
  { id: '1bach', short: '1.º BACH', name: '1.º de Bachillerato', stage: 'Bachillerato' },
  { id: '2bach', short: '2.º BACH', name: '2.º de Bachillerato', stage: 'Bachillerato' },
];

export const GYM_BRANCHES: GymBranchInfo[] = [
  {
    id: 'numeros',
    code: '01',
    name: 'Números y Aritmética',
    symbol: 'ℚ',
    color: '#38c8ff',
    subtopics: [
      'Divisibilidad',
      'Números enteros',
      'Fracciones',
      'Decimales',
      'Potencias y raíces',
      'Proporcionalidad y porcentajes',
      'Números reales y logaritmos',
    ],
  },
  {
    id: 'algebra',
    code: '02',
    name: 'Álgebra',
    symbol: '𝑥²',
    color: '#3fe0b5',
    subtopics: [
      'Expresiones algebraicas',
      'Polinomios y Ruffini',
      'Identidades notables',
      'Ecuaciones 1.º grado',
      'Ecuaciones 2.º grado y superiores',
      'Sistemas de ecuaciones',
      'Inecuaciones',
      'Matrices y determinantes',
    ],
  },
  {
    id: 'geometria',
    code: '03',
    name: 'Geometría',
    symbol: '△',
    color: '#ffc14d',
    subtopics: [
      'Pitágoras y semejanza',
      'Áreas y perímetros',
      'Cuerpos geométricos y volúmenes',
      'Trigonometría',
      'Vectores y rectas en el plano',
      'Geometría en el espacio 3D',
    ],
  },
  {
    id: 'funciones',
    code: '04',
    name: 'Funciones y Análisis',
    symbol: 'ƒ(𝑥)',
    color: '#ff70a6',
    subtopics: [
      'Tablas y gráficas',
      'Funciones lineales y cuadráticas',
      'Funciones elementales',
      'Límites y continuidad',
      'Derivadas',
      'Aplicaciones de la derivada',
      'Integrales',
    ],
  },
  {
    id: 'estadistica',
    code: '05',
    name: 'Estadística y Probabilidad',
    symbol: 'P(A)',
    color: '#b48cff',
    subtopics: [
      'Estadística unidimensional',
      'Estadística bidimensional',
      'Combinatoria',
      'Probabilidad y Laplace',
      'Probabilidad condicionada',
      'Distribución Binomial y Normal',
    ],
  },
];

export function resolveGymPdfUrl(relativePath: string): string {
  const cleanBase = R2_BASE_URL.replace(/\/+$/, '');
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
}

export const gymWorksheets: GymWorksheet[] = [
  // ===========================================================================
  // 1.º ESO
  // ===========================================================================
  {
    id: '1eso-num-divisibilidad',
    level: '1eso',
    branch: 'numeros',
    topic: 'Divisibilidad',
    title: 'Múltiplos, divisores, M.C.D. y m.c.m.',
    description: 'Criterios de divisibilidad, descomposición en factores primos y problemas clásicos de coincidencia.',
    pdfPath: 'gym/1eso/numeros/divisibilidad-mcd-mcm.pdf',
    available: false,
  },
  {
    id: '1eso-num-enteros',
    level: '1eso',
    branch: 'numeros',
    topic: 'Números enteros',
    title: 'Operaciones combinadas con números enteros',
    description: 'Suma, resta, regla de los signos, jerarquía de operaciones y paréntesis anidados.',
    pdfPath: 'gym/1eso/numeros/operaciones-enteros.pdf',
    available: false,
  },
  {
    id: '1eso-num-fracciones',
    level: '1eso',
    branch: 'numeros',
    topic: 'Fracciones',
    title: 'Fracciones: equivalencia, operaciones y problemas',
    description: 'Reducción a común denominador, operaciones combinadas y problemas de partes de un total.',
    pdfPath: 'gym/1eso/numeros/fracciones-operaciones-problemas.pdf',
    available: false,
  },
  {
    id: '1eso-alg-iniciacion',
    level: '1eso',
    branch: 'algebra',
    topic: 'Ecuaciones 1.º grado',
    title: 'Iniciación al lenguaje algebraico y ecuaciones sencillas',
    description: 'Traducción de enunciados a expresiones algebraicas y resolución de ecuaciones de primer grado.',
    pdfPath: 'gym/1eso/algebra/iniciacion-ecuaciones.pdf',
    available: false,
  },
  {
    id: '1eso-geo-areas',
    level: '1eso',
    branch: 'geometria',
    topic: 'Áreas y perímetros',
    title: 'Perímetros y áreas de figuras planas',
    description: 'Polígonos, circunferencia, círculo y descomposición de figuras compuestas.',
    pdfPath: 'gym/1eso/geometria/perimetros-y-areas.pdf',
    available: false,
  },

  // ===========================================================================
  // 2.º ESO
  // ===========================================================================
  {
    id: '2eso-num-fracciones-potencias',
    level: '2eso',
    branch: 'numeros',
    topic: 'Potencias y raíces',
    title: 'Fracciones y propiedades de las potencias',
    description: 'Castillos de fracciones, potencias de exponente entero y notación científica.',
    pdfPath: 'gym/2eso/numeros/fracciones-y-potencias.pdf',
    available: false,
  },
  {
    id: '2eso-num-proporcionalidad',
    level: '2eso',
    branch: 'numeros',
    topic: 'Proporcionalidad y porcentajes',
    title: 'Proporcionalidad directa, inversa y porcentajes',
    description: 'Reglas de tres, repartos proporcionales, aumentos y descuentos encadenados.',
    pdfPath: 'gym/2eso/numeros/proporcionalidad-porcentajes.pdf',
    available: false,
  },
  {
    id: '2eso-alg-polinomios',
    level: '2eso',
    branch: 'algebra',
    topic: 'Identidades notables',
    title: 'Monomios, polinomios e identidades notables',
    description: 'Operaciones con polinomios, factor común y desarrollo de productos notables.',
    pdfPath: 'gym/2eso/algebra/polinomios-identidades-notables.pdf',
    available: false,
  },
  {
    id: '2eso-alg-ecuaciones',
    level: '2eso',
    branch: 'algebra',
    topic: 'Ecuaciones 1.º grado',
    title: 'Ecuaciones de 1.º y 2.º grado y sistemas',
    description: 'Ecuaciones con denominadores, fórmula cuadrática e introducción a los sistemas lineales.',
    pdfPath: 'gym/2eso/algebra/ecuaciones-1-2-grado.pdf',
    available: false,
  },
  {
    id: '2eso-geo-pitagoras-tales',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Pitágoras, Tales y volúmenes',
    description: 'Aplicaciones geométricas de Pitágoras, escalas, prismas, pirámides y cuerpos de revolución.',
    pdfPath: 'gym/2eso/geometria/pitagoras-tales-volumenes.pdf',
    available: false,
  },

  // ===========================================================================
  // 3.º ESO
  // ===========================================================================
  {
    id: '3eso-num-radicales',
    level: '3eso',
    branch: 'numeros',
    topic: 'Potencias y raíces',
    title: 'Potencias de exponente fraccionario y radicales',
    description: 'Simplificación de radicales, extracción de factores, fracción generatriz y errores.',
    pdfPath: 'gym/3eso/numeros/potencias-y-radicales.pdf',
    available: false,
  },
  {
    id: '3eso-alg-ruffini',
    level: '3eso',
    branch: 'algebra',
    topic: 'Polinomios y Ruffini',
    title: 'División de polinomios, Regla de Ruffini y factorización',
    description: 'Teorema del resto, raíces enteras de un polinomio y simplificación de fracciones algebraicas.',
    pdfPath: 'gym/3eso/algebra/polinomios-ruffini-factorizacion.pdf',
    available: false,
  },
  {
    id: '3eso-alg-sistemas',
    level: '3eso',
    branch: 'algebra',
    topic: 'Sistemas de ecuaciones',
    title: 'Ecuaciones de 2.º grado y sistemas de ecuaciones lineales',
    description: 'Sustitución, igualación, reducción y planteamiento de problemas algebraicos.',
    pdfPath: 'gym/3eso/algebra/ecuaciones-y-sistemas.pdf',
    available: false,
  },
  {
    id: '3eso-fun-parabolas',
    level: '3eso',
    branch: 'funciones',
    topic: 'Funciones lineales y cuadráticas',
    title: 'Estudio y representación de rectas y parábolas',
    description: 'Pendiente, ordenada en el origen, ecuación de la recta, vértice y cortes de la parábola.',
    pdfPath: 'gym/3eso/funciones/rectas-y-parabolas.pdf',
    available: false,
  },
  {
    id: '3eso-est-probabilidad',
    level: '3eso',
    branch: 'estadistica',
    topic: 'Probabilidad y Laplace',
    title: 'Estadística descriptiva y Regla de Laplace',
    description: 'Media, mediana, desviación típica, experimentos compuestos y diagramas de árbol.',
    pdfPath: 'gym/3eso/estadistica/estadistica-y-probabilidad.pdf',
    available: false,
  },

  // ===========================================================================
  // 4.º ESO
  // ===========================================================================
  {
    id: '4eso-num-logaritmos',
    level: '4eso',
    branch: 'numeros',
    topic: 'Números reales y logaritmos',
    title: 'Intervalos, racionalización y logaritmos',
    description: 'Operaciones con radicales, racionalización de denominadores y propiedades de los logaritmos.',
    pdfPath: 'gym/4eso/numeros/radicales-y-logaritmos.pdf',
    available: false,
  },
  {
    id: '4eso-alg-ecuaciones-avanzadas',
    level: '4eso',
    branch: 'algebra',
    topic: 'Ecuaciones 2.º grado y superiores',
    title: 'Ecuaciones bicuadradas, irracionales, racionales e inecuaciones',
    description: 'Ecuaciones con raíces, fracciones algebraicas, sistemas no lineales e inecuaciones de 1.º y 2.º grado.',
    pdfPath: 'gym/4eso/algebra/ecuaciones-avanzadas-inecuaciones.pdf',
    available: false,
  },
  {
    id: '4eso-geo-trigonometria',
    level: '4eso',
    branch: 'geometria',
    topic: 'Trigonometría',
    title: 'Razones trigonométricas y resolución de triángulos',
    description: 'Circunferencia goniométrica, relaciones fundamentales y problemas de alturas y distancias.',
    pdfPath: 'gym/4eso/geometria/trigonometria.pdf',
    available: false,
  },
  {
    id: '4eso-geo-vectores-rectas',
    level: '4eso',
    branch: 'geometria',
    topic: 'Vectores y rectas en el plano',
    title: 'Geometría analítica: vectores y ecuaciones de la recta',
    description: 'Ecuación vectorial, paramétrica, continua, explícita y general de la recta; paralelismo y perpendicularidad.',
    pdfPath: 'gym/4eso/geometria/vectores-y-rectas.pdf',
    available: false,
  },
  {
    id: '4eso-fun-elementales',
    level: '4eso',
    branch: 'funciones',
    topic: 'Funciones elementales',
    title: 'Dominio, estudio gráfico y funciones definidas a trozos',
    description: 'Funciones racionales, irracionales, exponenciales, logarítmicas y a trozos.',
    pdfPath: 'gym/4eso/funciones/dominio-y-funciones-elementales.pdf',
    available: false,
  },
  {
    id: '4eso-est-combinatoria',
    level: '4eso',
    branch: 'estadistica',
    topic: 'Combinatoria',
    title: 'Combinatoria y probabilidad compuesta',
    description: 'Variaciones, permutaciones, combinaciones y tablas de contingencia.',
    pdfPath: 'gym/4eso/estadistica/combinatoria-y-probabilidad.pdf',
    available: false,
  },

  // ===========================================================================
  // 1.º BACHILLERATO
  // ===========================================================================
  {
    id: '1bach-alg-sistemas-gauss',
    level: '1bach',
    branch: 'algebra',
    topic: 'Sistemas de ecuaciones',
    title: 'Ecuaciones exponenciales, logarítmicas y Método de Gauss',
    description: 'Resolución de sistemas 3×3 por Gauss, ecuaciones trascendentes y sistemas de inecuaciones.',
    pdfPath: 'gym/1bach/algebra/ecuaciones-y-gauss.pdf',
    available: false,
  },
  {
    id: '1bach-geo-trigonometria-complejos',
    level: '1bach',
    branch: 'geometria',
    topic: 'Trigonometría',
    title: 'Identidades trigonométricas, Teorema del Seno y del Coseno',
    description: 'Fórmulas del ángulo doble y mitad, ecuaciones trigonométricas y resolución de triángulos cualesquiera.',
    pdfPath: 'gym/1bach/geometria/trigonometria-seno-coseno.pdf',
    available: false,
  },
  {
    id: '1bach-geo-analitica-plana',
    level: '1bach',
    branch: 'geometria',
    topic: 'Vectores y rectas en el plano',
    title: 'Producto escalar, distancias, ángulos y lugares geométricos',
    description: 'Distancia punto-recta, mediatriz, bisectriz, circunferencia y cónicas en el plano.',
    pdfPath: 'gym/1bach/geometria/geometria-analitica-plana.pdf',
    available: false,
  },
  {
    id: '1bach-fun-limites-continuidad',
    level: '1bach',
    branch: 'funciones',
    topic: 'Límites y continuidad',
    title: 'Cálculo de límites, indeterminaciones y asíntotas',
    description: 'Resolución de indeterminaciones, estudio de la continuidad y ramas infinitas.',
    pdfPath: 'gym/1bach/funciones/limites-continuidad-asintotas.pdf',
    available: false,
  },
  {
    id: '1bach-fun-derivadas',
    level: '1bach',
    branch: 'funciones',
    topic: 'Derivadas',
    title: 'Tabla de derivadas, regla de la cadena y recta tangente',
    description: 'Entrenamiento intensivo de cálculo de derivadas, monotonía y extremos relativos.',
    pdfPath: 'gym/1bach/funciones/calculo-de-derivadas.pdf',
    available: false,
  },
  {
    id: '1bach-est-bidimensional',
    level: '1bach',
    branch: 'estadistica',
    topic: 'Estadística bidimensional',
    title: 'Correlación lineal, rectas de regresión y distribuciones',
    description: 'Covarianza, coeficiente de Pearson, estimaciones y distribuciones Binomial y Normal.',
    pdfPath: 'gym/1bach/estadistica/regresion-y-distribuciones.pdf',
    available: false,
  },

  // ===========================================================================
  // 2.º BACHILLERATO
  // ===========================================================================
  {
    id: '2bach-alg-matrices-rouche',
    level: '2bach',
    branch: 'algebra',
    topic: 'Matrices y determinantes',
    title: 'Matrices, determinantes, rango y Teorema de Rouché-Frobenius',
    description: 'Ecuaciones matriciales AX+B=C, matriz inversa con parámetro y discusión de sistemas.',
    pdfPath: 'gym/2bach/algebra/matrices-determinantes-rouche.pdf',
    available: false,
  },
  {
    id: '2bach-geo-espacio-3d',
    level: '2bach',
    branch: 'geometria',
    topic: 'Geometría en el espacio 3D',
    title: 'Rectas y planos en ℝ³: posiciones relativas, ángulos y distancias',
    description: 'Producto escalar, vectorial y mixto, proyecciones ortogonales y punto simétrico.',
    pdfPath: 'gym/2bach/geometria/rectas-y-planos-espacio.pdf',
    available: false,
  },
  {
    id: '2bach-fun-optimizacion-teoremas',
    level: '2bach',
    branch: 'funciones',
    topic: 'Aplicaciones de la derivada',
    title: 'L’Hôpital, Bolzano, Rolle, Lagrange y problemas de optimización',
    description: 'Continuidad y derivabilidad con parámetros, teoremas fundamentales y optimización geométrica.',
    pdfPath: 'gym/2bach/funciones/derivabilidad-y-optimizacion.pdf',
    available: false,
  },
  {
    id: '2bach-fun-integrales',
    level: '2bach',
    branch: 'funciones',
    topic: 'Integrales',
    title: 'Primitivas, integración por partes, racionales y Regla de Barrow',
    description: 'Cambio de variable, fracciones simples y cálculo de áreas encerradas entre curvas.',
    pdfPath: 'gym/2bach/funciones/integrales-y-areas.pdf',
    available: false,
  },
  {
    id: '2bach-est-bayes-intervalos',
    level: '2bach',
    branch: 'estadistica',
    topic: 'Probabilidad condicionada',
    title: 'Probabilidad total, Teorema de Bayes e intervalos de confianza',
    description: 'Sucesos independientes, árboles de probabilidad, aproximación normal e inferencia.',
    pdfPath: 'gym/2bach/estadistica/probabilidad-total-y-bayes.pdf',
    available: false,
  },
];

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
  {
    id: '1eso-num-repaso-primaria',
    level: '1eso',
    branch: 'numeros',
    topic: 'Aritmética básica',
    title: 'Repaso de operaciones fundamentales de primaria',
    description: 'Operaciones básicas de cálculo, sumas, restas y multiplicaciones combinadas para afianzar el inicio de la ESO.',
    pdfPath: 'gym/1eso/numeros/repaso-primaria-operaciones.pdf',
    available: true,
  },
  {
    id: '1eso-num-ficha-divisiones',
    level: '1eso',
    branch: 'numeros',
    topic: 'División y cálculo',
    title: 'Ficha de entrenamiento: divisiones enteras',
    description: 'Práctica intensiva del algoritmo de la división con dividendos y divisores de varias cifras.',
    pdfPath: 'gym/1eso/numeros/ficha-divisiones.pdf',
    available: true,
  },
  {
    id: '1eso-num-enteros-operaciones',
    level: '1eso',
    branch: 'numeros',
    topic: 'Números enteros',
    title: 'Operaciones y regla de los signos con números enteros',
    description: 'Ejercicios de números positivos y negativos, paréntesis, sumas y restas combinadas.',
    pdfPath: 'gym/1eso/numeros/enteros-operaciones.pdf',
    available: true,
  },
  {
    id: '1eso-num-numeros-enteros',
    level: '1eso',
    branch: 'numeros',
    topic: 'Números enteros',
    title: 'Números enteros: recta numérica y jerarquía',
    description: 'Ordenación en la recta real, valor absoluto y resolución de ejercicios estructurados con enteros.',
    pdfPath: 'gym/1eso/numeros/numeros-enteros.pdf',
    available: true,
  },
  {
    id: '1eso-num-operaciones-combinadas',
    level: '1eso',
    branch: 'numeros',
    topic: 'Jerarquía de operaciones',
    title: 'Operaciones combinadas y uso de corchetes',
    description: 'Jerarquía completa de operaciones: potencias, productos, divisiones y paréntesis anidados.',
    pdfPath: 'gym/1eso/numeros/operaciones-combinadas.pdf',
    available: true,
  },
  {
    id: '1eso-num-decimales',
    level: '1eso',
    branch: 'numeros',
    topic: 'Números decimales',
    title: 'Operaciones con números decimales',
    description: 'Suma, resta, multiplicación y división con decimales, redondeo y problemas de contexto real.',
    pdfPath: 'gym/1eso/numeros/decimales.pdf',
    available: true,
  },
  {
    id: '1eso-num-intro-fracciones',
    level: '1eso',
    branch: 'numeros',
    topic: 'Fracciones',
    title: 'Introducción al concepto y representación de fracciones',
    description: 'Fracción como parte de un todo, fracción irreducible y cálculo de fracciones equivalentes.',
    pdfPath: 'gym/1eso/numeros/introduccion-fracciones.pdf',
    available: true,
  },
  {
    id: '1eso-num-suma-fracciones',
    level: '1eso',
    branch: 'numeros',
    topic: 'Fracciones',
    title: 'Suma y resta de fracciones con distinto denominador',
    description: 'Cálculo del mínimo común múltiplo (m.c.m.), reducción a común denominador y simplificación final.',
    pdfPath: 'gym/1eso/numeros/suma-fracciones.pdf',
    available: true,
  },
  {
    id: '1eso-num-porcentajes',
    level: '1eso',
    branch: 'numeros',
    topic: 'Proporcionalidad y porcentajes',
    title: 'Cálculo de porcentajes y aumentos/descuentos',
    description: 'Hojas de problemas prácticos con porcentajes aplicados a precios, descuentos e incrementos.',
    pdfPath: 'gym/1eso/numeros/porcentajes.pdf',
    available: true,
  },
  {
    id: '1eso-alg-monomios',
    level: '1eso',
    branch: 'algebra',
    topic: 'Expresiones algebraicas',
    title: 'Iniciación al álgebra: monomios semejantes y operaciones',
    description: 'Grado, coeficiente y parte literal. Suma, resta, producto y división de monomios.',
    pdfPath: 'gym/1eso/algebra/monomios.pdf',
    available: true,
  },
  {
    id: '1eso-geo-areas-perimetros',
    level: '1eso',
    branch: 'geometria',
    topic: 'Áreas y perímetros',
    title: 'Cálculo de perímetros y áreas de figuras planas',
    description: 'Triángulos, cuadriláteros, polígonos regulares y figuras compuestas descompuestas paso a paso.',
    pdfPath: 'gym/1eso/geometria/areas-perimetros.pdf',
    available: true,
  },
  {
    id: '1eso-est-basica',
    level: '1eso',
    branch: 'estadistica',
    topic: 'Estadística descriptiva',
    title: 'Estadística básica: variables, tablas y recuento',
    description: 'Variables cualitativas y cuantitativas, tablas de frecuencias absolutas y relativas.',
    pdfPath: 'gym/1eso/estadistica/estadistica-basica.pdf',
    available: true,
  },
  {
    id: '1eso-est-futbol',
    level: '1eso',
    branch: 'estadistica',
    topic: 'Gráficos estadísticos',
    title: 'Estadística aplicada: análisis de datos deportivos',
    description: 'Caso práctico con datos de fútbol: diagramas de barras, sectores y cálculo de la media.',
    pdfPath: 'gym/1eso/estadistica/estadistica-futbol.pdf',
    available: true,
  },
  {
    id: '1eso-est-problemas',
    level: '1eso',
    branch: 'estadistica',
    topic: 'Estadística descriptiva',
    title: 'Problemas contextualizados de estadística',
    description: 'Interpretación de tablas de datos, cálculo de moda, mediana y media aritmética en situaciones cotidianas.',
    pdfPath: 'gym/1eso/estadistica/problemas-estadistica.pdf',
    available: true,
  },
  {
    id: '2eso-alg-ecuaciones-primer-grado',
    level: '2eso',
    branch: 'algebra',
    topic: 'Ecuaciones 1.º grado',
    title: 'Ecuaciones de primer grado con paréntesis y denominadores',
    description: 'Resolución sistemática de ecuaciones lineales utilizando transposición de términos y el m.c.m.',
    pdfPath: 'gym/2eso/algebra/ecuaciones-primer-grado.pdf',
    available: true,
  },
  {
    id: '2eso-alg-ecuaciones-practica-1',
    level: '2eso',
    branch: 'algebra',
    topic: 'Ecuaciones 1.º grado',
    title: 'Entrenamiento práctico de ecuaciones: Serie A',
    description: 'Batería de ecuaciones graduadas en dificultad para ganar soltura en despeje algebraico.',
    pdfPath: 'gym/2eso/algebra/ecuaciones-practica-1.pdf',
    available: true,
  },
  {
    id: '2eso-alg-ecuaciones-practica-2',
    level: '2eso',
    branch: 'algebra',
    topic: 'Ecuaciones 1.º grado',
    title: 'Entrenamiento práctico de ecuaciones: Serie B',
    description: 'Ecuaciones con múltiples signos negativos y fracciones con denominadores combinados.',
    pdfPath: 'gym/2eso/algebra/ecuaciones-practica-2.pdf',
    available: true,
  },
  {
    id: '2eso-geo-thales-1',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Thales: conceptos y segmentos proporcionales (I)',
    description: 'Aplicación directa del teorema de Thales en rectas secantes cortadas por paralelas.',
    pdfPath: 'gym/2eso/geometria/teorema-thales-1.pdf',
    available: true,
  },
  {
    id: '2eso-geo-thales-2',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Thales: triángulos en posición de Thales (II)',
    description: 'Semejanza de triángulos, cálculo de longitudes desconocidas y escalas.',
    pdfPath: 'gym/2eso/geometria/teorema-thales-2.pdf',
    available: true,
  },
  {
    id: '2eso-geo-thales-3',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Thales: aplicaciones geométricas avanzadas (III)',
    description: 'Determinación de alturas inaccesibles y sombras con razones de proporcionalidad.',
    pdfPath: 'gym/2eso/geometria/teorema-thales-3.pdf',
    available: true,
  },
  {
    id: '2eso-geo-thales-4',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Thales: colección de ejercicios (IV)',
    description: 'Hojas de consolidación con problemas variados de proporcionalidad geométrica.',
    pdfPath: 'gym/2eso/geometria/teorema-thales-4.pdf',
    available: true,
  },
  {
    id: '2eso-geo-problemas-thales',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Problemas reales de aplicación del Teorema de Thales',
    description: 'Resolución de enunciados reales: edificios, árboles, farolas y planos a escala.',
    pdfPath: 'gym/2eso/geometria/problemas-thales.pdf',
    available: true,
  },
  {
    id: '2eso-geo-pitagoras-1',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Pitágoras: cálculo de hipotenusa y catetos (I)',
    description: 'Identificación del triángulo rectángulo y cálculo de lados desconocidos en figuras planas.',
    pdfPath: 'gym/2eso/geometria/teorema-pitagoras-1.pdf',
    available: true,
  },
  {
    id: '2eso-geo-pitagoras-2',
    level: '2eso',
    branch: 'geometria',
    topic: 'Pitágoras y semejanza',
    title: 'Teorema de Pitágoras: problemas en polígonos y figuras compuestas (II)',
    description: 'Cálculo de apotemas, diagonales de cuadrados y rectángulos, y alturas de triángulos isósceles.',
    pdfPath: 'gym/2eso/geometria/teorema-pitagoras-2.pdf',
    available: true,
  },
  {
    id: '2eso-est-general',
    level: '2eso',
    branch: 'estadistica',
    topic: 'Estadística unidimensional',
    title: 'Estadística 2.º ESO: frecuencias, media, mediana y moda',
    description: 'Construcción completa de tablas estadísticas y cálculo de parámetros de centralización.',
    pdfPath: 'gym/2eso/estadistica/estadistica-general.pdf',
    available: true,
  },
  {
    id: '2eso-est-probabilidad',
    level: '2eso',
    branch: 'estadistica',
    topic: 'Probabilidad y Laplace',
    title: 'Iniciación a la probabilidad: Regla de Laplace',
    description: 'Sucesos elementales, espacio muestral y cálculo de probabilidades clásicas con dados, monedas y urnas.',
    pdfPath: 'gym/2eso/estadistica/probabilidad-introduccion.pdf',
    available: true,
  },
  {
    id: '3eso-alg-polinomios',
    level: '3eso',
    branch: 'algebra',
    topic: 'Polinomios y Ruffini',
    title: 'Polinomios: sumas, restas, productos e identidades notables',
    description: 'Operaciones con polinomios, valor numérico y desarrollo del cuadrado de una suma y diferencia.',
    pdfPath: 'gym/3eso/algebra/polinomios.pdf',
    available: true,
  },
  {
    id: '3eso-alg-sistemas-ecuaciones',
    level: '3eso',
    branch: 'algebra',
    topic: 'Sistemas de ecuaciones',
    title: 'Sistemas lineales 2x2: sustitución, igualación y reducción',
    description: 'Resolución de sistemas de dos ecuaciones lineales con dos incógnitas por los tres métodos algebraicos.',
    pdfPath: 'gym/3eso/algebra/sistemas-ecuaciones.pdf',
    available: true,
  },
  {
    id: '3eso-alg-problemas-sistemas',
    level: '3eso',
    branch: 'algebra',
    topic: 'Sistemas de ecuaciones',
    title: 'Problemas verbales resueltos mediante sistemas 2x2',
    description: 'Traducción de enunciados de edades, precios, mezclas y geometría a sistemas lineales.',
    pdfPath: 'gym/3eso/algebra/problemas-sistemas-ecuaciones.pdf',
    available: true,
  },
  {
    id: '3eso-est-general',
    level: '3eso',
    branch: 'estadistica',
    topic: 'Estadística unidimensional',
    title: 'Estadística 3.º ESO: tablas de recuento y gráficos',
    description: 'Análisis estadístico global con diagramas de barras, histogramas y polígonos de frecuencias.',
    pdfPath: 'gym/3eso/estadistica/estadistica-general.pdf',
    available: true,
  },
  {
    id: '3eso-est-tablas-frecuencias',
    level: '3eso',
    branch: 'estadistica',
    topic: 'Estadística unidimensional',
    title: 'Tablas de frecuencias absolutas, relativas y acumuladas',
    description: 'Estructuración metódica de frecuencias (fi, Fi, hi, Hi) y porcentajes acumulados.',
    pdfPath: 'gym/3eso/estadistica/tablas-frecuencias.pdf',
    available: true,
  },
  {
    id: '3eso-est-centralizacion',
    level: '3eso',
    branch: 'estadistica',
    topic: 'Estadística unidimensional',
    title: 'Parámetros de centralización y dispersión',
    description: 'Cálculo de la media ponderada, mediana, moda, rango y desviación típica.',
    pdfPath: 'gym/3eso/estadistica/medidas-centralizacion.pdf',
    available: true,
  },
  {
    id: '3eso-est-datos-agrupados',
    level: '3eso',
    branch: 'estadistica',
    topic: 'Estadística unidimensional',
    title: 'Estadística con datos continuos agrupados en intervalos',
    description: 'Marcas de clase, intervalos de amplitud constante y cálculo de parámetros con datos continuos.',
    pdfPath: 'gym/3eso/estadistica/datos-agrupados.pdf',
    available: true,
  },
  {
    id: '4eso-est-probabilidad-compuesta',
    level: '4eso',
    branch: 'estadistica',
    topic: 'Probabilidad condicionada',
    title: 'Probabilidad compuesta, diagramas de árbol y tablas de contingencia',
    description: 'Experimentos compuestos con y sin reemplazamiento, regla del producto y probabilidad condicionada.',
    pdfPath: 'gym/4eso/estadistica/probabilidad-compuesta.pdf',
    available: true,
  },
  {
    id: '1bach-num-deberes-verano-ccss',
    level: '1bach',
    branch: 'numeros',
    topic: 'Números reales y logaritmos',
    title: 'Cuaderno completo de preparación y repaso: Matemáticas CC.SS.',
    description: 'Dossier exhaustivo de repaso que integra aritmética real, álgebra lineal y funciones elementales.',
    pdfPath: 'gym/1bach/numeros/deberes-verano-ccss.pdf',
    available: true,
  },
  {
    id: '1bach-alg-gauss',
    level: '1bach',
    branch: 'algebra',
    topic: 'Sistemas de ecuaciones',
    title: 'Sistemas de ecuaciones lineales 3x3: Método de Gauss',
    description: 'Triangularización matricial de sistemas, clasificación (SCD, SCI, SI) e interpretación geométrica.',
    pdfPath: 'gym/1bach/algebra/sistemas-ecuaciones-gauss.pdf',
    available: true,
  },
  {
    id: '1bach-fun-tvm',
    level: '1bach',
    branch: 'funciones',
    topic: 'Derivadas',
    title: 'Tasa de Variación Media (TVM) e introducción a la derivada',
    description: 'Definición de TVM en un intervalo, significado geométrico como pendiente de la secante y cálculo analítico.',
    pdfPath: 'gym/1bach/funciones/tasa-variacion-media.pdf',
    available: true,
  },
];

// Configuración y catálogo de exámenes de Selectividad (PAU) para Math Universe.
// Pensado para alojar los PDFs en Cloudflare R2 con una estructura de carpetas predecible
// y sin tener que etiquetar ejercicios manualmente.

/**
 * URL base pública de tu bucket de Cloudflare R2 (o dominio personalizado conectado a R2).
 * Cuando tengas tu bucket listo, solo tienes que sustituir esta URL base.
 *
 * Estructura recomendada dentro del bucket R2:
 *   /selectividad/{comunidad}/{modalidad}/{año}/{slug}-enunciado.pdf
 *   /selectividad/{comunidad}/{modalidad}/{año}/{slug}-solucion.pdf
 *
 * Ejemplo real:
 *   https://pub-xxxxxxxx.r2.dev/selectividad/catalunya/ciencias/2025/junio-serie-1-enunciado.pdf
 *   https://pub-xxxxxxxx.r2.dev/selectividad/catalunya/ciencias/2025/junio-serie-1-solucion.pdf
 */
export const R2_BASE_URL = 'https://pub-a13ce29b88ae4089bc4d88a87441bd57.r2.dev';

export type ModalityId = 'ciencias' | 'ccss';

export type RegionId = 'catalunya' | 'madrid' | 'andalucia' | 'valencia' | 'otras';

export type SessionKind = 'ordinaria' | 'incidencias' | 'extraordinaria';

export interface ExamPaper {
  id: string;
  region: RegionId;
  modality: ModalityId;
  year: number;
  sessionKind: SessionKind;
  /** Título visible de la convocatoria, ej. "Junio · Serie 1" o "Septiembre · Serie 3" */
  title: string;
  /** Subtítulo corto opcional, ej. "Convocatoria Ordinaria · PAU" */
  subtitle: string;
  /** Ruta relativa en R2 o URL completa del PDF de enunciados */
  statementPath: string;
  /** Ruta relativa en R2 o URL completa del PDF de corrección / pauta */
  solutionPath: string;
  /** Cambia a true cuando el PDF ya esté subido a Cloudflare R2 */
  available?: boolean;
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  shortName: string;
  active: boolean;
  note: string;
}

export const REGIONS: RegionInfo[] = [
  {
    id: 'catalunya',
    name: 'Cataluña (PAU)',
    shortName: 'Cataluña',
    active: true,
    note: 'Series oficiales de Junio (Sèrie 1, Sèrie 2 / Incidències) y Septiembre',
  },
  {
    id: 'madrid',
    name: 'Comunidad de Madrid',
    shortName: 'Madrid',
    active: false,
    note: 'Próximamente · Estructura preparada para R2',
  },
  {
    id: 'andalucia',
    name: 'Andalucía',
    shortName: 'Andalucía',
    active: false,
    note: 'Próximamente · Estructura preparada para R2',
  },
  {
    id: 'valencia',
    name: 'Comunidad Valenciana',
    shortName: 'C. Valenciana',
    active: false,
    note: 'Próximamente · Estructura preparada para R2',
  },
];

export const MODALITIES: Record<
  ModalityId,
  {
    id: ModalityId;
    code: string;
    name: string;
    shortName: string;
    subtitle: string;
    durationMinutes: number;
  }
> = {
  ciencias: {
    id: 'ciencias',
    code: 'MAT-II',
    name: 'Matemáticas (Científicas)',
    shortName: 'Matemáticas Científicas',
    subtitle: 'Bachillerato de Ciencias y Tecnología · Matemáticas II',
    durationMinutes: 90,
  },
  ccss: {
    id: 'ccss',
    code: 'MACS-II',
    name: 'Matemáticas Ciencias Sociales',
    shortName: 'Matemáticas CC.SS.',
    subtitle: 'Bachillerato de Humanidades y Ciencias Sociales · Matemáticas Aplicadas',
    durationMinutes: 90,
  },
};

export function resolveR2Url(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }
  return `${R2_BASE_URL.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
}

/**
 * Generador automático de convocatorias anuales para Cataluña (PAU).
 * Así, para añadir un año entero, basta con incluir el año en la lista o personalizar solo excepciones.
 */
function buildCatalunyaYear(
  year: number,
  modality: ModalityId,
  series: { slug: string; title: string; subtitle: string; kind: SessionKind; available?: boolean }[],
): ExamPaper[] {
  return series.map((s) => ({
    id: `cat-${modality}-${year}-${s.slug}`,
    region: 'catalunya',
    modality,
    year,
    sessionKind: s.kind,
    title: s.title,
    subtitle: s.subtitle,
    statementPath: `selectividad/catalunya/${modality}/${year}/${s.slug}-enunciado.pdf`,
    solutionPath: `selectividad/catalunya/${modality}/${year}/${s.slug}-solucion.pdf`,
    available: s.available ?? true,
  }));
}

const CATALUNYA_STANDARD_SERIES: {
  slug: string;
  title: string;
  subtitle: string;
  kind: SessionKind;
  available?: boolean;
}[] = [
  {
    slug: 'ordinaria',
    title: 'Junio · Ordinaria',
    subtitle: 'Convocatoria Ordinaria (PAU)',
    kind: 'ordinaria',
    available: true,
  },
  {
    slug: 'extraordinaria',
    title: 'Septiembre · Extraordinaria',
    subtitle: 'Convocatoria Extraordinaria (PAU)',
    kind: 'extraordinaria',
    available: true,
  },
];

const YEARS = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018,
  2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010
];

export const selectividadExams: ExamPaper[] = [
  ...YEARS.flatMap((year) => [
    ...buildCatalunyaYear(year, 'ciencias', CATALUNYA_STANDARD_SERIES),
    ...buildCatalunyaYear(year, 'ccss', CATALUNYA_STANDARD_SERIES),
  ]),
];

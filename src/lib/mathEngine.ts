// Motor matemático para la Calculadora Científica Natural Display y Herramientas de Math Universe.
// Soporta aritmética racional exacta, detección simbólica de radicales y múltiplos de π,
// factorización prima (FACT), conversión S⇔D (incluyendo decimales periódicos) y ecuaciones de 2.º grado.

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export interface ResultRep {
  id: 'exact' | 'decimal' | 'periodic' | 'mixed' | 'scientific' | 'factors';
  label: string;
  html: string;
  plain: string;
}

export interface PrimeFactor {
  prime: number;
  exponent: number;
}

export interface EvalResult {
  ok: boolean;
  value: number;
  error?: string;
  representations: ResultRep[];
  factors?: PrimeFactor[];
  divisorsCount?: number;
  isPrime?: boolean;
}

export interface QuadraticSolution {
  ok: boolean;
  error?: string;
  a: number;
  b: number;
  c: number;
  discriminant: number;
  nature: 'two-real' | 'one-real' | 'complex';
  natureLabel: string;
  x1ExactHtml: string;
  x2ExactHtml: string;
  x1Decimal: string;
  x2Decimal: string;
  vertexXHtml: string;
  vertexYHtml: string;
  vertexXDec: string;
  vertexYDec: string;
  factoredHtml: string;
  stepsHtml: string[];
}

// ============================================================================
// 1. UTILIDADES ARITMÉTICAS, MCD, MCM, FRACCIONES CONTINUAS Y RADICALES
// ============================================================================

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.trunc(a / gcd(a, b)) * Math.trunc(b));
}

export function factorial(n: number): number {
  if (!Number.isFinite(n) || n < 0) return NaN;
  if (Math.abs(n - Math.round(n)) > 1e-9) return NaN;
  const k = Math.round(n);
  if (k > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= k; i++) res *= i;
  return res;
}

export function nCr(n: number, r: number): number {
  const nn = Math.round(n);
  const rr = Math.round(r);
  if (nn < 0 || rr < 0 || rr > nn) return NaN;
  if (rr === 0 || rr === nn) return 1;
  const k = Math.min(rr, nn - rr);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (nn - k + i)) / i;
  }
  return Math.round(res);
}

export function nPr(n: number, r: number): number {
  const nn = Math.round(n);
  const rr = Math.round(r);
  if (nn < 0 || rr < 0 || rr > nn) return NaN;
  let res = 1;
  for (let i = 0; i < rr; i++) {
    res *= nn - i;
  }
  return res;
}

/**
 * Aproxima un número real como fracción racional p/q mediante fracciones continuas.
 */
export function toFraction(
  val: number,
  maxDenom = 100000,
  tol = 1e-10,
): { n: number; d: number } | null {
  if (!Number.isFinite(val)) return null;
  const sign = val < 0 ? -1 : 1;
  const x = Math.abs(val);
  if (Math.abs(x - Math.round(x)) < tol) {
    return { n: sign * Math.round(x), d: 1 };
  }

  let h1 = 1,
    h2 = 0;
  let k1 = 0,
    k2 = 1;
  let b = x;

  for (let i = 0; i < 45; i++) {
    const a = Math.floor(b);
    const h = a * h1 + h2;
    const k = a * k1 + k2;
    if (k > maxDenom) break;
    h2 = h1;
    h1 = h;
    k2 = k1;
    k1 = k;
    if (Math.abs(x - h1 / k1) <= tol * Math.max(1, x)) {
      const g = gcd(h1, k1);
      return { n: sign * (h1 / g), d: k1 / g };
    }
    const rem = b - a;
    if (rem < 1e-12) break;
    b = 1 / rem;
  }
  return null;
}

/**
 * Detecta si un valor es múltiplo racional exacto de √k o de π: (a * √k) / c o (a * π) / c.
 */
function detectSymbolic(val: number): { html: string; plain: string } | null {
  if (!Number.isFinite(val) || Math.abs(val) < 1e-11) return null;

  // 1. ¿Es múltiplo racional de π?
  const piRatio = toFraction(val / Math.PI, 720, 1e-9);
  if (piRatio && Math.abs(piRatio.n) <= 180 && piRatio.d <= 360) {
    const { n, d } = piRatio;
    const sign = n < 0 ? '−' : '';
    const absN = Math.abs(n);
    const numStr = absN === 1 ? 'π' : `${absN}π`;
    if (d === 1) {
      return {
        html: `<span class="res-sym">${sign}${numStr}</span>`,
        plain: `${sign}${numStr}`,
      };
    }
    return {
      html: renderVerticalFractionHtml(`${sign}${numStr}`, String(d)),
      plain: `${sign}${numStr}/${d}`,
    };
  }

  // 2. ¿Es múltiplo racional de √k para k libre de cuadrados?
  const radicands = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 30];
  for (const k of radicands) {
    const rootK = Math.sqrt(k);
    const ratio = toFraction(val / rootK, 240, 1e-9);
    if (ratio && Math.abs(ratio.n) <= 120 && ratio.d <= 120) {
      const { n, d } = ratio;
      const sign = n < 0 ? '−' : '';
      const absN = Math.abs(n);
      const coef = absN === 1 ? '' : String(absN);
      const numHtml = `${sign}${coef}<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${k}</span></span>`;
      const numPlain = `${sign}${coef}√${k}`;
      if (d === 1) {
        return { html: numHtml, plain: numPlain };
      }
      return {
        html: renderVerticalFractionHtml(numHtml, String(d)),
        plain: `(${numPlain})/${d}`,
      };
    }
  }

  return null;
}

/**
 * Calcula la representación decimal periódica exacta de una fracción n/d (ej. 7/12 -> 0.58(3)).
 */
export function fractionToPeriodicHtml(n: number, d: number): { html: string; plain: string } | null {
  if (d <= 1 || !Number.isSafeInteger(n) || !Number.isSafeInteger(d)) return null;
  // Comprobar si tiene factores distintos de 2 y 5
  let temp = d;
  while (temp % 2 === 0) temp /= 2;
  while (temp % 5 === 0) temp /= 5;
  if (temp === 1) return null; // Es decimal exacto, no periódico
  if (d > 2500) return null; // Evitar periodos extremadamente largos

  const sign = n < 0 ? '−' : '';
  const absN = Math.abs(n);
  const intPart = Math.floor(absN / d);
  let rem = absN % d;

  const digits: number[] = [];
  const seen = new Map<number, number>();

  while (rem !== 0 && !seen.has(rem) && digits.length < 40) {
    seen.set(rem, digits.length);
    rem *= 10;
    digits.push(Math.floor(rem / d));
    rem %= d;
  }

  if (rem === 0 || !seen.has(rem)) return null;
  const start = seen.get(rem)!;
  const nonPeriodic = digits.slice(0, start).join('');
  const periodic = digits.slice(start).join('');

  return {
    html: `<span class="res-periodic">${sign}${intPart}.${nonPeriodic}<span class="m-overline" title="Periodo">${periodic}</span></span>`,
    plain: `${sign}${intPart}.${nonPeriodic}(${periodic})`,
  };
}

/**
 * Descomposición en factores primos de un entero positivo.
 */
export function factorizeInteger(num: number): {
  factors: PrimeFactor[];
  divisorsCount: number;
  isPrime: boolean;
  steps: { quotient: number; divisor: number }[];
} | null {
  const n = Math.abs(Math.trunc(num));
  if (!Number.isFinite(n) || n < 2 || n > 999999999999) return null;

  let rem = n;
  const factors: PrimeFactor[] = [];
  const steps: { quotient: number; divisor: number }[] = [];

  const pushFactor = (p: number) => {
    let count = 0;
    while (rem % p === 0) {
      steps.push({ quotient: rem, divisor: p });
      rem = Math.trunc(rem / p);
      count++;
    }
    if (count > 0) factors.push({ prime: p, exponent: count });
  };

  pushFactor(2);
  pushFactor(3);

  let d = 5;
  while (d * d <= rem) {
    pushFactor(d);
    pushFactor(d + 2);
    d += 6;
  }
  if (rem > 1) {
    steps.push({ quotient: rem, divisor: rem });
    factors.push({ prime: rem, exponent: 1 });
  }

  const divisorsCount = factors.reduce((acc, f) => acc * (f.exponent + 1), 1);
  const isPrime = factors.length === 1 && factors[0].exponent === 1;

  return { factors, divisorsCount, isPrime, steps };
}

export function renderVerticalFractionHtml(numHtml: string, denHtml: string): string {
  return `<span class="m-frac"><span class="m-num">${numHtml}</span><span class="m-bar"></span><span class="m-den">${denHtml}</span></span>`;
}

// ============================================================================
// 2. RENDERIZADOR NATURAL DISPLAY (FRACCIONES VERTICALES, RAÍCES Y POTENCIAS)
// ============================================================================

/**
 * Convierte la expresión interna de la calculadora en HTML de "Natural Textbook Display"
 * con fracciones verticales reales (\frac{a}{b} y también divisiones simples a/b),
 * raíces con barra superior y superíndices.
 */
export function renderNaturalExpression(expr: string): string {
  if (!expr || expr.trim() === '') {
    return '<span class="m-placeholder">0</span>';
  }

  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Parseo recursivo de plantillas \frac{A}{B}, \sqrt{A}, \cbrt{A}, ^{A}
  let i = 0;
  const len = expr.length;

  const readBraced = (): string => {
    if (expr[i] !== '{') return '';
    i++; // saltar '{'
    let depth = 1;
    let start = i;
    while (i < len && depth > 0) {
      if (expr[i] === '{') depth++;
      else if (expr[i] === '}') depth--;
      i++;
    }
    return expr.slice(start, i - 1);
  };

  const parseSegment = (input: string): string => {
    let idx = 0;
    const n = input.length;
    let out = '';

    const extractGroup = (from: number): { content: string; nextIdx: number } => {
      if (input[from] === '{') {
        let d = 1;
        let k = from + 1;
        while (k < n && d > 0) {
          if (input[k] === '{') d++;
          else if (input[k] === '}') d--;
          k++;
        }
        return { content: input.slice(from + 1, Math.max(from + 1, k - 1)), nextIdx: k };
      }
      return { content: '', nextIdx: from };
    };

    while (idx < n) {
      if (input.startsWith('\\frac{', idx)) {
        idx += 5; // apunta al primer '{'
        const numG = extractGroup(idx);
        idx = numG.nextIdx;
        const denG = extractGroup(idx);
        idx = denG.nextIdx;
        const numContent = numG.content ? parseSegment(numG.content) : '<span class="m-slot">□</span>';
        const denContent = denG.content ? parseSegment(denG.content) : '<span class="m-slot">□</span>';
        out += renderVerticalFractionHtml(numContent, denContent);
        continue;
      }

      if (input.startsWith('\\sqrt{', idx)) {
        idx += 5;
        const radG = extractGroup(idx);
        idx = radG.nextIdx;
        const radContent = radG.content ? parseSegment(radG.content) : '<span class="m-slot">□</span>';
        out += `<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${radContent}</span></span>`;
        continue;
      }

      if (input.startsWith('\\cbrt{', idx)) {
        idx += 5;
        const radG = extractGroup(idx);
        idx = radG.nextIdx;
        const radContent = radG.content ? parseSegment(radG.content) : '<span class="m-slot">□</span>';
        out += `<span class="m-sqrt"><sup class="m-root-idx">3</sup><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${radContent}</span></span>`;
        continue;
      }

      if (input.startsWith('^{', idx)) {
        idx += 1;
        const expG = extractGroup(idx);
        idx = expG.nextIdx;
        const expContent = expG.content ? parseSegment(expG.content) : '<span class="m-slot">□</span>';
        out += `<sup class="m-sup">${expContent}</sup>`;
        continue;
      }

      // Potencia rápida ^2, ^3, ^-1 o ^n escrito con teclado
      if (input[idx] === '^') {
        idx++;
        let expToken = '';
        if (input[idx] === '-' || input[idx] === '+') {
          expToken += input[idx++];
        }
        while (idx < n && /[0-9a-zA-Z.]/.test(input[idx])) {
          expToken += input[idx++];
        }
        const renderedExp = expToken ? escapeHtml(expToken) : '<span class="m-slot">□</span>';
        out += `<sup class="m-sup">${renderedExp}</sup>`;
        continue;
      }

      // Símbolo cursor interactivo '¦'
      if (input[idx] === '¦') {
        out += '<span class="m-cursor" aria-hidden="true"></span>';
        idx++;
        continue;
      }

      // Operadores y funciones legibles
      const ch = input[idx];
      if (ch === '*') {
        out += '<span class="m-op">×</span>';
        idx++;
      } else if (ch === '-') {
        out += '<span class="m-op">−</span>';
        idx++;
      } else if (ch === '+') {
        out += '<span class="m-op">+</span>';
        idx++;
      } else {
        out += escapeHtml(ch);
        idx++;
      }
    }

    // Convertir también fracciones simples escritas con barra "a/b" en fracciones verticales visuales
    out = out.replace(
      /(\b\d+(?:\.\d+)?|Ans|π|e)\s*\/\s*(\b\d+(?:\.\d+)?|Ans|π|e|\span class="m-cursor"[^>]*><\/span>)/g,
      (_m, a, b) => renderVerticalFractionHtml(a, b),
    );

    // Embellecer nombres de funciones
    out = out
      .replace(/\bsin\(/g, '<span class="m-fn">sin</span>(')
      .replace(/\bcos\(/g, '<span class="m-fn">cos</span>(')
      .replace(/\btan\(/g, '<span class="m-fn">tan</span>(')
      .replace(/\basin\(/g, '<span class="m-fn">sin⁻¹</span>(')
      .replace(/\bacos\(/g, '<span class="m-fn">cos⁻¹</span>(')
      .replace(/\batan\(/g, '<span class="m-fn">tan⁻¹</span>(')
      .replace(/\bln\(/g, '<span class="m-fn">ln</span>(')
      .replace(/\blog\(/g, '<span class="m-fn">log</span>(')
      .replace(/\bsqrt\(/g, '<span class="m-fn">√</span>(')
      .replace(/\bcbrt\(/g, '<span class="m-fn">∛</span>(')
      .replace(/\babs\(/g, '<span class="m-fn">abs</span>(')
      .replace(/\bnCr\(/g, '<span class="m-fn">nCr</span>(')
      .replace(/\bnPr\(/g, '<span class="m-fn">nPr</span>(')
      .replace(/\bgcd\(/g, '<span class="m-fn">MCD</span>(')
      .replace(/\blcm\(/g, '<span class="m-fn">mcm</span>(');

    return out;
  };

  void readBraced;
  return parseSegment(expr);
}

// ============================================================================
// 3. EVALUADOR CIENTÍFICO COMPLETO (PARSER + EVALUACIÓN SEGURA)
// ============================================================================

/**
 * Traduce la expresión con plantillas Natural Display (\frac{a}{b}, \sqrt{a}, ^{b})
 * a una expresión matemática estándar y la evalúa con soporte de DEG/RAD/GRAD.
 */
export function normalizeToMathExpr(raw: string): string {
  let s = raw.replace(/¦/g, '').trim();
  if (!s) return '';

  // Resolver recursivamente \frac{A}{B}, \sqrt{A}, \cbrt{A}, ^{A}
  let safety = 0;
  while (
    (s.includes('\\frac{') || s.includes('\\sqrt{') || s.includes('\\cbrt{') || s.includes('^{')) &&
    safety < 50
  ) {
    safety++;
    // Reemplazar bloques sin llaves internas anidadas de dentro hacia fuera
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)');
    s = s.replace(/\\cbrt\{([^{}]*)\}/g, 'cbrt($1)');
    s = s.replace(/\^\{([^{}]*)\}/g, '^($1)');
  }

  // Símbolos visuales a operadores estándar
  s = s
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, '(PI)')
    .replace(/\bpi\b/gi, '(PI)')
    .replace(/\bAns\b/g, '(ANS)');

  // Balancear paréntesis abiertos al final (como hace Casio cuando pulsas = sin cerrar el último paréntesis)
  let openCount = 0;
  for (const ch of s) {
    if (ch === '(') openCount++;
    else if (ch === ')') openCount = Math.max(0, openCount - 1);
  }
  if (openCount > 0) {
    s += ')'.repeat(openCount);
  }

  return s;
}

type Token =
  | { type: 'num'; value: number }
  | { type: 'var' }
  | { type: 'op'; value: string }
  | { type: 'fn'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' };

function tokenize(expr: string, ansValue: number): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = expr.length;

  while (i < n) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Números (incluyendo notación científica 1.5e-3)
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < n && /[0-9.]/.test(expr[i])) {
        numStr += expr[i++];
      }
      if (i < n && (expr[i] === 'E' || (expr[i] === 'e' && /[+-0-9]/.test(expr[i + 1] || '')))) {
        // Verificar que no sea la constante 'e' multiplicada
        const nextCh = expr[i + 1] || '';
        if (/[0-9]/.test(nextCh) || ((nextCh === '+' || nextCh === '-') && /[0-9]/.test(expr[i + 2] || ''))) {
          numStr += expr[i++];
          if (expr[i] === '+' || expr[i] === '-') numStr += expr[i++];
          while (i < n && /[0-9]/.test(expr[i])) numStr += expr[i++];
        }
      }
      const val = Number(numStr);
      if (Number.isNaN(val)) throw new Error('Número no válido');
      tokens.push({ type: 'num', value: val });
      continue;
    }

    // Identificadores: funciones, variable x y constantes (PI, ANS, e)
    if (/[a-zA-Z]/.test(ch)) {
      // Si es 'x' o 'X' aislada o seguida de algo que no forme una función
      if ((ch === 'x' || ch === 'X') && !/[a-zA-Z]/.test(expr[i + 1] || '')) {
        tokens.push({ type: 'var' });
        i++;
        continue;
      }
      let id = '';
      while (i < n && /[a-zA-Z0-9]/.test(expr[i])) {
        id += expr[i++];
      }
      if (id === 'PI') {
        tokens.push({ type: 'num', value: Math.PI });
      } else if (id === 'ANS') {
        tokens.push({ type: 'num', value: ansValue });
      } else if (id === 'e') {
        tokens.push({ type: 'num', value: Math.E });
      } else if (id === 'phi') {
        tokens.push({ type: 'num', value: (1 + Math.sqrt(5)) / 2 });
      } else if (id === 'x' || id === 'X') {
        tokens.push({ type: 'var' });
      } else {
        tokens.push({ type: 'fn', value: id });
      }
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    if (ch === ',' || ch === ';') {
      tokens.push({ type: 'comma' });
      i++;
      continue;
    }

    if ('+-*/^!%'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    throw new Error(`Carácter no reconocido: ${ch}`);
  }

  // Insertar multiplicación implícita: ej. 2x, 2(3), (2)(3), 2sin(30), 2PI, )2, x(x+1)
  const withImplicit: Token[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const curr = tokens[k];
    const prev = withImplicit[withImplicit.length - 1];
    if (prev) {
      const prevEndsValue =
        prev.type === 'num' ||
        prev.type === 'var' ||
        prev.type === 'rparen' ||
        (prev.type === 'op' && (prev.value === '!' || prev.value === '%'));
      const currStartsValue =
        curr.type === 'num' ||
        curr.type === 'var' ||
        curr.type === 'fn' ||
        curr.type === 'lparen';
      if (prevEndsValue && currStartsValue) {
        withImplicit.push({ type: 'op', value: '*' });
      }
    }
    withImplicit.push(curr);
  }

  return withImplicit;
}

export function evaluateMath(
  rawExpr: string,
  options: { angleMode?: AngleMode; ans?: number; x?: number } = {},
): EvalResult {
  const angleMode = options.angleMode ?? 'DEG';
  const ans = options.ans ?? 0;
  const xVar = options.x ?? 0;

  try {
    const normalized = normalizeToMathExpr(rawExpr);
    if (!normalized) {
      return {
        ok: true,
        value: 0,
        representations: [{ id: 'decimal', label: 'DEC', html: '0', plain: '0' }],
      };
    }

    const tokens = tokenize(normalized, ans);
    let pos = 0;

    const toRad = (ang: number): number => {
      if (angleMode === 'DEG') return (ang * Math.PI) / 180;
      if (angleMode === 'GRAD') return (ang * Math.PI) / 200;
      return ang;
    };

    const fromRad = (rad: number): number => {
      if (angleMode === 'DEG') return (rad * 180) / Math.PI;
      if (angleMode === 'GRAD') return (rad * 200) / Math.PI;
      return rad;
    };

    // Trigonométricas con limpieza de ceros exactos en ángulos notables (sin(180)=0, cos(90)=0, tan(45)=1)
    const cleanTrig = (val: number): number => (Math.abs(val) < 1e-15 ? 0 : val);

    const parseExpression = (): number => {
      let left = parseTerm();
      while (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'op' && (t.value === '+' || t.value === '-')) {
          pos++;
          const right = parseTerm();
          left = t.value === '+' ? left + right : left - right;
        } else {
          break;
        }
      }
      return left;
    };

    const parseTerm = (): number => {
      let left = parsePower();
      while (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'op' && (t.value === '*' || t.value === '/')) {
          pos++;
          const right = parsePower();
          if (t.value === '/' && Math.abs(right) < 1e-18) {
            throw new Error('División entre cero');
          }
          left = t.value === '*' ? left * right : left / right;
        } else {
          break;
        }
      }
      return left;
    };

    const parsePower = (): number => {
      const base = parseUnary();
      if (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'op' && t.value === '^') {
          pos++;
          const exp = parsePower(); // Asociativo por la derecha
          return Math.pow(base, exp);
        }
      }
      return base;
    };

    const parseUnary = (): number => {
      if (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'op' && (t.value === '+' || t.value === '-')) {
          pos++;
          const val = parseUnary();
          return t.value === '-' ? -val : val;
        }
      }
      return parsePostfix();
    };

    const parsePostfix = (): number => {
      let val = parsePrimary();
      while (pos < tokens.length) {
        const t = tokens[pos];
        if (t.type === 'op' && t.value === '!') {
          pos++;
          val = factorial(val);
        } else if (t.type === 'op' && t.value === '%') {
          pos++;
          val = val / 100;
        } else {
          break;
        }
      }
      return val;
    };

    const parsePrimary = (): number => {
      const t = tokens[pos];
      if (!t) throw new Error('Expresión incompleta');

      if (t.type === 'num') {
        pos++;
        return t.value;
      }

      if (t.type === 'var') {
        pos++;
        return xVar;
      }

      if (t.type === 'lparen') {
        pos++;
        const v = parseExpression();
        if (tokens[pos]?.type === 'rparen') pos++;
        return v;
      }

      if (t.type === 'fn') {
        const fnName = t.value.toLowerCase();
        pos++;
        if (tokens[pos]?.type !== 'lparen') {
          throw new Error(`Falta '(' tras ${t.value}`);
        }
        pos++; // saltar '('
        const args: number[] = [];
        if (tokens[pos]?.type !== 'rparen') {
          args.push(parseExpression());
          while (tokens[pos]?.type === 'comma') {
            pos++;
            args.push(parseExpression());
          }
        }
        if (tokens[pos]?.type === 'rparen') pos++;

        const a0 = args[0] ?? 0;
        const a1 = args[1] ?? 0;

        switch (fnName) {
          case 'sin':
            return cleanTrig(Math.sin(toRad(a0)));
          case 'cos':
            return cleanTrig(Math.cos(toRad(a0)));
          case 'tan': {
            const c = cleanTrig(Math.cos(toRad(a0)));
            if (c === 0) throw new Error('Tangente indefinida (asíntota)');
            return cleanTrig(Math.sin(toRad(a0)) / c);
          }
          case 'asin':
            if (a0 < -1 || a0 > 1) throw new Error('Dominio de sin⁻¹ es [-1, 1]');
            return fromRad(Math.asin(a0));
          case 'acos':
            if (a0 < -1 || a0 > 1) throw new Error('Dominio de cos⁻¹ es [-1, 1]');
            return fromRad(Math.acos(a0));
          case 'atan':
            return fromRad(Math.atan(a0));
          case 'sqrt':
            if (a0 < 0) throw new Error('Raíz par de número negativo');
            return Math.sqrt(a0);
          case 'cbrt':
            return Math.cbrt(a0);
          case 'nthroot':
            if (a0 === 0) throw new Error('Índice de raíz no puede ser 0');
            return a1 < 0 && a0 % 2 === 1 ? -Math.pow(-a1, 1 / a0) : Math.pow(a1, 1 / a0);
          case 'ln':
            if (a0 <= 0) throw new Error('Logaritmo de número ≤ 0');
            return Math.log(a0);
          case 'log':
            if (a0 <= 0) throw new Error('Logaritmo de número ≤ 0');
            return args.length >= 2 ? Math.log(a1) / Math.log(a0) : Math.log10(a0);
          case 'abs':
            return Math.abs(a0);
          case 'ncr':
            return nCr(a0, a1);
          case 'npr':
            return nPr(a0, a1);
          case 'gcd':
          case 'mcd':
            return args.reduce((acc, v) => gcd(acc, v));
          case 'lcm':
          case 'mcm':
            return args.reduce((acc, v) => lcm(acc, v));
          default:
            throw new Error(`Función desconocida: ${t.value}`);
        }
      }

      throw new Error('Error de sintaxis');
    };

    const value = parseExpression();
    if (pos < tokens.length) {
      throw new Error('Error de sintaxis');
    }
    if (!Number.isFinite(value)) {
      throw new Error(Number.isNaN(value) ? 'Indeterminación matemática' : 'Valor fuera de rango (∞)');
    }

    // Construir representaciones para el botón S⇔D y FACT
    const representations = buildRepresentations(value);
    const factInfo =
      Math.abs(value - Math.round(value)) < 1e-9 && Math.abs(Math.round(value)) >= 2
        ? factorizeInteger(Math.round(value))
        : null;

    if (factInfo) {
      const sign = value < 0 ? '−' : '';
      const factHtml =
        sign +
        factInfo.factors
          .map((f) => (f.exponent > 1 ? `${f.prime}<sup class="m-sup">${f.exponent}</sup>` : `${f.prime}`))
          .join(' <span class="m-op">×</span> ');
      const factPlain =
        sign +
        factInfo.factors.map((f) => (f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`)).join(' × ');
      representations.push({
        id: 'factors',
        label: 'FACT',
        html: factHtml,
        plain: factPlain,
      });
    }

    return {
      ok: true,
      value,
      representations,
      factors: factInfo?.factors,
      divisorsCount: factInfo?.divisorsCount,
      isPrime: factInfo?.isPrime,
    };
  } catch (err) {
    return {
      ok: false,
      value: NaN,
      error: err instanceof Error ? err.message : 'Error de sintaxis',
      representations: [],
    };
  }
}

function formatCleanDecimal(val: number): string {
  if (Math.abs(val) < 1e-14) return '0';
  if (Math.abs(val) >= 1e11 || (Math.abs(val) > 0 && Math.abs(val) < 1e-7)) {
    return val.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return Number(val.toPrecision(11)).toString();
}

function buildRepresentations(val: number): ResultRep[] {
  const reps: ResultRep[] = [];
  const decStr = formatCleanDecimal(val);
  const decHtml = decStr.replace('-', '−');

  // 1. ¿Es fracción racional exacta no entera?
  const frac = toFraction(val, 50000, 1e-10);
  if (frac && frac.d > 1) {
    const sign = frac.n < 0 ? '−' : '';
    const absN = Math.abs(frac.n);
    reps.push({
      id: 'exact',
      label: 'FRAC a/b',
      html: `${sign}${renderVerticalFractionHtml(String(absN), String(frac.d))}`,
      plain: `${sign}${absN}/${frac.d}`,
    });

    // Decimal periódico si existe
    const periodic = fractionToPeriodicHtml(frac.n, frac.d);
    if (periodic) {
      reps.push({
        id: 'periodic',
        label: 'PERIÓDICO',
        html: periodic.html,
        plain: periodic.plain,
      });
    }

    // Número mixto si |n| > d
    if (absN > frac.d) {
      const whole = Math.floor(absN / frac.d);
      const rem = absN % frac.d;
      reps.push({
        id: 'mixed',
        label: 'MIXTO c a/b',
        html: `<span class="m-mixed">${sign}${whole}</span>${renderVerticalFractionHtml(String(rem), String(frac.d))}`,
        plain: `${sign}${whole} ${rem}/${frac.d}`,
      });
    }
  } else {
    // 2. ¿Es radical exacto o múltiplo de π?
    const sym = detectSymbolic(val);
    if (sym) {
      reps.push({
        id: 'exact',
        label: 'EXACTO',
        html: sym.html,
        plain: sym.plain,
      });
    }
  }

  // 3. Representación decimal estándar
  reps.push({
    id: 'decimal',
    label: 'DECIMAL',
    html: `<span class="res-dec">${decHtml}</span>`,
    plain: decStr,
  });

  // 4. Notación científica si el número no es 0
  if (Math.abs(val) > 0) {
    const expParts = val.toExponential(5).split('e');
    const mantissa = Number(expParts[0]).toString().replace('-', '−');
    const exp = Number(expParts[1]);
    reps.push({
      id: 'scientific',
      label: 'CIENTÍFICA',
      html: `${mantissa} <span class="m-op">×</span> 10<sup class="m-sup">${exp}</sup>`,
      plain: `${mantissa} × 10^${exp}`,
    });
  }

  return reps;
}

// ============================================================================
// 4. RESOLUTOR DE ECUACIONES DE 2.º GRADO (ax² + bx + c = 0) CON FORMATO EXACTO
// ============================================================================

export function solveQuadraticEquation(a: number, b: number, c: number): QuadraticSolution {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return {
      ok: false,
      error: 'Introduce coeficientes numéricos válidos.',
      a,
      b,
      c,
      discriminant: 0,
      nature: 'two-real',
      natureLabel: '',
      x1ExactHtml: '',
      x2ExactHtml: '',
      x1Decimal: '',
      x2Decimal: '',
      vertexXHtml: '',
      vertexYHtml: '',
      vertexXDec: '',
      vertexYDec: '',
      factoredHtml: '',
      stepsHtml: [],
    };
  }

  if (Math.abs(a) < 1e-12) {
    return {
      ok: false,
      error: 'El coeficiente "a" no puede ser 0 en una ecuación de 2.º grado.',
      a,
      b,
      c,
      discriminant: 0,
      nature: 'two-real',
      natureLabel: '',
      x1ExactHtml: '',
      x2ExactHtml: '',
      x1Decimal: '',
      x2Decimal: '',
      vertexXHtml: '',
      vertexYHtml: '',
      vertexXDec: '',
      vertexYDec: '',
      factoredHtml: '',
      stepsHtml: [],
    };
  }

  const disc = b * b - 4 * a * c;
  const vx = -b / (2 * a);
  const vy = a * vx * vx + b * vx + c;

  const formatValExact = (v: number): string => {
    const reps = buildRepresentations(v);
    return reps[0]?.html ?? formatCleanDecimal(v);
  };

  const vertexXHtml = formatValExact(vx);
  const vertexYHtml = formatValExact(vy);
  const vertexXDec = formatCleanDecimal(vx);
  const vertexYDec = formatCleanDecimal(vy);

  const stepsHtml: string[] = [
    `1. Calculamos el discriminante: <strong>Δ = b² − 4ac</strong> = (${b})² − 4·(${a})·(${c}) = <strong>${formatCleanDecimal(disc)}</strong>`,
    `2. Aplicamos la fórmula general: ${renderVerticalFractionHtml(`−(${b}) ± <span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">${formatCleanDecimal(disc)}</span></span>`, `2·(${a})`)}`,
  ];

  if (Math.abs(disc) < 1e-11) {
    const x0 = -b / (2 * a);
    const x0Html = formatValExact(x0);
    const x0Dec = formatCleanDecimal(x0);
    const signStr = x0 >= 0 ? `− ${x0Dec}` : `+ ${formatCleanDecimal(Math.abs(x0))}`;
    return {
      ok: true,
      a,
      b,
      c,
      discriminant: 0,
      nature: 'one-real',
      natureLabel: 'Δ = 0 · Una solución real doble',
      x1ExactHtml: x0Html,
      x2ExactHtml: x0Html,
      x1Decimal: x0Dec,
      x2Decimal: x0Dec,
      vertexXHtml,
      vertexYHtml,
      vertexXDec,
      vertexYDec,
      factoredHtml: `${a === 1 ? '' : a}(x ${signStr})² = 0`,
      stepsHtml,
    };
  }

  if (disc > 0) {
    const sqrtD = Math.sqrt(disc);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    const x1Html = formatValExact(x1);
    const x2Html = formatValExact(x2);
    const x1Dec = formatCleanDecimal(x1);
    const x2Dec = formatCleanDecimal(x2);

    const f1 = x1 >= 0 ? `(x − ${x1Dec})` : `(x + ${formatCleanDecimal(Math.abs(x1))})`;
    const f2 = x2 >= 0 ? `(x − ${x2Dec})` : `(x + ${formatCleanDecimal(Math.abs(x2))})`;

    return {
      ok: true,
      a,
      b,
      c,
      discriminant: disc,
      nature: 'two-real',
      natureLabel: 'Δ > 0 · Dos soluciones reales distintas',
      x1ExactHtml: x1Html,
      x2ExactHtml: x2Html,
      x1Decimal: x1Dec,
      x2Decimal: x2Dec,
      vertexXHtml,
      vertexYHtml,
      vertexXDec,
      vertexYDec,
      factoredHtml: `${a === 1 ? '' : a}${f1}${f2} = 0`,
      stepsHtml,
    };
  }

  // Raíces complejas conjugadas (Δ < 0)
  const realPart = -b / (2 * a);
  const imagPart = Math.sqrt(Math.abs(disc)) / Math.abs(2 * a);
  const realHtml = Math.abs(realPart) < 1e-11 ? '' : `${formatValExact(realPart)} `;
  const imagHtml = formatValExact(imagPart);
  const realDec = Math.abs(realPart) < 1e-11 ? '0' : formatCleanDecimal(realPart);
  const imagDec = formatCleanDecimal(imagPart);

  return {
    ok: true,
    a,
    b,
    c,
    discriminant: disc,
    nature: 'complex',
    natureLabel: 'Δ < 0 · Sin soluciones reales (2 raíces complejas conjugadas)',
    x1ExactHtml: `${realHtml}+ ${imagHtml}·<em>i</em>`,
    x2ExactHtml: `${realHtml}− ${imagHtml}·<em>i</em>`,
    x1Decimal: `${realDec} + ${imagDec}i`,
    x2Decimal: `${realDec} − ${imagDec}i`,
    vertexXHtml,
    vertexYHtml,
    vertexXDec,
    vertexYDec,
    factoredHtml: 'Irreducible en ℝ',
    stepsHtml,
  };
}

// ============================================================================
// 5. EVALUADOR DE FUNCIONES REALES f(x) PARA EL GRAFICADOR 2D
// ============================================================================

export function compileMathFunction(
  rawExpr: string,
  angleMode: AngleMode = 'RAD',
): { ok: boolean; error?: string; fn: (x: number) => number } {
  const clean = normalizeToMathExpr(rawExpr);
  if (!clean) {
    return { ok: false, error: 'Vacía', fn: () => NaN };
  }

  try {
    // Validar tokenización inicial
    tokenize(clean, 0);
    const fn = (x: number): number => {
      const res = evaluateMath(clean, { angleMode, x });
      return res.ok ? res.value : NaN;
    };
    return { ok: true, fn };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Expresión no válida',
      fn: () => NaN,
    };
  }
}

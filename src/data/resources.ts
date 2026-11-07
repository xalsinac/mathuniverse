export type Resource = {
  id: string;
  number: string;
  name: string;
  eyebrow: string;
  description: string;
  detail: string;
  href: string;
  icon: 'lab' | 'dojo' | 'junior' | 'games' | 'lessons' | 'exams' | 'practice' | 'advanced' | 'proofs';
  color: string;
};

// Punto único de edición para los proyectos que aparecen en la portada.
export const resources: Resource[] = [
  { id: 'lab', number: '01', name: 'Math Lab', eyebrow: 'Explorar y experimentar', description: 'Herramientas visuales para entender las matemáticas en movimiento.', detail: 'Un laboratorio de ideas para observar, probar y construir intuición.', href: 'https://mathlab-phi.vercel.app/', icon: 'lab', color: '#b6ff5c' },
  { id: 'dojo', number: '02', name: 'Math Dojo', eyebrow: 'Entrenar con propósito', description: 'Retos pensados para afianzar técnica, estrategia y confianza.', detail: 'Práctica inteligente, progresiva y sin ruido.', href: 'https://mathdojo-one.vercel.app/', icon: 'dojo', color: '#ff8a5b' },
  { id: 'junior', number: '03', name: 'Math Dojo Junior', eyebrow: 'Primeras exploraciones', description: 'Matemáticas para descubrir jugando, creando y preguntando.', detail: 'Un espacio amable para mentes curiosas.', href: 'https://mathdojojr.vercel.app/', icon: 'junior', color: '#74d5ff' },
  { id: 'games', number: '04', name: 'Juegos matemáticos', eyebrow: 'Jugar es pensar', description: 'Juegos para PC y móvil que convierten el razonamiento en una aventura.', detail: 'Aprender sin darse cuenta también cuenta.', href: '#', icon: 'games', color: '#c39bff' },
  { id: 'lessons', number: '05', name: 'Clases de matemáticas', eyebrow: 'Entender de verdad', description: 'Explicaciones claras para convertir conceptos complejos en ideas cercanas.', detail: 'Del porqué al cómo, paso a paso.', href: '#', icon: 'lessons', color: '#ffd85c' },
  { id: 'exams', number: '06', name: 'Exámenes y Selectividad', eyebrow: 'Preparar con calma', description: 'Exámenes corregidos, criterios y recursos para llegar preparado.', detail: 'Material para estudiar con perspectiva.', href: '#', icon: 'exams', color: '#ff82bb' },
  { id: 'practice', number: '07', name: 'Ejercicios y repaso', eyebrow: 'Practicar con sentido', description: 'Colecciones de ejercicios para consolidar cada paso del camino.', detail: 'Menos repetir: más aprender.', href: '#', icon: 'practice', color: '#86f4c5' },
  { id: 'advanced', number: '08', name: 'Matemáticas avanzadas', eyebrow: 'Ir más allá', description: 'Recursos para seguir explorando cuando las preguntas crecen.', detail: 'Profundidad, rigor y asombro.', href: '#', icon: 'advanced', color: '#a4aaff' },
  { id: 'proofs', number: '09', name: 'Demostraciones', eyebrow: 'La belleza de demostrar', description: 'Ideas, pruebas y conexiones que muestran la arquitectura matemática.', detail: 'Porque comprender una demostración cambia la mirada.', href: '#', icon: 'proofs', color: '#f7a6ff' },
];

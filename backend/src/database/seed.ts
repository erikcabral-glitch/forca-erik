import { db } from './db';

const palavras: [string, string][] = [
  ['PYTHON', 'Linguagens'], ['JAVA', 'Linguagens'],
  ['JAVASCRIPT', 'Linguagens'], ['TYPESCRIPT', 'Linguagens'],
  ['MOUSE', 'Computação'], ['TECLADO', 'Computação'],
  ['INTERNET', 'Computação'], ['HACKER', 'Computação'],
  ['COMPUTADOR', 'Computação'], ['HARDWARE', 'Computação'],
  ['NOTEBOOK', 'Computação'], ['TECNOLOGIA', 'Computação'],
  ['CIBERSEGURANCA', 'Computação'], ['SOFTWARE', 'Programação'],
  ['PROGRAMACAO', 'Programação'], ['INTELIGENCIAARTIFICIAL', 'Programação'],
  ['DESENVOLVIMENTO', 'Programação'], ['CRIPTOGRAFIA', 'Programação'],
  ['ALGORITMO', 'Programação'], ['PROGRAMADOR', 'Programação'],
];
const inserir = db.prepare(
  'INSERT OR IGNORE INTO palavras (texto, categoria) VALUES (?, ?)'
);
const inserirTodas = db.transaction((lista: [string, string][]) => {
  for (const [texto, categoria] of lista) inserir.run(texto, categoria);
});
inserirTodas(palavras);
console.log('Seed concluído');
db.close();

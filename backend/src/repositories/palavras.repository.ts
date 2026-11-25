import { db } from '../database/db';
interface Palavra {
  id: number;
  texto: string;
  categoria: string;
}
export function sortearPalavra(): Palavra | undefined {
  return db.prepare(
    'SELECT id, texto, categoria FROM palavras ORDER BY RANDOM() LIMIT 1'
  ).get() as Palavra | undefined;
}

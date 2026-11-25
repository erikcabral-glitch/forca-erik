import { db } from '../database/db';
import type { ItemRanking } from '../types';

export function buscarRanking(): ItemRanking[] {
  return db.prepare(`
    SELECT
      partidas.jogador,
      partidas.pontos,
      palavras.texto AS palavra,
      partidas.finalizada_em AS finalizadaEm
    FROM partidas
    JOIN palavras ON palavras.id = partidas.palavra_id
    WHERE partidas.status = 'vitoria'
    ORDER BY
      partidas.pontos DESC,
      partidas.finalizada_em ASC,
      partidas.id ASC
    LIMIT 10
  `).all() as ItemRanking[];
}
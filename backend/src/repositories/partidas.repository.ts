import { db } from '../database/db';
import type { PartidaInterna } from '../game/regras';
export function criarPartida(jogador: string, palavraId: number): number {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO partidas (jogador, palavra_id) VALUES (?, ?)')
    .run(jogador, palavraId);
  return Number(lastInsertRowid);
}

export interface LinhaPartida {
  id: number;
  jogador: string;
  palavra: string;
  categoria: string;
  letras_tentadas: string;
  erros: number;
  status: 'em_andamento' | 'vitoria' | 'derrota';
  pontos: number;
  finalizada_em: string | null;
}

export function buscarPartida(id: number): LinhaPartida | undefined {
  return db.prepare(`
    SELECT
      partidas.id,
      partidas.jogador,
      palavras.texto AS palavra,
      palavras.categoria,
      partidas.letras_tentadas,
      partidas.erros,
      partidas.status,
      partidas.pontos,
      partidas.finalizada_em
    FROM partidas
    JOIN palavras ON palavras.id = partidas.palavra_id
    WHERE partidas.id = ?
  `).get(id) as LinhaPartida | undefined;
}

export function atualizarPartida(
  id: number,
  partida: PartidaInterna,
): void {
  const finalizadaEm = partida.status === 'em_andamento'
    ? null
    : new Date().toISOString();

  db.prepare(`
    UPDATE partidas
    SET
      letras_tentadas = ?,
      erros = ?,
      status = ?,
      pontos = ?,
      finalizada_em = ?
    WHERE id = ?
  `).run(
    partida.letrasTentadas.join(''),
    6 - partida.vidasRestantes,
    partida.status,
    partida.pontos,
    finalizadaEm,
    id,
  );
}
import { db } from '../database/db';
import { ErroApp } from '../erros';
import { criarPartida } from '../repositories/partidas.repository';
import { consultarPartida } from './partidas.service';
import type { EstadoPartida } from '../types';

export type Dificuldade = 'facil' | 'medio' | 'dificil';

interface PalavraSorteada {
  id: number;
}

interface PartidaComDica {
  status: EstadoPartida['status'];
  erros: number;
  dica_usada: number;
  dica: string;
}

export interface RespostaDica {
  partida: EstadoPartida;
  dica: string;
}

export function iniciarComDificuldade(
  jogador: string,
  dificuldade?: Dificuldade,
): EstadoPartida {
  const limites = {
    facil: [1, 6],
    medio: [7, 9],
    dificil: [10, 1000],
  } as const;

  const [minimo, maximo] = dificuldade
    ? limites[dificuldade]
    : [1, 1000];

  const executar = db.transaction(() => {
    const palavra = db.prepare(`
      SELECT id
      FROM palavras
      WHERE LENGTH(texto) BETWEEN ? AND ?
      ORDER BY RANDOM()
      LIMIT 1
    `).get(minimo, maximo) as PalavraSorteada | undefined;

    if (!palavra) {
      throw new ErroApp('Nenhuma palavra disponível. Execute o seed.', 503);
    }

    const id = criarPartida(jogador, palavra.id);
    return consultarPartida(id);
  });

  return executar.immediate();
}

export function solicitarDica(id: number): RespostaDica {
  const executar = db.transaction(() => {
    const partida = db.prepare(`
      SELECT
        partidas.status,
        partidas.erros,
        partidas.dica_usada,
        palavras.dica
      FROM partidas
      JOIN palavras ON palavras.id = partidas.palavra_id
      WHERE partidas.id = ?
    `).get(id) as PartidaComDica | undefined;

    if (!partida) {
      throw new ErroApp('Partida não encontrada.', 404);
    }

    if (partida.status !== 'em_andamento') {
      throw new ErroApp('A partida já foi encerrada.', 409);
    }

    if (partida.dica_usada) {
      throw new ErroApp('A dica já foi utilizada nesta partida.', 409);
    }

    if (!partida.dica.trim()) {
      throw new ErroApp('Esta palavra ainda não possui uma dica.', 409);
    }

    const erros = partida.erros + 1;
    const perdeu = erros >= 6;

    db.prepare(`
      UPDATE partidas
      SET
        erros = ?,
        dica_usada = 1,
        status = ?,
        pontos = 0,
        finalizada_em = ?
      WHERE id = ?
    `).run(
      erros,
      perdeu ? 'derrota' : 'em_andamento',
      perdeu ? new Date().toISOString() : null,
      id,
    );

    return {
      partida: consultarPartida(id),
      dica: partida.dica,
    };
  });

  return executar.immediate();
}
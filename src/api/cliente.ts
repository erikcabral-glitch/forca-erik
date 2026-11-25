import type { EstadoPartida, ItemRanking } from '../types';

export type Dificuldade = 'facil' | 'medio' | 'dificil';

export interface RespostaDica {
  partida: EstadoPartida;
  dica: string;
}

async function requisitar<T>(
  caminho: string,
  opcoes?: RequestInit,
): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(caminho, opcoes);
  } catch {
    throw new Error('Servidor fora do ar. Tente novamente.');
  }

  let corpo: unknown;

  try {
    corpo = await resposta.json();
  } catch {
    throw new Error('Não foi possível obter uma resposta válida do servidor.');
  }

  if (!resposta.ok) {
    if (
      typeof corpo === 'object' &&
      corpo !== null &&
      'erro' in corpo &&
      typeof corpo.erro === 'string'
    ) {
      throw new Error(corpo.erro);
    }

    throw new Error('Não foi possível concluir a solicitação.');
  }

  return corpo as T;
}

function enviar<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}

export const api = {
  novaPartida(
    jogador: string,
    dificuldade: Dificuldade,
  ): Promise<EstadoPartida> {
    return enviar('/api/partidas', { jogador, dificuldade });
  },

  consultarPartida(id: number): Promise<EstadoPartida> {
    return requisitar(`/api/partidas/${id}`);
  },

  palpitar(id: number, letra: string): Promise<EstadoPartida> {
    return enviar(`/api/partidas/${id}/palpites`, { letra });
  },

  dica(id: number): Promise<RespostaDica> {
    return enviar(`/api/partidas/${id}/dica`, {});
  },

  ranking(): Promise<ItemRanking[]> {
    return requisitar('/api/ranking');
  },
};
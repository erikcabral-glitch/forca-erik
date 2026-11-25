import type { EstadoPartida, ItemRanking } from '../types';

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

export const api = {
  novaPartida(jogador: string): Promise<EstadoPartida> {
    return requisitar<EstadoPartida>('/api/partidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jogador }),
    });
  },

  consultarPartida(id: number): Promise<EstadoPartida> {
    return requisitar<EstadoPartida>(`/api/partidas/${id}`);
  },

  palpitar(id: number, letra: string): Promise<EstadoPartida> {
    return requisitar<EstadoPartida>(`/api/partidas/${id}/palpites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letra }),
    });
  },

  ranking(): Promise<ItemRanking[]> {
    return requisitar<ItemRanking[]>('/api/ranking');
  },
};
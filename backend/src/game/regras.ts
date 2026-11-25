import type { StatusPartida } from '../types';

/** Mostra as letras já tentadas e troca as demais por "_". */
export function gerarMascara(palavra: string, tentadas: string[]): string {
  return [...palavra].map((letra) => tentadas.includes(letra) ? letra : '_').join('');
}
/** Calcula os pontos de uma vitória. */
export function calcularPontos(palavra: string, vidasRestantes: number): number {
  const letrasDistintas = new Set(palavra).size;
  return vidasRestantes * 10 + letrasDistintas * 5;
}
export interface PartidaInterna {
  palavra: string;
  letrasTentadas: string[];
  vidasRestantes: number;
  status: StatusPartida;
  pontos: number;
}
/** Aplica um palpite e devolve uma nova partida. */
export function aplicarPalpite(
  partida: PartidaInterna,
  palpite: string,
): PartidaInterna {
  if (partida.status !== 'em_andamento') {
    throw new Error('A partida já foi encerrada.');
  }
  if (palpite.length !== 1 || !/^[A-Za-z]$/.test(palpite)) {
    throw new Error('Digite uma única letra de A a Z.');
  }
  const letra = palpite.toUpperCase();
  if (partida.letrasTentadas.includes(letra)) {
    throw new Error('Essa letra já foi tentada.');
  }
  const letrasTentadas = [...partida.letrasTentadas, letra];
  const acertou = partida.palavra.includes(letra);
  const vidasRestantes = partida.vidasRestantes - (acertou ? 0 : 1);
  const venceu = !gerarMascara(partida.palavra, letrasTentadas).includes('_');
  let status: StatusPartida = 'em_andamento';
  let pontos = 0;
  if (venceu) {
    status = 'vitoria';
    pontos = calcularPontos(partida.palavra, vidasRestantes);
  } else if (vidasRestantes === 0) {
    status = 'derrota';
  }
  return { ...partida, letrasTentadas, vidasRestantes, status, pontos };
}

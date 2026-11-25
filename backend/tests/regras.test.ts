import { describe, expect, it } from 'vitest';
import {
  aplicarPalpite,
  calcularPontos,
  gerarMascara,
  type PartidaInterna,
} from '../src/game/regras';

function novaPartida(): PartidaInterna {
  return {
    palavra: 'JAVA',
    letrasTentadas: [],
    vidasRestantes: 6,
    status: 'em_andamento',
    pontos: 0,
  };
}

describe('Regras do jogo', () => {
  it('revela todas as ocorrências da letra tentada', () => {
    expect(gerarMascara('JAVA', ['A'])).toBe('_A_A');
  });

  it('calcula os pontos usando letras distintas', () => {
    expect(calcularPontos('JAVA', 4)).toBe(55);
  });

  it('desconta uma vida por erro sem alterar a partida original', () => {
    const original = novaPartida();
    const atualizada = aplicarPalpite(original, 'Z');

    expect(atualizada.vidasRestantes).toBe(5);
    expect(atualizada.letrasTentadas).toEqual(['Z']);
    expect(original.vidasRestantes).toBe(6);
    expect(original.letrasTentadas).toEqual([]);
  });

  it('rejeita uma letra já tentada', () => {
    const partida = aplicarPalpite(novaPartida(), 'A');

    expect(() => aplicarPalpite(partida, 'a')).toThrow();
    expect(partida.vidasRestantes).toBe(6);
  });

  it('encerra a vitória e calcula a pontuação', () => {
    let partida = novaPartida();

    for (const letra of ['A', 'Z', 'J', 'V']) {
      partida = aplicarPalpite(partida, letra);
    }

    expect(partida.status).toBe('vitoria');
    expect(partida.pontos).toBe(65);
  });

  it('encerra a derrota com zero pontos', () => {
    let partida = novaPartida();

    for (const letra of ['B', 'C', 'D', 'E', 'F', 'G']) {
      partida = aplicarPalpite(partida, letra);
    }

    expect(partida.status).toBe('derrota');
    expect(partida.vidasRestantes).toBe(0);
    expect(partida.pontos).toBe(0);
  });
});
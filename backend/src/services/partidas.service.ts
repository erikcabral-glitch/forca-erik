import { gerarMascara } from '../game/regras';
import { criarPartida } from '../repositories/partidas.repository';
import { sortearPalavra } from '../repositories/palavras.repository';
import type { EstadoPartida } from '../types';
import { buscarPartida } from '../repositories/partidas.repository';
import { ErroApp } from '../erros';
import { db } from '../database/db';
import { aplicarPalpite } from '../game/regras';
import { atualizarPartida } from '../repositories/partidas.repository';

export function iniciarPartida(jogador: string): EstadoPartida {
  const palavra = sortearPalavra();
  if (!palavra) throw new Error('Nenhuma palavra cadastrada. Rode o seed.');
  const id = criarPartida(jogador, palavra.id);
  return {
    id, jogador, categoria: palavra.categoria,
    mascara: gerarMascara(palavra.texto, []),
    letrasTentadas: [], vidasRestantes: 6,
    status: 'em_andamento', pontos: 0, palavra: null,
  };
}

export function consultarPartida(id: number): EstadoPartida {
  const partida = buscarPartida(id);

  if (!partida) {
    throw new ErroApp('Partida não encontrada.', 404);
  }

  const letrasTentadas = partida.letras_tentadas.split('');

  return {
    id: partida.id,
    jogador: partida.jogador,
    categoria: partida.categoria,
    mascara: gerarMascara(partida.palavra, letrasTentadas),
    letrasTentadas,
    vidasRestantes: 6 - partida.erros,
    status: partida.status,
    pontos: partida.pontos,
    palavra: partida.status === 'em_andamento'
      ? null
      : partida.palavra,
  };
}

export function registrarPalpite(
  id: number,
  letra: string,
): EstadoPartida {
  const executar = db.transaction(() => {
    const partida = buscarPartida(id);

    if (!partida) {
      throw new ErroApp('Partida não encontrada.', 404);
    }

    if (!/^[A-Za-z]$/.test(letra) || letra.length !== 1) {
      throw new ErroApp('Envie uma única letra de A a Z.', 400);
    }

    if (partida.status !== 'em_andamento') {
      throw new ErroApp('A partida já foi encerrada.', 409);
    }

    const letraMaiuscula = letra.toUpperCase();
    const letrasTentadas = partida.letras_tentadas.split('');

    if (letrasTentadas.includes(letraMaiuscula)) {
      throw new ErroApp('Essa letra já foi tentada.', 409);
    }

    const atualizada = aplicarPalpite(
      {
        palavra: partida.palavra,
        letrasTentadas,
        vidasRestantes: 6 - partida.erros,
        status: partida.status,
        pontos: partida.pontos,
      },
      letraMaiuscula,
    );

    atualizarPartida(id, atualizada);

    return consultarPartida(id);
  });

  return executar.immediate();
}
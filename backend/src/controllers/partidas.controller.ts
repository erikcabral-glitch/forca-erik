import type { Request, Response } from 'express';
import {
  novaPartidaSchema,
  palpiteSchema,
} from '../schemas/partida.schemas';
import {
  iniciarPartida,
  consultarPartida,
  registrarPalpite,
} from '../services/partidas.service';
import { ErroApp } from '../erros';

function obterId(req: Request): number {
  const parametro = req.params.id;
  const id = Number(parametro);

  if (
    typeof parametro !== 'string' ||
    !/^[1-9]\d*$/.test(parametro) ||
    !Number.isSafeInteger(id)
  ) {
    throw new ErroApp('Partida não encontrada.', 404);
  }

  return id;
}

export function criarPartidaController(
  req: Request,
  res: Response,
): void {
  const { jogador } = novaPartidaSchema.parse(req.body);
  res.status(201).json(iniciarPartida(jogador));
}

export function consultarPartidaController(
  req: Request,
  res: Response,
): void {
  res.json(consultarPartida(obterId(req)));
}

export function registrarPalpiteController(
  req: Request,
  res: Response,
): void {
  const id = obterId(req);
  const { letra } = palpiteSchema.parse(req.body);

  res.json(registrarPalpite(id, letra));
}
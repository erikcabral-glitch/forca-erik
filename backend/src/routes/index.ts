import { Router } from 'express';
import { z } from 'zod';
import {
  consultarPartidaController,
  registrarPalpiteController,
} from '../controllers/partidas.controller';
import { consultarRankingController } from '../controllers/ranking.controller';
import { novaPartidaSchema } from '../schemas/partida.schemas';
import {
  iniciarComDificuldade,
  solicitarDica,
} from '../services/bonus.service';
import { ErroApp } from '../erros';

export const rotas = Router();

const inicioComDificuldadeSchema = novaPartidaSchema.extend({
  dificuldade: z.enum(['facil', 'medio', 'dificil']).optional(),
});

rotas.post('/partidas', (req, res) => {
  const { jogador, dificuldade } = inicioComDificuldadeSchema.parse(req.body);

  res.status(201).json(iniciarComDificuldade(jogador, dificuldade));
});

rotas.get('/partidas/:id', consultarPartidaController);

rotas.post('/partidas/:id/palpites', registrarPalpiteController);

rotas.post('/partidas/:id/dica', (req, res) => {
  const parametro = req.params.id;
  const id = Number(parametro);

  if (
    typeof parametro !== 'string' ||
    !/^[1-9]\d*$/.test(parametro) ||
    !Number.isSafeInteger(id)
  ) {
    throw new ErroApp('Partida não encontrada.', 404);
  }

  res.json(solicitarDica(id));
});

rotas.get('/ranking', consultarRankingController);
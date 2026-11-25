import { Router } from 'express';
import {
  criarPartidaController,
  consultarPartidaController,
  registrarPalpiteController,
} from '../controllers/partidas.controller';
import { consultarRankingController } from '../controllers/ranking.controller';

export const rotas = Router();

rotas.post('/partidas', criarPartidaController);
rotas.get('/partidas/:id', consultarPartidaController);
rotas.post('/partidas/:id/palpites', registrarPalpiteController);
rotas.get('/ranking', consultarRankingController);
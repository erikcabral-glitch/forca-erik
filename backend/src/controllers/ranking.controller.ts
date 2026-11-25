import type { Request, Response } from 'express';
import { consultarRanking } from '../services/ranking.service';

export function consultarRankingController(
  _req: Request,
  res: Response,
): void {
  res.json(consultarRanking());
}
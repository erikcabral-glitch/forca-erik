import { buscarRanking } from '../repositories/ranking.repository';
import type { ItemRanking } from '../types';

export function consultarRanking(): ItemRanking[] {
  return buscarRanking();
}
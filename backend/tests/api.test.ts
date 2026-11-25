import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/database/db';

beforeEach(() => {
  db.prepare('DELETE FROM partidas').run();
  db.prepare('DELETE FROM palavras').run();

  db.prepare(
    'INSERT INTO palavras (texto, categoria) VALUES (?, ?)',
  ).run('JAVA', 'Linguagens');
});

async function criarPartida(): Promise<number> {
  const resposta = await request(app)
    .post('/api/partidas')
    .send({ jogador: 'Erik' });

  expect(resposta.status).toBe(201);

  const id: unknown = resposta.body.id;

  if (typeof id !== 'number') {
    throw new Error('A API não retornou um ID numérico.');
  }

  return id;
}

describe('API de partidas', () => {
  it('cria e consulta a partida sem revelar a palavra', async () => {
    const id = await criarPartida();

    const resposta = await request(app).get(`/api/partidas/${id}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toMatchObject({
      jogador: 'Erik',
      mascara: '____',
      vidasRestantes: 6,
      status: 'em_andamento',
      palavra: null,
    });
  });

  it('rejeita apelido curto com 400', async () => {
    const resposta = await request(app)
      .post('/api/partidas')
      .send({ jogador: 'E' });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toEqual(expect.any(String));
  });

  it('retorna 404 para uma partida inexistente', async () => {
    const resposta = await request(app).get('/api/partidas/999999');

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toEqual(expect.any(String));
  });

  it('rejeita palpite inválido com 400', async () => {
    const id = await criarPartida();

    const resposta = await request(app)
      .post(`/api/partidas/${id}/palpites`)
      .send({ letra: 'ab' });

    expect(resposta.status).toBe(400);
  });

  it('rejeita letra repetida com 409 e preserva as vidas', async () => {
    const id = await criarPartida();
    const rota = `/api/partidas/${id}/palpites`;

    const primeiro = await request(app)
      .post(rota)
      .send({ letra: 'z' });

    expect(primeiro.status).toBe(200);
    expect(primeiro.body.vidasRestantes).toBe(5);

    const repetido = await request(app)
      .post(rota)
      .send({ letra: 'Z' });

    expect(repetido.status).toBe(409);

    const consulta = await request(app).get(`/api/partidas/${id}`);

    expect(consulta.body.vidasRestantes).toBe(5);
    expect(consulta.body.letrasTentadas).toEqual(['Z']);
  });

  it('registra a vitória no ranking e rejeita novos palpites', async () => {
    const id = await criarPartida();
    const rota = `/api/partidas/${id}/palpites`;

    for (const letra of ['A', 'J', 'V']) {
      const resposta = await request(app).post(rota).send({ letra });
      expect(resposta.status).toBe(200);
    }

    const consulta = await request(app).get(`/api/partidas/${id}`);

    expect(consulta.body).toMatchObject({
      status: 'vitoria',
      palavra: 'JAVA',
      pontos: 75,
    });

    const ranking = await request(app).get('/api/ranking');

    expect(ranking.status).toBe(200);
    expect(ranking.body).toHaveLength(1);
    expect(ranking.body[0]).toMatchObject({
      jogador: 'Erik',
      palavra: 'JAVA',
      pontos: 75,
    });
    expect(Number.isNaN(Date.parse(ranking.body[0].finalizadaEm))).toBe(false);

    const encerrada = await request(app)
      .post(rota)
      .send({ letra: 'B' });

    expect(encerrada.status).toBe(409);
  });
});
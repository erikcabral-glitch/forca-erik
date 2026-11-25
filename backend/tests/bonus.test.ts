import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/database/db';

beforeEach(() => {
  db.prepare('DELETE FROM partidas').run();
  db.prepare('DELETE FROM palavras').run();

  const inserir = db.prepare(
    'INSERT INTO palavras (texto, categoria, dica) VALUES (?, ?, ?)',
  );

  inserir.run('JAVA', 'Linguagens', 'Linguagem que utiliza a JVM.');
  inserir.run('INTERNET', 'Computação', 'Rede mundial de computadores.');
  inserir.run('JAVASCRIPT', 'Linguagens', 'Linguagem usada em navegadores.');
});

async function criarPartida(dificuldade = 'facil'): Promise<number> {
  const resposta = await request(app)
    .post('/api/partidas')
    .send({ jogador: 'Erik', dificuldade });

  expect(resposta.status).toBe(201);

  const id: unknown = resposta.body.id;

  if (typeof id !== 'number') {
    throw new Error('A API não retornou um ID numérico.');
  }

  return id;
}

describe('Bônus', () => {
  it.each([
    ['facil', 4],
    ['medio', 8],
    ['dificil', 10],
  ])('sorteia o comprimento esperado para %s', async (dificuldade, tamanho) => {
    const id = await criarPartida(String(dificuldade));
    const resposta = await request(app).get(`/api/partidas/${id}`);

    expect(resposta.body.mascara).toHaveLength(Number(tamanho));
    expect(resposta.body.palavra).toBeNull();
    expect(resposta.body.vidasRestantes).toBe(6);
  });

  it('rejeita dificuldade inválida', async () => {
    const resposta = await request(app)
      .post('/api/partidas')
      .send({ jogador: 'Erik', dificuldade: 'inexistente' });

    expect(resposta.status).toBe(400);
  });

  it('cobra uma vida pela dica e rejeita uma segunda cobrança', async () => {
    const id = await criarPartida();
    const rota = `/api/partidas/${id}/dica`;

    const primeira = await request(app).post(rota).send({});

    expect(primeira.status).toBe(200);
    expect(primeira.body.dica).toBe('Linguagem que utiliza a JVM.');
    expect(primeira.body.partida.vidasRestantes).toBe(5);
    expect(primeira.body.partida.palavra).toBeNull();

    const repetida = await request(app).post(rota).send({});

    expect(repetida.status).toBe(409);

    const consulta = await request(app).get(`/api/partidas/${id}`);
    expect(consulta.body.vidasRestantes).toBe(5);
  });

  it('contabiliza o custo da dica na pontuação da vitória', async () => {
    const id = await criarPartida();

    await request(app).post(`/api/partidas/${id}/dica`).send({});

    for (const letra of ['A', 'J', 'V']) {
      const resposta = await request(app)
        .post(`/api/partidas/${id}/palpites`)
        .send({ letra });

      expect(resposta.status).toBe(200);
    }

    const consulta = await request(app).get(`/api/partidas/${id}`);

    expect(consulta.body.status).toBe('vitoria');
    expect(consulta.body.pontos).toBe(65);
    expect(consulta.body.vidasRestantes).toBe(5);
  });

  it('encerra a partida quando a dica consome a última vida', async () => {
    const id = await criarPartida();

    for (const letra of ['B', 'C', 'D', 'E', 'F']) {
      const resposta = await request(app)
        .post(`/api/partidas/${id}/palpites`)
        .send({ letra });

      expect(resposta.status).toBe(200);
    }

    const resposta = await request(app)
      .post(`/api/partidas/${id}/dica`)
      .send({});

    expect(resposta.status).toBe(200);
    expect(resposta.body.partida.status).toBe('derrota');
    expect(resposta.body.partida.vidasRestantes).toBe(0);
    expect(resposta.body.partida.pontos).toBe(0);
    expect(resposta.body.partida.palavra).toBe('JAVA');

    const encerrada = await request(app)
      .post(`/api/partidas/${id}/dica`)
      .send({});

    expect(encerrada.status).toBe(409);
  });
});
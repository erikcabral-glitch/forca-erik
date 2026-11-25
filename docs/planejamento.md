# Planejamento do Forca Dev

## Objetivo
Reaproveitar a interface React e transferir as regras e a palavra secreta para o servidor.

## Banco SQLite
| Tabela | Colunas e tipos |
|---|---|
| palavras | id INTEGER PK, texto TEXT UNIQUE NOT NULL, categoria TEXT NOT NULL |
| partidas | id INTEGER PK, jogador TEXT NOT NULL, palavra_id INTEGER FK NOT NULL, letras_tentadas TEXT, erros INTEGER, status TEXT, pontos INTEGER, criada_em TEXT, finalizada_em TEXT opcional |

O seed cadastra 20 palavras em três categorias.

## Contrato da API
| Método e rota | Entrada | Sucesso |
|---|---|---|
| POST /api/partidas | jogador | 201 EstadoPartida |
| GET /api/partidas/:id | id | 200 EstadoPartida |
| POST /api/partidas/:id/palpites | id e letra | 200 EstadoPartida |
| GET /api/ranking | nenhuma | 200 ItemRanking[] |

Ranking com as 10 vitórias de maior pontuação, com desempate por término mais antigo.
A palavra vem null durante a partida.

## Tipos
StatusPartida indica em_andamento, vitoria ou derrota.
EstadoPartida contém id, jogador, categoria, mascara, letrasTentadas, vidasRestantes,
status, pontos e palavra.
ItemRanking contém jogador, pontos, palavra e finalizadaEm.

## Ordem de implementação
1. Configurar TypeScript com strict.
2. Criar banco e seed.
3. Implementar funções puras.
4. Completar rotas, validação e testes.
5. Conectar React à API.
6. Finalizar documentação e interface.

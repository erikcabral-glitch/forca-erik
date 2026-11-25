# API do Forca Dev

## Endereço e formato

A API roda em http://localhost:3333/api.

As requisições com corpo usam JSON e o cabeçalho
Content-Type: application/json.

As respostas de erro possuem o formato:

```json
{
  "erro": "Mensagem do erro"
}
```

Os IDs, as palavras e as datas dos exemplos são ilustrativos.

## Criar uma partida

Método POST no caminho /api/partidas.

O apelido deve ter de 3 a 20 caracteres após a remoção
dos espaços das pontas.

O campo dificuldade é opcional.

### Corpo da requisição

```json
{
  "jogador": "Erik",
  "dificuldade": "facil"
}
```

### Dificuldades aceitas

| Valor | Comprimento |
|---|---|
| facil | Até 6 letras |
| medio | De 7 a 9 letras |
| dificil | 10 letras ou mais |

Quando dificuldade é omitida, o sorteio considera as palavras
cadastradas independentemente do comprimento.

### Resposta de sucesso

Status 201 Created.

```json
{
  "id": 1,
  "jogador": "Erik",
  "categoria": "Linguagens",
  "mascara": "____",
  "letrasTentadas": [],
  "vidasRestantes": 6,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

### Erros

| Status | Quando acontece |
|---|---|
| 400 | Apelido ausente, de tipo inválido ou fora do tamanho permitido |
| 400 | Dificuldade inválida |
| 400 | Corpo com JSON inválido |
| 503 | Nenhuma palavra disponível para o sorteio |
| 500 | Falha interna |

## Consultar uma partida

Método GET no caminho /api/partidas/:id.

O parâmetro id identifica a partida.

### Exemplo de requisição

```text
GET /api/partidas/1
```

### Resposta de sucesso

Status 200 OK.

```json
{
  "id": 1,
  "jogador": "Erik",
  "categoria": "Linguagens",
  "mascara": "_A_A",
  "letrasTentadas": ["A"],
  "vidasRestantes": 6,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

### Erros

| Status | Quando acontece |
|---|---|
| 404 | ID inválido ou inexistente |
| 500 | Falha interna |

## Enviar um palpite

Método POST no caminho /api/partidas/:id/palpites.

O corpo deve conter exatamente uma letra de A a Z.
Letras minúsculas são convertidas para maiúsculas.

### Corpo da requisição

```json
{
  "letra": "a"
}
```

### Resposta de sucesso

Status 200 OK.

```json
{
  "id": 1,
  "jogador": "Erik",
  "categoria": "Linguagens",
  "mascara": "_A_A",
  "letrasTentadas": ["A"],
  "vidasRestantes": 6,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

Um acerto revela todas as ocorrências da letra.
Uma letra errada consome uma vida.

### Exemplo de vitória

Ao acertar A, J e V na palavra JAVA, sem erros e sem dica:

```json
{
  "id": 1,
  "jogador": "Erik",
  "categoria": "Linguagens",
  "mascara": "JAVA",
  "letrasTentadas": ["A", "J", "V"],
  "vidasRestantes": 6,
  "status": "vitoria",
  "pontos": 75,
  "palavra": "JAVA"
}
```

A pontuação da vitória é:

vidas restantes × 10 + letras distintas da palavra × 5

A derrota ocorre quando as vidas chegam a zero.
Nesse caso, o status passa para derrota, os pontos são zero
e o campo palavra revela a resposta.

### Erros

| Status | Quando acontece |
|---|---|
| 400 | Letra ausente, de tipo inválido ou diferente de uma única letra de A a Z |
| 400 | Corpo com JSON inválido |
| 404 | ID inválido ou inexistente |
| 409 | Letra já tentada |
| 409 | Partida encerrada |
| 500 | Falha interna |

Uma tentativa rejeitada preserva o estado da partida.

## Solicitar dica

Método POST no caminho /api/partidas/:id/dica.

A interface envia um objeto JSON vazio.

### Corpo da requisição

```json
{}
```

### Resposta de sucesso

Status 200 OK.

```json
{
  "partida": {
    "id": 1,
    "jogador": "Erik",
    "categoria": "Linguagens",
    "mascara": "____",
    "letrasTentadas": [],
    "vidasRestantes": 5,
    "status": "em_andamento",
    "pontos": 0,
    "palavra": null
  },
  "dica": "Linguagem que utiliza uma máquina virtual chamada JVM."
}
```

Cada partida permite uma dica, com custo de uma vida.
A utilização é registrada no SQLite.

O custo reduz as vidas consideradas na pontuação final.
Se consumir a última vida, a partida termina em derrota,
com zero pontos e a palavra revelada.

### Erros

| Status | Quando acontece |
|---|---|
| 400 | Corpo com JSON inválido |
| 404 | ID inválido ou partida inexistente |
| 409 | Partida encerrada |
| 409 | Dica já utilizada |
| 409 | Palavra sem dica cadastrada |
| 500 | Falha interna |

Solicitações rejeitadas preservam as vidas e o estado da partida.

## Consultar ranking

Método GET no caminho /api/ranking.

Retorna até dez vitórias ordenadas pela maior pontuação.
No empate, a partida encerrada primeiro aparece à frente.
Se a pontuação e a data forem iguais, o menor ID fica primeiro.

### Resposta de sucesso

Status 200 OK.

```json
[
  {
    "jogador": "Erik",
    "pontos": 75,
    "palavra": "JAVA",
    "finalizadaEm": "2026-11-18T19:00:00.000Z"
  }
]
```

A data usa o formato ISO 8601 em UTC.

Quando não há vitórias:

```json
[]
```

### Erros

| Status | Quando acontece |
|---|---|
| 500 | Falha interna |

## Palavra secreta

Enquanto o status for em_andamento, o campo palavra é null.
A interface usa mascara para mostrar o progresso.

A palavra completa é enviada quando a partida termina,
com status vitoria ou derrota.
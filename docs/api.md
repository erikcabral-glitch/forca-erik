# API do Forca Dev

## Endereço e formato

A API roda em http://localhost:3333/api.

As requisições com corpo usam JSON e o cabeçalho
Content-Type: application/json.

As respostas de erro têm o formato:

```json
{
  "erro": "Mensagem do erro"
}
```

## Criar uma partida

Método POST no caminho `/api/partidas`.

O apelido deve ter de 3 a 20 caracteres após a remoção dos
espaços das pontas.

### Corpo da requisição

```json
{
  "jogador": "Erik"
}
```

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
| 400 | Apelido ausente, com tipo inválido ou fora do tamanho permitido |
| 400 | Corpo com JSON inválido |
| 500 | Falha interna ou banco sem palavras cadastradas |

## Consultar uma partida

Método GET no caminho `/api/partidas/:id`.

O parâmetro `id` identifica a partida.

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
| 404 | ID inexistente ou inválido |
| 500 | Falha interna ao consultar a partida |

## Enviar um palpite

Método POST no caminho `/api/partidas/:id/palpites`.

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
A partida começa com 6 vidas.

### Exemplo de vitória

Após acertar A, J e V na palavra JAVA, sem erros:

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

Na vitória, os pontos são calculados por:

vidas restantes × 10 + letras distintas da palavra × 5

Na derrota, os pontos são zero. Ao chegar a zero vidas,
o status passa para `derrota` e o campo `palavra` revela a resposta.

### Erros

| Status | Quando acontece |
|---|---|
| 400 | Letra ausente, com tipo inválido ou diferente de uma única letra de A a Z |
| 400 | Corpo com JSON inválido |
| 404 | ID inexistente ou inválido |
| 409 | Letra já tentada |
| 409 | Partida já encerrada |
| 500 | Falha interna ao processar o palpite |

Uma tentativa rejeitada preserva o estado da partida.

## Consultar o ranking

Método GET no caminho `/api/ranking`.

Retorna até 10 vitórias, ordenadas pela maior pontuação.
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

Se não houver vitórias, a resposta é:

```json
[]
```

### Erros

| Status | Quando acontece |
|---|---|
| 500 | Falha interna ao consultar o ranking |

## Palavra secreta

Enquanto o status for `em_andamento`, o campo `palavra`
é `null`. A interface recebe a máscara para mostrar o progresso.

A palavra completa é enviada quando a partida termina,
com status `vitoria` ou `derrota`.

Os IDs, as palavras sorteadas e as datas apresentados neste
documento são exemplos.
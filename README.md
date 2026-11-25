# Forca Dev

Jogo da forca com palavras de tecnologia, desenvolvido por Erik Cabral.

O jogador informa um apelido, escolhe uma dificuldade e tenta descobrir
a palavra. As regras são processadas no servidor, e os resultados
das vitórias podem entrar no ranking.

## Tecnologias

- React e TypeScript na interface
- Vite para desenvolvimento e compilação da interface
- Node.js, Express e TypeScript na API
- SQLite com better-sqlite3 para persistência
- Zod para validação
- Vitest e Supertest para testes automatizados

## Pré-requisitos

- Node.js 24 LTS com npm
- Git para clonar o repositório

## Instalação

Clone o repositório e entre na pasta do projeto:

```powershell
git clone https://github.com/erikcabral-glitch/forca-erik.git
cd forca-erik
```

Instale as dependências da interface:

```powershell
npm.cmd ci
```

Prepare o back-end e cadastre as palavras:

```powershell
cd backend
npm.cmd ci
npm.cmd run seed
```

O seed cria o banco backend/forca.db e cadastra 20 palavras
com dicas em três categorias.

O comando pode ser executado novamente sem duplicar palavras.
As categorias e dicas das palavras existentes são atualizadas.

## Executar o projeto

No terminal da pasta backend, inicie a API:

```powershell
npm.cmd run dev
```

A API fica disponível em http://localhost:3333.

Abra outro terminal na raiz forca-erik e inicie a interface:

```powershell
npm.cmd run dev
```

Abra o endereço mostrado pelo Vite, normalmente http://localhost:5173.

Mantenha os dois terminais executando durante o jogo.
Os comandos npm.cmd são apropriados para PowerShell no Windows.
Em outros sistemas, use npm.

## Como jogar

1. Informe um apelido de 3 a 20 caracteres.
2. Escolha uma dificuldade.
3. Clique em Jogar.
4. Escolha letras pelo teclado virtual ou pelo teclado do computador.
5. Descubra a palavra antes que as vidas acabem.
6. Ao terminar, confira a palavra, os pontos e o ranking.

Cada partida começa com 6 vidas.
Cada letra errada consome uma vida.
Um acerto revela todas as ocorrências da letra.

Uma letra repetida é rejeitada sem consumir vida.
Partidas encerradas rejeitam novos palpites.

## Dificuldades

| Nível | Comprimento da palavra |
|---|---|
| Fácil | Até 6 letras |
| Médio | De 7 a 9 letras |
| Difícil | 10 letras ou mais |

O filtro de dificuldade é aplicado no servidor.
Todos os níveis começam com 6 vidas.

## Dica paga

O botão Pedir dica solicita uma dica da palavra pela API
e consome uma vida.

Cada partida permite uma dica. Sua utilização fica registrada
no SQLite. Uma segunda solicitação é rejeitada sem nova cobrança.

Se o pedido consumir a última vida, a partida termina em derrota.

## Pontuação e ranking

Na vitória, a pontuação é calculada por:

vidas restantes × 10 + letras distintas da palavra × 5

A vida consumida pela dica reduz as vidas usadas nesse cálculo.
Na derrota, a pontuação é zero.

O ranking mostra as dez vitórias com mais pontos.
Em caso de empate, quem terminou primeiro aparece à frente.

## Palavra secreta

O servidor sorteia a palavra no SQLite e processa os palpites.

Durante a partida, a API envia a máscara e mantém o campo palavra
como null. A palavra completa é enviada quando a partida termina.

A pontuação e o resultado registrados no banco são calculados
pelo servidor.

## Bônus implementados

- Teclado físico para enviar palpites
- Desenho da forca em SVG que evolui com as vidas consumidas
- Dica paga pela API, com custo de uma vida
- Seleção de dificuldade aplicada ao sorteio no servidor

As imagens originais da forca aparecem durante a partida.
O desenho SVG pode ser aberto no painel abaixo da imagem.

## Rotas da API

| Método | Caminho | Finalidade |
|---|---|---|
| POST | /api/partidas | Criar partida |
| GET | /api/partidas/:id | Consultar partida |
| POST | /api/partidas/:id/palpites | Enviar palpite |
| POST | /api/partidas/:id/dica | Solicitar dica paga |
| GET | /api/ranking | Consultar ranking |

## Testes e checagem de tipos

No terminal da pasta backend:

```powershell
npm.cmd run typecheck
npm.cmd test
```

Foram implementados 19 testes automatizados, incluindo testes
das regras, das rotas e dos bônus.

Os testes da API usam SQLite em memória, configurado no
backend/vitest.config.ts.

Para conferir a tipagem e compilar a interface, execute na raiz:

```powershell
npm.cmd run build
```

## Documentação

- docs/planejamento.md — banco, tipos e ordem de implementação
- docs/api.md — contrato das rotas, exemplos e erros
- docs/decisoes.md — decisões técnicas
- docs/diario-de-bordo.md — atividades e consultas durante o desenvolvimento

## Tela do jogo

![Partida do Forca Dev](docs/imagens/jogo.png)
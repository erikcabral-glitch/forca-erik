# Decisões técnicas do Forca Dev

## Decisão 1 — Palavra secreta no servidor

### Contexto

O jogador pode inspecionar os arquivos e as respostas recebidas pelo
navegador usando o F12. O jogo precisa proteger a palavra durante a partida.

### Decisão

O servidor sorteia a palavra no SQLite e processa cada palpite.
Durante a partida, a API envia a máscara e mantém o campo palavra
como null. A palavra é revelada quando a partida termina.

### Alternativa descartada

Enviar a palavra ao React e ocultá-la apenas na apresentação da tela.

### Consequência

Cada palpite depende de uma requisição à API. A interface precisa
mostrar carregamento e tratar falhas de comunicação.


## Decisão 2 — Persistência com SQLite

### Contexto

O projeto precisa armazenar palavras, partidas e resultados, seguindo
o banco solicitado no enunciado.

### Decisão

Usar SQLite com better-sqlite3 e consultas parametrizadas.
O script de seed cadastra 20 palavras em três categorias.

### Alternativa descartada

Manter as partidas e o ranking apenas no armazenamento local do navegador.

### Consequência

Os dados ficam centralizados no servidor e permanecem disponíveis
após reiniciá-lo, desde que o arquivo do banco seja preservado.
A instalação exige uma versão de Node.js compatível com better-sqlite3.


## Decisão 3 — Regras como funções puras

### Contexto

As regras de máscara, pontuação e palpite precisam ser verificadas
independentemente das rotas HTTP e do banco de dados.

### Decisão

Concentrar essas regras em src/game/regras.ts.
A função aplicarPalpite devolve um novo estado sem alterar a partida recebida.

### Alternativa descartada

Implementar todas as regras diretamente nos controllers do Express.

### Consequência

As regras podem ser testadas isoladamente com Vitest.
Os services ficam responsáveis por coordenar as regras e a persistência.


## Decisão 4 — Transação na atualização dos palpites

### Contexto

O processamento de um palpite envolve consultar a partida,
validar seu estado e gravar o resultado.

### Decisão

Executar essas operações em uma transação imediata do SQLite,
mantendo a leitura e a atualização juntas.

### Alternativa descartada

Executar a consulta e a atualização separadamente, sem transação.

### Consequência

Uma falha desfaz as alterações da operação. As escritas concorrentes
são coordenadas pelo SQLite para preservar o progresso da partida.
As transações devem permanecer curtas.


## Decisão 5 — Banco em memória nos testes

### Contexto

Os testes precisam cadastrar e remover dados sem modificar
as partidas usadas durante o desenvolvimento.

### Decisão

Configurar DB_PATH como :memory: no Vitest e preparar os dados
necessários antes de cada teste da API.

### Alternativa descartada

Executar os testes usando o arquivo forca.db do desenvolvimento.

### Consequência

Os testes têm dados controlados e independentes das partidas reais.
Os dados de teste são temporários e precisam ser preparados a cada execução.
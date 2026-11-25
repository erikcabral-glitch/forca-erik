# Decisões técnicas do Forca Dev

## Decisão 1 — Palavra secreta no servidor

### Contexto

O jogador pode inspecionar os arquivos e as respostas do navegador
usando o F12.

### Decisão

Sortear a palavra no servidor e enviar apenas a máscara durante
a partida. O campo palavra permanece null até o encerramento.

### Alternativa descartada

Enviar a palavra ao React e ocultá-la apenas na tela.

### Consequência

Cada palpite depende da API. A interface precisa mostrar
carregamento e tratar falhas de comunicação.


## Decisão 2 — Persistência com SQLite

### Contexto

O projeto precisa armazenar palavras, partidas e resultados.

### Decisão

Usar SQLite com better-sqlite3, consultas parametrizadas e um seed
com 20 palavras em três categorias.

### Alternativa descartada

Guardar o ranking e as partidas somente no navegador.

### Consequência

Os dados ficam centralizados no servidor e permanecem disponíveis
após reiniciá-lo, desde que o arquivo do banco seja preservado.


## Decisão 3 — Regras em funções puras

### Contexto

As regras precisam ser verificadas independentemente do banco
e das rotas HTTP.

### Decisão

Implementar gerarMascara, calcularPontos e aplicarPalpite em
src/game/regras.ts. AplicarPalpite devolve um novo estado.

### Alternativa descartada

Concentrar as regras nos controllers do Express.

### Consequência

As regras podem ser testadas isoladamente. Os services coordenam
essas regras com a leitura e a gravação no banco.


## Decisão 4 — Transação nos palpites

### Contexto

Um palpite exige consultar a partida, validar seu estado
e gravar o resultado.

### Decisão

Executar essas operações em uma transação imediata do SQLite.

### Alternativa descartada

Fazer a consulta e a atualização separadamente.

### Consequência

Uma falha desfaz as alterações da operação. As escritas concorrentes
são coordenadas para preservar o progresso da partida.


## Decisão 5 — Banco em memória nos testes

### Contexto

Os testes precisam preparar e remover dados sem modificar
as partidas reais.

### Decisão

Configurar DB_PATH como :memory: no Vitest e preparar os dados
antes de cada teste da API.

### Alternativa descartada

Executar os testes no arquivo forca.db do desenvolvimento.

### Consequência

Os testes usam dados controlados e temporários.


## Decisão 6 — Dificuldade e dica no servidor

### Contexto

A dificuldade influencia o sorteio. A dica precisa consumir
uma vida e controlar sua utilização.

### Decisão

Filtrar o comprimento da palavra no SQLite e registrar
a utilização da dica na tabela partidas.

Processar o pedido de dica em uma transação imediata.

### Alternativa descartada

Controlar a dificuldade e o custo da dica apenas no React.

### Consequência

O servidor valida os bônus. A dica reduz as vidas usadas
no cálculo dos pontos e pode causar derrota ao consumir
a última vida.

Foi adotado o limite de uma dica por partida.


## Decisão 7 — Evolução do banco existente

### Contexto

O banco já possuía palavras e partidas antes dos bônus.

### Decisão

Verificar as colunas existentes com PRAGMA table_info e adicionar
dica e dica_usada quando necessário.

Atualizar o seed com INSERT e ON CONFLICT para preencher as dicas.

### Alternativa descartada

Apagar o banco e recriar todas as tabelas para acrescentar os bônus.

### Consequência

As partidas existentes são preservadas. O seed pode ser executado
novamente para atualizar as dicas das palavras cadastradas.


## Decisão 8 — Imagens originais e SVG

### Contexto

O jogo já tinha imagens próprias para os estágios da forca.
O enunciado oferece bônus pelo desenho progressivo em SVG.

### Decisão

Manter as imagens originais como destaque e disponibilizar o SVG
em um painel expansível abaixo delas.

### Alternativa descartada

Substituir completamente as imagens pelo SVG.

### Consequência

O jogo preserva sua identidade visual e permite acompanhar
a evolução do desenho SVG. Ambos avançam conforme as vidas
são consumidas, inclusive pelo pedido de dica.


## Decisão 9 — Teclado físico

### Contexto

O jogador pode escolher letras pelo teclado virtual ou físico.

### Decisão

Aceitar letras de A a Z e ignorar repetição de tecla, atalhos
e digitação em campos de formulário.

Bloquear novos envios enquanto uma requisição está em andamento.

### Alternativa descartada

Enviar um palpite para cada evento de teclado sem esses controles.

### Consequência

Os dois teclados usam o mesmo fluxo de requisições.
A API continua responsável pela validação dos palpites.
# Diário de bordo do Forca Dev

## Aula 1 — Fundação do back-end

### O que fiz

Configurei o back-end com TypeScript em modo estrito e criei
as tabelas palavras e partidas no SQLite.

Executei o seed e confirmei o cadastro de 20 palavras
em três categorias.

Implementei as funções gerarMascara, calcularPontos
e aplicarPalpite.

Nos testes manuais, JAVA com 4 vidas resultou em 55 pontos.
O palpite A revelou _A_A sem consumir vida.

A sequência A, Z, J e V terminou em vitória com 65 pontos.
Executei a checagem de tipos sem erros.

### Dificuldades e soluções

Tentei executar tsx usando npm.cmd tsx e recebi um erro.
Passei a usar npx.cmd tsx para executar os arquivos TypeScript.

Também precisei conferir a diferença entre as pastas
do React e do back-end antes de executar os comandos.

### Consultas e apoio

Consultei o enunciado e utilizei o ChatGPT para orientações,
explicações sobre os comandos e correção dos problemas
de instalação e execução.

Também utilizei trechos de código gerados durante a conversa
como apoio à implementação.

### Encaminhamento

Continuei com as rotas da API, a validação e os testes.
O registro no Git foi adiado.


## Aula 2 — API, testes e integração

### O que fiz

Implementei as rotas para criar e consultar partidas,
enviar palpites e consultar o ranking.

Configurei a validação com Zod e o tratamento centralizado
dos erros.

Testei a rejeição de apelido inválido, letra repetida,
palpite inválido e palpite em partida encerrada.

Implementei a atualização dos palpites em uma transação
no SQLite.

O servidor passou a controlar a máscara, as vidas,
o resultado e a pontuação. A palavra permaneceu null
nas respostas durante a partida.

Executei 12 testes automatizados com Vitest e Supertest.
Todos passaram.

Configurei o proxy do Vite e conectei o React à API.
Testei uma partida completa pela interface e confirmei
o reinício com 6 vidas.

### Dificuldades e soluções

No novo computador, faltavam as dependências do back-end.
Executei npm ci dentro da pasta backend.

Alguns comandos foram executados na raiz por engano.
Passei a conferir o caminho exibido no terminal.

Também tentei consultar a API depois de interromper o servidor.
Organizei terminais separados para a API, o React e os testes.

O PowerShell não reconheceu a opção -AsArray.
Usei Invoke-WebRequest para consultar o JSON do ranking.

### Consultas e apoio

Consultei o enunciado e utilizei o ChatGPT para orientações,
explicações sobre os comandos e correção dos problemas
de instalação e execução.

Também utilizei trechos de código e testes gerados durante
a conversa para desenvolver e verificar a integração.

### Encaminhamento

Continuei com a revisão da interface, a documentação
e a preparação da entrega.


## Aula 3 — Revisão, documentação e bônus

### O que fiz

Preparei o projeto em outro computador, instalando o Node.js
e as dependências do React e do back-end.

Executei o seed, a checagem de tipos e os testes.
Confirmei o funcionamento do jogo com os dois servidores ativos.

Conferi pelo navegador que o campo palavra permanece null
enquanto a partida está em andamento.

Interrompi a API para testar a mensagem de indisponibilidade.
A interface mostrou “Servidor fora do ar. Tente novamente.”.
Após reiniciar a API, consegui iniciar uma partida sem
atualizar a página.

Melhorei a apresentação do ranking e completei o README,
a documentação da API e as decisões técnicas.

Incluí um print do jogo no README e publiquei a primeira
versão final no GitHub, com a tag checkpoint-3.

### Bônus implementados

Implementei o teclado físico, o desenho progressivo em SVG,
a dica paga pela API e os níveis de dificuldade.

A dificuldade passou a filtrar o comprimento da palavra
no servidor.

Acrescentei as colunas dica e dica_usada ao banco,
preservando os registros existentes.

A dica passou a custar uma vida, com limite de uma utilização
por partida e controle no servidor.

Acrescentei sete testes dos bônus. Os 19 testes passaram,
a checagem de tipos terminou sem erros e a interface compilou.

Testei os bônus pelo navegador. Depois revisei o visual,
restaurei as imagens originais como destaque e coloquei
o SVG em um painel expansível.

A seleção de dificuldade passou a usar três botões coloridos.

### Dificuldades e soluções

O comando node não era reconhecido inicialmente.
Instalei o Node.js e reabri o terminal.

Os comandos seed e typecheck foram executados na raiz
por engano. Entrei na pasta backend para executá-los.

Os comandos tsx e vite não foram encontrados antes da instalação
das dependências. Executei npm ci nas respectivas pastas.

A primeira apresentação dos bônus substituiu as imagens
originais e usou uma seleção de dificuldade que precisava
de ajustes visuais. Revisei a interface para recuperar
as imagens e melhorar os botões.

### Consultas e apoio

Consultei o enunciado e utilizei o ChatGPT para orientações,
explicações sobre os comandos e correção dos problemas
de instalação e execução.

Também utilizei código, testes e textos de documentação
gerados durante a conversa, revisando o funcionamento
com os testes e a execução local.


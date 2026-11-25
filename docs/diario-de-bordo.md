# Diário de bordo

## Aula 1 — Fundação do back-end

Configurei TypeScript com strict, SQLite e tabelas palavras e partidas.
Cadastrei 20 palavras em três categorias e testei máscara, pontuação e palpite.
JAVA com 4 vidas resultou em 55 pontos. A sequência A, Z, J, V
resultou em vitoria com 65 pontos. A checagem de tipos terminou sem erros.

Tive dificuldade com npm.cmd tsx e passei a usar npx.cmd tsx.
Consultei o enunciado e usei ChatGPT para explicações, geração de código e
correção dos comandos. A rota inicial foi adiantada para a Parte 2.

Próximos passos são completar API, tratamento de erros, testes e integração com React.
Commit e tag checkpoint-1 estão pendentes por decisão de adiar o Git.

## Aula 2 — API, testes e integração

### O que fiz

Concluí as quatro rotas da API para criar e consultar partidas,
receber palpites e consultar o ranking.

Configurei a validação com Zod e o tratamento central de erros.
Testei a rejeição de apelido inválido e letra repetida.

Executei 12 testes automatizados com Vitest e Supertest.
Todos passaram.

Conectei o React à API pelo proxy do Vite. Testei uma partida
completa pela interface e confirmei que uma nova partida começa
com 6 vidas.

### Dificuldades e soluções

No novo computador, faltavam as dependências do back-end.
Resolvi executando npm ci dentro da pasta backend.

Também tentei testar a API depois de interromper o servidor.
Passei a manter terminais separados para React, API e testes.

### Consultas e apoio

Consultei o enunciado e utilizei o ChatGPT para explicações e correção de erros.

### O que falta

Revisar a interface, completar a documentação e preparar a
entrega e a defesa oral na Parte 3.

O commit e a tag checkpoint-2 continuam pendentes.

## Aula 3 — Revisão e documentação

### O que fiz até agora

Preparei o projeto em um novo computador, instalando o Node.js
e as dependências da interface e do back-end.

Executei o seed, a checagem de tipos e os testes. Iniciei os dois
servidores e confirmei o funcionamento do jogo.

Conferi pelo navegador que as respostas da API mantêm a palavra
secreta como null enquanto a partida está em andamento.

Testei a indisponibilidade da API. A interface mostrou a mensagem
“Servidor fora do ar. Tente novamente.” Após reiniciar o servidor,
consegui iniciar uma partida sem atualizar a página.

Acrescentei estilos para melhorar a apresentação da tabela do ranking
e atualizei o README com tecnologias, instalação, execução, regras,
pontuação, rotas e comandos de verificação.

### Dificuldades e soluções

Inicialmente, o comando node não era reconhecido no computador.
Após instalar o Node.js e reabrir o terminal, o comando funcionou.

Os comandos seed e typecheck foram executados na raiz por engano.
Entrei na pasta backend para usar os scripts correspondentes.

O comando tsx também não foi encontrado antes da instalação das
dependências do back-end. Executei npm ci nessa pasta e continuei
a configuração.

### Consultas e apoio

Consultei o enunciado e utilizei o ChatGPT para orientações, explicações sobre os comandos
e correção dos problemas de instalação e execução.

### Verificação final

Concluí a documentação das quatro rotas em docs/api.md e registrei
cinco decisões técnicas em docs/decisoes.md.

Na verificação final, os 12 testes automatizados passaram.
A checagem de tipos do back-end e a compilação da interface
terminaram sem erros.

Também confirmei que o jogo mostra uma mensagem quando a API
está indisponível e volta a iniciar partidas após o servidor reiniciar.

A entrega no repositório Git e a preparação da defesa oral
continuam pendentes.

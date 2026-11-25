import { db } from './db';

const palavras: [string, string, string][] = [
  ['PYTHON', 'Linguagens', 'Linguagem conhecida por sua sintaxe simples e uso em dados.'],
  ['JAVA', 'Linguagens', 'Linguagem que utiliza uma máquina virtual chamada JVM.'],
  ['JAVASCRIPT', 'Linguagens', 'Linguagem executada pelos navegadores para dar interatividade às páginas.'],
  ['TYPESCRIPT', 'Linguagens', 'Acrescenta tipagem estática ao JavaScript.'],
  ['MOUSE', 'Computação', 'Dispositivo usado para mover o cursor e clicar.'],
  ['TECLADO', 'Computação', 'Dispositivo usado para digitar.'],
  ['INTERNET', 'Computação', 'Rede mundial que conecta computadores.'],
  ['HACKER', 'Computação', 'Pessoa com conhecimentos avançados sobre sistemas e suas vulnerabilidades.'],
  ['COMPUTADOR', 'Computação', 'Equipamento que executa programas e processa dados.'],
  ['HARDWARE', 'Computação', 'Conjunto das peças físicas de um computador.'],
  ['NOTEBOOK', 'Computação', 'Computador portátil com tela e teclado integrados.'],
  ['TECNOLOGIA', 'Computação', 'Aplicação de conhecimentos e ferramentas para criar soluções.'],
  ['CIBERSEGURANCA', 'Computação', 'Área que protege sistemas, redes e dados contra ataques.'],
  ['SOFTWARE', 'Programação', 'Conjunto de programas e instruções de um sistema.'],
  ['PROGRAMACAO', 'Programação', 'Atividade de escrever instruções para um computador.'],
  ['INTELIGENCIAARTIFICIAL', 'Programação', 'Área que desenvolve sistemas capazes de executar tarefas associadas à inteligência humana.'],
  ['DESENVOLVIMENTO', 'Programação', 'Processo de criar e evoluir aplicações.'],
  ['CRIPTOGRAFIA', 'Programação', 'Técnica usada para proteger informações por meio de codificação.'],
  ['ALGORITMO', 'Programação', 'Sequência de passos para resolver um problema.'],
  ['PROGRAMADOR', 'Programação', 'Profissional que escreve e mantém código.'],
];

const inserir = db.prepare(`
  INSERT INTO palavras (texto, categoria, dica)
  VALUES (?, ?, ?)
  ON CONFLICT(texto) DO UPDATE SET
    categoria = excluded.categoria,
    dica = excluded.dica
`);

const cadastrar = db.transaction(() => {
  for (const [texto, categoria, dica] of palavras) {
    inserir.run(texto, categoria, dica);
  }
});

cadastrar();

console.log('Seed concluído: palavras e dicas atualizadas.');
db.close();
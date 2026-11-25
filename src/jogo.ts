import { DICAS, NIVEIS } from "./palavras";

export type Nivel = keyof typeof NIVEIS;
type Palavra = keyof typeof DICAS;
type Feedback = { texto: string; cor: "verde" | "vermelho" | "ouro" };

export type Partida = {
  nivel: Nivel;
  palavra: Palavra;
  vidas: number;
  erros: number;
  pontos: number;
  dicas: number;
  tentadas: string[];
  reveladas: string[];
  feedback?: Feedback;
};

function sortear<T>(opcoes: readonly T[]): T {
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function iniciar(nivel: Nivel): Partida {
  const [vidas, palavras] = NIVEIS[nivel];
  return {
    nivel, palavra: sortear<Palavra>(palavras), vidas,
    erros: 0, pontos: 0, dicas: 0, tentadas: [], reveladas: [],
  };
}

export function venceu(partida: Partida): boolean {
  return [...partida.palavra].every((letra) => partida.reveladas.includes(letra));
}

export function terminou(partida: Partida): boolean {
  return partida.vidas === 0 || venceu(partida);
}

export function mascara(partida: Partida): string {
  return [...partida.palavra]
    .map((letra) => partida.reveladas.includes(letra) ? letra.toUpperCase() : "_")
    .join(" ");
}

export function tentar(partida: Partida, entrada: string): Partida {
  if (terminou(partida)) return partida;
  const letra = entrada.trim().toLowerCase();
  if (!/^\p{L}$/u.test(letra)) {
    return { ...partida, feedback: { texto: "Digite apenas uma letra!", cor: "ouro" } };
  }
  if (partida.tentadas.includes(letra) || partida.reveladas.includes(letra)) {
    return { ...partida, feedback: { texto: "Você já usou essa letra!", cor: "ouro" } };
  }
  const tentadas = [...partida.tentadas, letra];
  if (partida.palavra.includes(letra)) {
    return {
      ...partida, tentadas, reveladas: [...partida.reveladas, letra],
      pontos: partida.pontos + 10,
      feedback: { texto: "Você acertou! +10 pontos 😊", cor: "verde" },
    };
  }
  return {
    ...partida, tentadas, vidas: partida.vidas - 1, erros: partida.erros + 1,
    pontos: partida.pontos - 5,
    feedback: { texto: "Você errou! -5 pontos ❌", cor: "vermelho" },
  };
}

export function pedirDica(partida: Partida): Partida {
  if (terminou(partida) || partida.dicas >= 2) return partida;
  if (partida.dicas === 0) {
    return {
      ...partida, dicas: 1,
      feedback: { texto: `💡 Dica: ${DICAS[partida.palavra]}`, cor: "ouro" },
    };
  }
  const disponiveis = [...new Set(partida.palavra)]
    .filter((letra) => !partida.reveladas.includes(letra));
  const letra = sortear(disponiveis);
  return {
    ...partida, dicas: 2, pontos: partida.pontos - 20,
    reveladas: [...partida.reveladas, letra],
    feedback: { texto: `🔤 Dica de letra: a letra revelada foi '${letra.toUpperCase()}'! -20 pontos`, cor: "ouro" },
  };
}

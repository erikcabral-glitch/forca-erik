export type Registro = { nome: string; pontuacao: number };

const CHAVE = "forca-ranking";

function registroValido(valor: unknown): valor is Registro {
  return typeof valor === "object" && valor !== null
    && "nome" in valor && typeof valor.nome === "string"
    && "pontuacao" in valor && Number.isInteger(valor.pontuacao);
}

export function lerRanking(): Registro[] {
  try {
    const dados: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(dados) ? dados.filter(registroValido).slice(0, 10) : [];
  } catch {
    return [];
  }
}

export function salvarRanking(registro: Registro): void {
  const ranking = [...lerRanking(), registro]
    .sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 10);
  localStorage.setItem(CHAVE, JSON.stringify(ranking));
}

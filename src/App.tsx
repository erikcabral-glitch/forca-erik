import { useEffect, useRef, useState } from 'react';
import { api } from './api/cliente';
import type { EstadoPartida, ItemRanking } from './types';

function mensagemErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.';
}

function Mascara({ valor }: { valor: string }) {
  return <p className="mascara">{valor.split('').join(' ')}</p>;
}

function Vidas({ quantidade }: { quantidade: number }) {
  return <p>Tentativas restantes: {quantidade}</p>;
}

function Teclado({
  partida,
  bloqueado,
  onLetra,
}: {
  partida: EstadoPartida;
  bloqueado: boolean;
  onLetra: (letra: string) => void;
}) {
  return (
    <div className="acoes" aria-label="Teclado de letras">
      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letra) => {
        const tentada = partida.letrasTentadas.includes(letra);
        const acertou = partida.mascara.includes(letra);

        return (
          <button
            key={letra}
            disabled={bloqueado || tentada}
            className={tentada ? (acertou ? 'primario' : 'dificil') : ''}
            onClick={() => onLetra(letra)}
          >
            {letra}
          </button>
        );
      })}
    </div>
  );
}

function Ranking({ atualizar }: { atualizar: number }) {
  const [itens, setItens] = useState<ItemRanking[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro('');

    api.ranking()
      .then((dados) => {
        if (ativo) setItens(dados);
      })
      .catch((falha: unknown) => {
        if (ativo) setErro(mensagemErro(falha));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [atualizar]);

  return (
    <section>
      <h2>🏆 Melhores jogadores</h2>

      {carregando && <p role="status">Carregando ranking...</p>}
      {erro && <p className="vermelho" role="alert">{erro}</p>}

      {!carregando && !erro && (
        itens.length === 0 ? (
          <p>Nenhuma vitória registrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, indice) => (
                <tr key={`${indice}-${item.finalizadaEm}`}>
                  <td>{indice + 1}º</td>
                  <td>{item.jogador}</td>
                  <td>{item.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </section>
  );
}

export function App() {
  const [nome, setNome] = useState('');
  const [partida, setPartida] = useState<EstadoPartida | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [versaoRanking, setVersaoRanking] = useState(0);
  const emRequisicao = useRef(false);

  const apelido = nome.trim();
  const nomeValido = apelido.length >= 3 && apelido.length <= 20;
  const encerrada = partida !== null && partida.status !== 'em_andamento';

  async function jogar() {
    if (!nomeValido || emRequisicao.current) return;

    emRequisicao.current = true;
    setCarregando(true);
    setErro('');

    try {
      setPartida(await api.novaPartida(apelido));
    } catch (falha: unknown) {
      setErro(mensagemErro(falha));
    } finally {
      emRequisicao.current = false;
      setCarregando(false);
    }
  }

  async function palpitar(letra: string) {
    if (
      !partida ||
      partida.status !== 'em_andamento' ||
      emRequisicao.current
    ) {
      return;
    }

    emRequisicao.current = true;
    setCarregando(true);
    setErro('');

    try {
      const atualizada = await api.palpitar(partida.id, letra);
      setPartida(atualizada);

      if (atualizada.status !== 'em_andamento') {
        setVersaoRanking((valor) => valor + 1);
      }
    } catch (falha: unknown) {
      setErro(mensagemErro(falha));
    } finally {
      emRequisicao.current = false;
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1>🎮 JOGO DA FORCA</h1>

      {erro && <p className="vermelho" role="alert">{erro}</p>}
      {carregando && <p role="status">Aguarde...</p>}

      {!partida && (
        <section className="pilha">
          <p>Descubra a palavra antes que seja tarde!</p>

          <form
            className="pilha"
            onSubmit={(evento) => {
              evento.preventDefault();
              void jogar();
            }}
          >
            <label htmlFor="apelido">Seu apelido</label>
            <input
              id="apelido"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              minLength={3}
              maxLength={20}
              required
              disabled={carregando}
            />
            <p>Use de 3 a 20 caracteres.</p>

            <button
              className="primario"
              disabled={!nomeValido || carregando}
            >
              ▶ JOGAR
            </button>
          </form>
        </section>
      )}

      {partida && (
        <section className="partida">
          <p>👤 Jogador: {partida.jogador}</p>
          <p>Categoria: {partida.categoria}</p>

          <img
            className="forca"
            src={`/imagens/forca_${6 - partida.vidasRestantes}.jpg`}
            alt={`Forca com ${6 - partida.vidasRestantes} erros`}
          />

          <Mascara valor={partida.mascara} />
          <Vidas quantidade={partida.vidasRestantes} />

          <p>
            Letras usadas: {partida.letrasTentadas.join(', ') || 'nenhuma'}
          </p>

          {!encerrada && (
            <Teclado
              partida={partida}
              bloqueado={carregando}
              onLetra={(letra) => void palpitar(letra)}
            />
          )}

          {encerrada && (
            <>
              <h2 className={partida.status === 'vitoria' ? 'verde' : 'vermelho'}>
                {partida.status === 'vitoria' ? 'VOCÊ VENCEU!' : 'GAME OVER!'}
              </h2>
              <p className="ouro">A palavra era: {partida.palavra}</p>
              <p>🏆 Pontuação final: {partida.pontos}</p>

              <button
                className="primario"
                disabled={carregando}
                onClick={() => void jogar()}
              >
                🔄 JOGAR NOVAMENTE
              </button>
            </>
          )}

          <button
            disabled={carregando}
            onClick={() => {
              setPartida(null);
              setErro('');
            }}
          >
            🏠 MENU PRINCIPAL
          </button>
        </section>
      )}

      {(!partida || encerrada) && (
        <Ranking atualizar={versaoRanking} />
      )}
    </main>
  );
}
import { useEffect, useRef, useState } from 'react';
import { api, type Dificuldade } from './api/cliente';
import type { EstadoPartida, ItemRanking } from './types';

function mensagemErro(erro: unknown): string {
  return erro instanceof Error
    ? erro.message
    : 'Ocorreu um erro inesperado.';
}

function Mascara({ valor }: { valor: string }) {
  return (
    <p className="mascara">
      {valor.split('').join(' ')}
    </p>
  );
}

function Vidas({ quantidade }: { quantidade: number }) {
  return <p>Tentativas restantes: {quantidade}</p>;
}

function Forca({ erros }: { erros: number }) {
  return (
    <div className="painel-forca">
      <img
        className="forca"
        src={`/imagens/forca_${erros}.jpg`}
        alt={`Imagem da forca com ${erros} vidas consumidas`}
      />

      <details className="detalhe-svg">
        <summary>Ver desenho da forca em SVG</summary>

        <svg
          className="desenho-forca"
          viewBox="0 0 260 280"
          role="img"
          aria-label={`Desenho da forca com ${erros} de 6 vidas consumidas`}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <path d="M30 260 H230 M65 260 V25 H175 V55 M65 65 L105 25" />
            {erros >= 1 && <circle cx="175" cy="80" r="25" />}
            {erros >= 2 && <path d="M175 105 V180" />}
            {erros >= 3 && <path d="M175 125 L135 155" />}
            {erros >= 4 && <path d="M175 125 L215 155" />}
            {erros >= 5 && <path d="M175 180 L140 230" />}
            {erros >= 6 && <path d="M175 180 L210 230" />}
          </g>
        </svg>
      </details>
    </div>
  );
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
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const alvo = evento.target;

      if (
        evento.repeat ||
        evento.ctrlKey ||
        evento.altKey ||
        evento.metaKey ||
        alvo instanceof HTMLInputElement ||
        alvo instanceof HTMLTextAreaElement ||
        alvo instanceof HTMLSelectElement ||
        (alvo instanceof HTMLElement && alvo.isContentEditable)
      ) {
        return;
      }

      const letra = evento.key.toUpperCase();

      if (
        bloqueado ||
        partida.status !== 'em_andamento' ||
        !/^[A-Z]$/.test(letra) ||
        partida.letrasTentadas.includes(letra)
      ) {
        return;
      }

      evento.preventDefault();
      onLetra(letra);
    }

    window.addEventListener('keydown', aoTeclar);

    return () => {
      window.removeEventListener('keydown', aoTeclar);
    };
  }, [partida, bloqueado, onLetra]);

  return (
    <div className="acoes" aria-label="Teclado de letras">
      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letra) => {
        const tentada = partida.letrasTentadas.includes(letra);
        const acertou = partida.mascara.includes(letra);

        return (
          <button
            key={letra}
            disabled={bloqueado || tentada}
            className={
              tentada ? (acertou ? 'primario' : 'dificil') : ''
            }
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
        if (ativo) {
          setItens(dados);
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setErro(mensagemErro(falha));
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [atualizar]);

  return (
    <section>
      <h2>🏆 Melhores jogadores</h2>

      {carregando && (
        <p role="status">Carregando ranking...</p>
      )}

      {erro && (
        <p className="vermelho" role="alert">
          {erro}
        </p>
      )}

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
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [partida, setPartida] = useState<EstadoPartida | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [dica, setDica] = useState('');
  const [versaoRanking, setVersaoRanking] = useState(0);

  const emRequisicao = useRef(false);

  const apelido = nome.trim();
  const nomeValido = apelido.length >= 3 && apelido.length <= 20;
  const encerrada =
    partida !== null && partida.status !== 'em_andamento';

  function receberPartida(atualizada: EstadoPartida) {
    setPartida(atualizada);

    if (atualizada.status !== 'em_andamento') {
      setVersaoRanking((valor) => valor + 1);
    }
  }

  async function jogar() {
    if (!nomeValido || emRequisicao.current) {
      return;
    }

    emRequisicao.current = true;
    setCarregando(true);
    setErro('');

    try {
      const nova = await api.novaPartida(apelido, dificuldade);

      setPartida(nova);
      setDica('');
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
      receberPartida(atualizada);
    } catch (falha: unknown) {
      setErro(mensagemErro(falha));
    } finally {
      emRequisicao.current = false;
      setCarregando(false);
    }
  }

  async function pedirDica() {
    if (
      !partida ||
      partida.status !== 'em_andamento' ||
      dica ||
      emRequisicao.current
    ) {
      return;
    }

    emRequisicao.current = true;
    setCarregando(true);
    setErro('');

    try {
      const resposta = await api.dica(partida.id);

      setDica(resposta.dica);
      receberPartida(resposta.partida);
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

      {erro && (
        <p className="vermelho" role="alert">
          {erro}
        </p>
      )}

      {carregando && (
        <p role="status">Aguarde...</p>
      )}

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

            <fieldset
              className="selecao-dificuldade"
              disabled={carregando}
            >
              <legend>Escolha a dificuldade</legend>

              <div className="opcoes-dificuldade">
                <button
                  type="button"
                  className={`nivel nivel-facil ${
                    dificuldade === 'facil' ? 'selecionado' : ''
                  }`}
                  aria-pressed={dificuldade === 'facil'}
                  onClick={() => setDificuldade('facil')}
                >
                  <strong>🟢 FÁCIL</strong>
                  <span>Até 6 letras</span>
                </button>

                <button
                  type="button"
                  className={`nivel nivel-medio ${
                    dificuldade === 'medio' ? 'selecionado' : ''
                  }`}
                  aria-pressed={dificuldade === 'medio'}
                  onClick={() => setDificuldade('medio')}
                >
                  <strong>🟡 MÉDIO</strong>
                  <span>7 a 9 letras</span>
                </button>

                <button
                  type="button"
                  className={`nivel nivel-dificil ${
                    dificuldade === 'dificil' ? 'selecionado' : ''
                  }`}
                  aria-pressed={dificuldade === 'dificil'}
                  onClick={() => setDificuldade('dificil')}
                >
                  <strong>🔴 DIFÍCIL</strong>
                  <span>10 letras ou mais</span>
                </button>
              </div>
            </fieldset>

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

          <Forca erros={6 - partida.vidasRestantes} />

          <Mascara valor={partida.mascara} />
          <Vidas quantidade={partida.vidasRestantes} />

          <p>
            Letras usadas:{' '}
            {partida.letrasTentadas.join(', ') || 'nenhuma'}
          </p>

          {dica && (
            <p className="ouro">💡 {dica}</p>
          )}

          {!encerrada && (
            <>
              <p>
                Clique nas letras ou use o teclado do computador.
              </p>

              <Teclado
                partida={partida}
                bloqueado={carregando}
                onLetra={(letra) => void palpitar(letra)}
              />

              <button
                className="dourado"
                disabled={carregando || Boolean(dica)}
                onClick={() => void pedirDica()}
              >
                {dica
                  ? '💡 Dica utilizada'
                  : '💡 Pedir dica — custa 1 vida'}
              </button>

              {!dica && partida.vidasRestantes === 1 && (
                <p className="vermelho">
                  Pedir a dica agora encerra a partida por falta de vidas.
                </p>
              )}
            </>
          )}

          {encerrada && (
            <>
              <h2
                className={
                  partida.status === 'vitoria'
                    ? 'verde'
                    : 'vermelho'
                }
              >
                {partida.status === 'vitoria'
                  ? 'VOCÊ VENCEU!'
                  : 'GAME OVER!'}
              </h2>

              <p className="ouro">
                A palavra era: {partida.palavra}
              </p>

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
              setDica('');
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
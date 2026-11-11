// Camada de serviço para comunicação com a API do AcolheMar.

async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers },
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique se o frontend está rodando.");
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(
      dados?.erro ?? `A API não respondeu (erro ${resposta.status}). Ela está rodando?`,
    );
  }
  return dados;
}

// Rotas de Doadores
export const listarDoadores = () => requisicao("/doadores");
export const criarDoador = (doador) =>
  requisicao("/doadores", { method: "POST", body: JSON.stringify(doador) });
export const atualizarDoador = (id, doador) =>
  requisicao(`/doadores/${id}`, { method: "PUT", body: JSON.stringify(doador) });
export const excluirDoador = (id) => requisicao(`/doadores/${id}`, { method: "DELETE" });

// Rotas de Itens e Doações
export const listarItens = () => requisicao("/itens");
export const listarDoacoes = () => requisicao("/doacoes");
export const registrarDoacao = (doacao) =>
  requisicao("/doacoes", { method: "POST", body: JSON.stringify(doacao) });

// Verificação de saúde da API e do banco
export const verificarSaude = () => requisicao("/health");

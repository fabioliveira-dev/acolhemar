const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const STATUS_VALIDOS = ["Pendente", "Entregue", "Cancelada"];

export function validarDoador(dados = {}) {
  const { nome, cpf, email, telefone } = dados;

  if (typeof nome !== "string" || nome.trim() === "") return "Nome é obrigatório";
  if (nome.length > 100) return "Nome deve ter no máximo 100 caracteres";

  if (typeof cpf !== "string" || cpf.trim() === "") return "CPF é obrigatório";
  if (cpf.length > 14) return "CPF deve ter no máximo 14 caracteres";

  if (typeof email !== "string" || email.trim() === "") return "E-mail é obrigatório";
  if (email.length > 100 || !FORMATO_EMAIL.test(email)) return "E-mail inválido";

  if (typeof telefone !== "string" || telefone.trim() === "") return "Telefone é obrigatório";
  if (telefone.length > 20) return "Telefone deve ter no máximo 20 caracteres";

  return null;
}

export function validarDoacao(dados = {}) {
  const { id_doador, data_doacao, status, data_entrega, itens } = dados;

  if (!Number.isInteger(id_doador)) {
    return "Selecione um doador válido";
  }
  if (!FORMATO_DATA.test(data_doacao ?? "")) {
    return "A data da doação deve estar no formato AAAA-MM-DD";
  }
  if (status && !STATUS_VALIDOS.includes(status)) {
    return "Status inválido (use Pendente, Entregue ou Cancelada)";
  }
  if (data_entrega && !FORMATO_DATA.test(data_entrega)) {
    return "A data de entrega deve estar no formato AAAA-MM-DD";
  }
  if (!Array.isArray(itens) || itens.length === 0) {
    return "Adicione pelo menos um item à doação";
  }

  for (const item of itens) {
    if (typeof item.categoria !== "string" || item.categoria.trim() === "") {
      return "Selecione o gênero de cada item";
    }
    if (typeof item.nome !== "string" || item.nome.trim() === "") {
      return "Digite a descrição do que será doado em cada item";
    }
    if (item.nome.length > 100) {
      return "A descrição do item deve ter no máximo 100 caracteres";
    }
    if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
      return "A quantidade de cada item deve ser um número inteiro maior que zero";
    }
  }

  return null;
}

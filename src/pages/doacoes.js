import { listarDoacoes, listarDoadores, registrarDoacao } from "../api.js";
import { el, esconderMensagem, estado, formatarData, hoje, mostrarMensagem } from "../ui.js";

const GENEROS = ["Alimentos", "Roupas", "Higiene", "Financeira", "Outros"];

// Tela: Cadastro de Doação
export async function telaNovaDoacao(app) {
  app.innerHTML = `
    <h1>Cadastro de Doação</h1>
    <form id="form-doacao" class="cartao formulario-doacao">
      <label>
        Doador (*)
        <select name="id_doador" required>
          <option value="">Carregando...</option>
        </select>
      </label>
      <label>
        Data da Doação (*)
        <input name="data_doacao" type="date" required />
      </label>
      <label>
        Estado (*)
        <select name="status" required>
          <option value="Entregue">Entregue</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </label>
      <label>
        Data de Entrega <span class="opcional">(opcional)</span>
        <input name="data_entrega" type="date" />
      </label>
      <label>
        Descrição <span class="opcional">(opcional)</span>
        <textarea name="descricao" maxlength="500" rows="2" placeholder="Observações gerais sobre a doação"></textarea>
      </label>

      <fieldset>
        <legend>Itens da doação</legend>
        <div id="linhas-itens"></div>
        <button type="button" id="adicionar-item" class="secundario">+ Adicionar item</button>
      </fieldset>

      <div class="acoes">
        <button type="submit">Guardar Doação</button>
        <a href="#/doacoes">Ver doações registradas</a>
      </div>
      <p id="msg" class="mensagem" role="status" hidden></p>
    </form>
  `;

  const form = app.querySelector("#form-doacao");
  const selectDoador = form.elements.id_doador;
  const linhasItens = app.querySelector("#linhas-itens");
  const botaoSalvar = form.querySelector('button[type="submit"]');
  const msg = app.querySelector("#msg");

  form.elements.data_doacao.value = hoje();

  function adicionarLinha() {
    const linha = el(
      "div",
      { class: "linha-item" },
      el(
        "label",
        {},
        "Gênero (*)",
        el(
          "select",
          { class: "campo-genero", required: "" },
          el("option", { value: "" }, "Selecione"),
          ...GENEROS.map((genero) => el("option", { value: genero }, genero)),
        ),
      ),
      el(
        "label",
        {},
        "Item / Descrição (*)",
        el("input", {
          type: "text",
          class: "campo-item",
          maxlength: "100",
          placeholder: "Ex: Arroz 5kg, Agasalho, Valor em R$...",
          required: "",
        }),
      ),
      el(
        "label",
        {},
        "Quantidade (*)",
        el("input", {
          type: "number",
          class: "campo-qtd",
          min: "1",
          step: "1",
          value: "1",
          required: "",
        }),
      ),
      el(
        "button",
        { type: "button", class: "secundario", onclick: () => removerLinha(linha) },
        "Remover",
      ),
    );
    linhasItens.append(linha);
  }

  function removerLinha(linha) {
    if (linhasItens.children.length === 1) {
      mostrarMensagem(msg, "A doação precisa conter pelo menos um item.", "erro");
      return;
    }
    linha.remove();
  }

  app.querySelector("#adicionar-item").addEventListener("click", adicionarLinha);

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const linhas = [...linhasItens.querySelectorAll(".linha-item")];

    const doacao = {
      id_doador: Number(form.elements.id_doador.value),
      data_doacao: form.elements.data_doacao.value,
      status: form.elements.status.value,
      data_entrega: form.elements.data_entrega.value || null,
      descricao: form.elements.descricao.value.trim(),
      itens: linhas.map((linha) => ({
        categoria: linha.querySelector(".campo-genero").value,
        nome: linha.querySelector(".campo-item").value.trim(),
        quantidade: Number(linha.querySelector(".campo-qtd").value),
      })),
    };

    botaoSalvar.disabled = true;
    esconderMensagem(msg);

    try {
      const nova = await registrarDoacao(doacao);
      mostrarMensagem(
        msg,
        `Doação nº ${nova.id_doacao} registrada com sucesso (${nova.itens.length} item(ns)).`,
      );
      form.reset();
      form.elements.data_doacao.value = hoje();
      linhasItens.replaceChildren();
      adicionarLinha();
    } catch (erro) {
      mostrarMensagem(msg, erro.message, "erro");
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  try {
    const doadores = await listarDoadores();
    if (doadores.length === 0) {
      selectDoador.replaceChildren(el("option", { value: "" }, "Nenhum doador cadastrado"));
      mostrarMensagem(msg, "Cadastre um doador antes de registrar uma doação.", "erro");
      botaoSalvar.disabled = true;
      return;
    }
    selectDoador.replaceChildren(
      el("option", { value: "" }, "Selecione o doador"),
      ...doadores.map((doador) => el("option", { value: doador.id_doador }, doador.nome)),
    );
    adicionarLinha();
  } catch (erro) {
    mostrarMensagem(msg, erro.message, "erro");
    botaoSalvar.disabled = true;
  }
}

// Tela: Listagem de Doações
export async function telaDoacoes(app) {
  app.innerHTML = `
    <div class="titulo-tela">
      <h1>Listagem de Doações</h1>
      <a class="botao" href="#/doacoes/nova">+ Registrar doação</a>
    </div>
    <p id="resumo" class="resumo"></p>
    <p id="msg" class="mensagem" role="status" hidden></p>
    <ul id="lista-doacoes" class="lista"></ul>
  `;

  const lista = app.querySelector("#lista-doacoes");
  const resumo = app.querySelector("#resumo");
  const msg = app.querySelector("#msg");

  lista.replaceChildren(estado("Carregando..."));
  try {
    const doacoes = await listarDoacoes();
    if (doacoes.length === 0) {
      lista.replaceChildren(estado("Nenhuma doação registrada ainda."));
      return;
    }
    resumo.textContent = `Mostrando ${doacoes.length} doação(ões) registrada(s)`;
    lista.replaceChildren(...doacoes.map(cartaoDoacao));
  } catch (erro) {
    lista.replaceChildren();
    mostrarMensagem(msg, erro.message, "erro");
  }
}

function cartaoDoacao(doacao) {
  return el(
    "li",
    { class: "cartao doacao" },
    el(
      "div",
      { class: "doacao-topo" },
      el("strong", {}, doacao.doador.nome),
      el("time", { datetime: doacao.data_doacao }, formatarData(doacao.data_doacao)),
    ),
    el(
      "div",
      { class: "detalhe" },
      `Estado: ${doacao.status}`,
      doacao.data_entrega ? ` | Entrega: ${formatarData(doacao.data_entrega)}` : "",
    ),
    el(
      "ul",
      { class: "itens" },
      ...doacao.itens.map((item) =>
        el(
          "li",
          {},
          el("span", { class: "qtd" }, String(item.quantidade)),
          el("span", {}, item.nome),
          el("span", { class: "unidade" }, item.categoria),
        ),
      ),
    ),
    doacao.descricao ? el("p", { class: "observacao" }, doacao.descricao) : null,
  );
}

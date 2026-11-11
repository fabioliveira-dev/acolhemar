import { atualizarDoador, criarDoador, excluirDoador, listarDoadores } from "../api.js";
import { el, esconderMensagem, estado, mostrarMensagem } from "../ui.js";

export async function telaDoadores(app) {
  app.innerHTML = `
    <h1>Doadores</h1>
    <div class="layout-doadores">
      <form id="form-doador" class="cartao">
        <h2 id="titulo-form">Novo Doador</h2>
        <label>
          Nome (*)
          <input name="nome" required maxlength="100" autocomplete="name" placeholder="Nome completo" />
        </label>
        <label>
          CPF (*)
          <input name="cpf" required maxlength="14" placeholder="000.000.000-00" />
        </label>
        <label>
          E-mail (*)
          <input name="email" type="email" required maxlength="100" autocomplete="email" placeholder="nome@email.com" />
        </label>
        <label>
          Telefone (*)
          <input name="telefone" type="tel" required maxlength="20" autocomplete="tel" placeholder="(14) 99999-0000" />
        </label>
        <div class="acoes">
          <button type="submit">Guardar</button>
          <button type="button" id="cancelar" class="secundario" hidden>Cancelar edição</button>
        </div>
        <p id="msg-form" class="mensagem" role="status" hidden></p>
      </form>

      <section>
        <h2>Doadores Cadastrados</h2>
        <p id="msg-lista" class="mensagem" role="status" hidden></p>
        <ul id="lista-doadores" class="lista"></ul>
      </section>
    </div>
  `;

  const form = app.querySelector("#form-doador");
  const titulo = app.querySelector("#titulo-form");
  const botaoSalvar = form.querySelector('button[type="submit"]');
  const botaoCancelar = app.querySelector("#cancelar");
  const msgForm = app.querySelector("#msg-form");
  const msgLista = app.querySelector("#msg-lista");
  const lista = app.querySelector("#lista-doadores");

  let editandoId = null;

  async function carregar() {
    lista.replaceChildren(estado("Carregando..."));
    try {
      const doadores = await listarDoadores();
      if (doadores.length === 0) {
        lista.replaceChildren(estado("Nenhum doador cadastrado ainda."));
        return;
      }
      lista.replaceChildren(...doadores.map(cartaoDoador));
    } catch (erro) {
      lista.replaceChildren();
      mostrarMensagem(msgLista, erro.message, "erro");
    }
  }

  function cartaoDoador(doador) {
    return el(
      "li",
      { class: "cartao" },
      el("strong", {}, doador.nome),
      el("span", { class: "detalhe" }, `CPF: ${doador.cpf}`),
      el("span", { class: "detalhe" }, doador.email),
      el("span", { class: "detalhe" }, doador.telefone),
      el(
        "div",
        { class: "acoes" },
        el(
          "button",
          { type: "button", class: "secundario", onclick: () => editar(doador) },
          "Editar",
        ),
        el(
          "button",
          { type: "button", class: "perigo", onclick: () => excluir(doador) },
          "Excluir",
        ),
      ),
    );
  }

  function editar(doador) {
    editandoId = doador.id_doador;
    form.elements.nome.value = doador.nome;
    form.elements.cpf.value = doador.cpf;
    form.elements.email.value = doador.email;
    form.elements.telefone.value = doador.telefone;
    titulo.textContent = `Editar ${doador.nome}`;
    botaoCancelar.hidden = false;
    esconderMensagem(msgForm);
    form.scrollIntoView({ behavior: "smooth" });
    form.elements.nome.focus();
  }

  function limparFormulario() {
    editandoId = null;
    form.reset();
    titulo.textContent = "Novo Doador";
    botaoCancelar.hidden = true;
  }

  async function excluir(doador) {
    if (!confirm(`Excluir ${doador.nome}?`)) return;
    esconderMensagem(msgLista);
    try {
      await excluirDoador(doador.id_doador);
      mostrarMensagem(msgLista, `${doador.nome} foi excluído.`);
      if (editandoId === doador.id_doador) limparFormulario();
      await carregar();
    } catch (erro) {
      mostrarMensagem(msgLista, erro.message, "erro");
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    botaoSalvar.disabled = true;
    esconderMensagem(msgForm);

    try {
      if (editandoId) {
        await atualizarDoador(editandoId, dados);
        mostrarMensagem(msgForm, "Doador atualizado com sucesso.");
      } else {
        const novo = await criarDoador(dados);
        mostrarMensagem(msgForm, `${novo.nome} foi guardado com sucesso.`);
      }
      limparFormulario();
      await carregar();
    } catch (erro) {
      mostrarMensagem(msgForm, erro.message, "erro");
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    esconderMensagem(msgForm);
  });

  await carregar();
}

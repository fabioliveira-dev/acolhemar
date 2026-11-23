import { entrar } from "../api.js";
import { mostrarMensagem } from "../ui.js";

export function telaLogin(raiz, aoEntrar) {
  raiz.innerHTML = `
    <main class="login">
      <h1>AcolheMar</h1>
      <p class="subtitulo">Entrar no sistema</p>
      <form id="form-login" class="cartao">
        <label>
          E-mail (*)
          <input name="email" type="email" required autocomplete="username" placeholder="voluntario@acolhemar.org" />
        </label>
        <label>
          Senha (*)
          <input name="senha" type="password" required autocomplete="current-password" />
        </label>
        <p id="msg-login" class="mensagem" role="status" hidden></p>
        <button type="submit">Entrar</button>
      </form>
    </main>
  `;

  const form = raiz.querySelector("#form-login");
  const msg = raiz.querySelector("#msg-login");

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    mostrarMensagem(msg, "Entrando...", "info");

    try {
      await entrar(form.elements.email.value.trim(), form.elements.senha.value);
      aoEntrar();
    } catch (erro) {
      mostrarMensagem(msg, erro.message, "erro");
      form.elements.senha.value = "";
      form.elements.senha.focus();
    } finally {
      botao.disabled = false;
    }
  });
}

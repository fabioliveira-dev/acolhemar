import "./style.css";
import { lerNomeUsuario, lerToken, sair, verificarSaude } from "./api.js";
import { telaDoacoes, telaNovaDoacao } from "./pages/doacoes.js";
import { telaDoadores } from "./pages/doadores.js";
import { telaLogin } from "./pages/login.js";

const app = document.querySelector("#app");

const rotas = {
  "#/doadores": telaDoadores,
  "#/doacoes/nova": telaNovaDoacao,
  "#/doacoes": telaDoacoes,
};

function navegar() {
  if (!lerToken()) return;
  const conteudo = document.querySelector("#conteudo");
  if (!conteudo) return;

  const rota = rotas[location.hash] ? location.hash : "#/doadores";
  for (const link of document.querySelectorAll("nav a")) {
    if (link.getAttribute("href") === rota) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  void rotas[rota](conteudo);
}

function mostrarApp() {
  app.innerHTML = `
    <header class="topo">
      <a class="marca" href="#/doadores">AcolheMar</a>
      <nav aria-label="Principal">
        <a href="#/doadores">Doadores</a>
        <a href="#/doacoes/nova">Registrar doação</a>
        <a href="#/doacoes">Doações</a>
      </nav>
      <div class="topo-usuario">
        <span class="usuario"></span>
        <button type="button" id="sair" class="secundario">Sair</button>
      </div>
    </header>
    <main id="conteudo"></main>
  `;

  app.querySelector(".usuario").textContent = lerNomeUsuario() ?? "";
  app.querySelector("#sair").addEventListener("click", () => {
    sair();
    iniciar();
  });

  navegar();
}

function iniciar() {
  if (lerToken()) {
    mostrarApp();
  } else {
    telaLogin(app, mostrarApp);
  }
}

window.addEventListener("hashchange", navegar);
iniciar();

const statusApi = document.querySelector("#status-api");
verificarSaude()
  .then((saude) => (statusApi.textContent = `${saude.status}, banco: ${saude.banco}`))
  .catch(() => (statusApi.textContent = "fora do ar"));

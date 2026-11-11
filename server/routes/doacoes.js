import { Router } from "express";
import db from "../db.js";
import { validarDoacao } from "../validacao.js";

const router = Router();

// GET /api/doacoes: retorna a lista de doações com os dados do doador e itens vinculados
router.get("/", async (req, res) => {
  const [linhas] = await db.execute(`
    SELECT d.id_doacao, d.data_doacao, d.descricao, d.status, d.data_entrega,
           dr.id_doador, dr.nome AS nome_doador,
           i.id_item, i.nome AS nome_item, c.nome AS categoria, di.quantidade
    FROM doacao d
    JOIN doador dr      ON dr.id_doador = d.id_doador
    JOIN doacao_item di ON di.id_doacao = d.id_doacao
    JOIN item i         ON i.id_item = di.id_item
    JOIN categoria c    ON c.id_categoria = i.id_categoria
    ORDER BY d.data_doacao DESC, d.id_doacao DESC, i.nome
  `);

  const doacoes = new Map();
  for (const linha of linhas) {
    if (!doacoes.has(linha.id_doacao)) {
      doacoes.set(linha.id_doacao, {
        id_doacao: linha.id_doacao,
        data_doacao: linha.data_doacao,
        descricao: linha.descricao,
        status: linha.status,
        data_entrega: linha.data_entrega,
        doador: { id_doador: linha.id_doador, nome: linha.nome_doador },
        itens: [],
      });
    }
    doacoes.get(linha.id_doacao).itens.push({
      id_item: linha.id_item,
      nome: linha.nome_item,
      categoria: linha.categoria,
      quantidade: linha.quantidade,
    });
  }

  res.json([...doacoes.values()]);
});

// POST /api/doacoes: registra a doação criando automaticamente o gênero/item se necessário
router.post("/", async (req, res) => {
  const erro = validarDoacao(req.body);
  if (erro) return res.status(400).json({ erro });

  const { id_doador, data_doacao, itens } = req.body;
  const status = req.body.status || "Entregue";
  const descricao = req.body.descricao || null;
  const data_entrega = req.body.data_entrega || null;

  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.execute(
      "INSERT INTO doacao (id_doador, data_doacao, descricao, status, data_entrega) VALUES (?, ?, ?, ?, ?)",
      [id_doador, data_doacao, descricao, status, data_entrega],
    );

    const idDoacao = resultado.insertId;

    for (const item of itens) {
      const nomeCategoria = item.categoria.trim();
      const nomeItem = item.nome.trim();

      // 1. Busca ou cria a categoria (gênero)
      let [catRows] = await conexao.execute(
        "SELECT id_categoria FROM categoria WHERE nome = ? LIMIT 1",
        [nomeCategoria],
      );
      let idCategoria;
      if (catRows.length > 0) {
        idCategoria = catRows[0].id_categoria;
      } else {
        const [novaCat] = await conexao.execute("INSERT INTO categoria (nome) VALUES (?)", [
          nomeCategoria,
        ]);
        idCategoria = novaCat.insertId;
      }

      // 2. Busca ou cria o item digitado pelo usuário dentro daquela categoria
      let [itemRows] = await conexao.execute(
        "SELECT id_item FROM item WHERE id_categoria = ? AND nome = ? LIMIT 1",
        [idCategoria, nomeItem],
      );
      let idItem;
      if (itemRows.length > 0) {
        idItem = itemRows[0].id_item;
      } else {
        const [novoItem] = await conexao.execute(
          "INSERT INTO item (id_categoria, nome, quantidade, prioridade, ativo) VALUES (?, ?, 0, 'Média', TRUE)",
          [idCategoria, nomeItem],
        );
        idItem = novoItem.insertId;
      }

      // 3. Vincula o item à doação (se repetir o mesmo item na doação, soma a quantidade)
      await conexao.execute(
        `INSERT INTO doacao_item (id_doacao, id_item, quantidade)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`,
        [idDoacao, idItem, item.quantidade],
      );

      // 4. Atualiza a quantidade em estoque na tabela item
      await conexao.execute("UPDATE item SET quantidade = quantidade + ? WHERE id_item = ?", [
        item.quantidade,
        idItem,
      ]);
    }

    await conexao.commit();
    res.status(201).json({
      id_doacao: idDoacao,
      id_doador,
      data_doacao,
      status,
      data_entrega,
      descricao,
      itens,
    });
  } catch (e) {
    await conexao.rollback();
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ erro: "Doador informado não encontrado" });
    }
    if (e.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ erro: "Formato de data inválido" });
    }
    throw e;
  } finally {
    conexao.release();
  }
});

export default router;

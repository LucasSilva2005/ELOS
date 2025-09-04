// Seleciona o formulário
const form = document.getElementById("formCadastroProduto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produto = {
    sku: document.getElementById("sku").value,
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value,
    preco: document.getElementById("preco").value,
    estoque: document.getElementById("estoque").value,
    status: document.getElementById("status").value,
  };

  // Envia para o banco via API
  const res = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto),
  });

  if (res.ok) {
    alert("Produto cadastrado com sucesso!");
    form.reset();

    // Atualiza a tabela de produtos.html
    window.opener?.carregarProdutos(); // Se abrir em nova aba, atualiza a página principal
  } else {
    alert("Erro ao cadastrar produto");
  }
});

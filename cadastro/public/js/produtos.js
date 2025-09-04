async function carregarProdutos() {
  try {
    const res = await fetch("/api/produtos");
    const produtos = await res.json();

    console.log(produtos); // <-- veja se os produtos aparecem no console

    const tbody = document.getElementById("tabelaProdutos");
    tbody.innerHTML = "";

    produtos.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="produto-info">
            <div class="icon"><i class="fa-solid fa-box"></i></div>
            <div>
              <strong>${p.nome}</strong><br />
              <span>ID: ${p.id}</span>
            </div>
          </div>
        </td>
        <td>${p.categoria}</td>
        <td><strong>R$ ${Number(p.preco).toFixed(2)}</strong></td>
        <td>${p.estoque} unidades</td>
        <td><span class="status ${p.status}">${p.status}</span></td>
        <td>
          <i class="fa-solid fa-pen-to-square edit" onclick="editarProduto(${p.id})"></i>
          <i class="fa-solid fa-trash delete" onclick="deletarProduto(${p.id})"></i>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

function editarProduto(id) {
  const novoNome = prompt("Novo nome do produto:");
  if (!novoNome) return;

  // Buscar o produto atual na tabela carregada
  fetch("/api/produtos")
    .then(res => res.json())
    .then(produtos => {
      const produto = produtos.find(p => p.id === id);
      if (!produto) return alert("Produto não encontrado");

      fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: produto.sku,       // envia o SKU atual
          nome: novoNome,         // atualiza o nome
          categoria: produto.categoria,
          preco: produto.preco,
          estoque: produto.estoque,
          status: produto.status
        })
      })
      .then(res => {
        if (res.ok) carregarProdutos();
        else alert("Erro ao atualizar produto");
      });
    });
}



function deletarProduto(id) {
  if (!confirm("Deseja realmente deletar?")) return;

  fetch(`/api/produtos/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) carregarProdutos();
      else alert("Erro ao deletar produto");
    });
}

window.addEventListener("DOMContentLoaded", carregarProdutos);

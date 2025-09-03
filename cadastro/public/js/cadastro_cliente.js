async function carregarClientes() {
  try {
    // Usar a rota GET que retorna JSON
    const res = await fetch("/clientes/data");
    const clientes = await res.json();

    const container = document.getElementById("cardsContainer");
    container.innerHTML = ""; // limpa antes de renderizar

    clientes.forEach(c => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="avatar"><i class="fa-solid fa-user-group"></i></div>
        <h3>${c.nome}</h3>
        <p class="cliente-id">Cliente #${c.codigo_cliente}</p>
        <p><i class="fa-solid fa-envelope"></i> ${c.email}</p>
        <p><i class="fa-solid fa-phone"></i> ${c.telefone || "-"}</p>
        <hr />
        <div class="info">
          <p>Pedidos: <span>${c.pedidos || 0}</span></p>
          <p>Total Gasto: <span class="valor">R$ ${Number(c.total_gasto).toFixed(2)}</span></p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

// Carrega quando a página abre
window.addEventListener("DOMContentLoaded", carregarClientes);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pedido");
  const msgSucesso = document.getElementById("msg-sucesso");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura os dados do form
    const dados = {
      cliente: document.getElementById("cliente").value,
      produto: document.getElementById("produto").value,
      valor: parseFloat(document.getElementById("valor").value),
      status: document.getElementById("status").value,
    };

    try {
      // Envia para o backend
      const res = await fetch("/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        msgSucesso.style.display = "block";
        form.reset();

        // Esconde mensagem depois de 3s
        setTimeout(() => {
          msgSucesso.style.display = "none";
        }, 3000);
      } else {
        alert("Erro ao cadastrar pedido.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });
});

// Função para buscar um arquivo SVG e inseri-lo inline no HTML
const buscarSvg = (image) => {
  // Faz uma requisição para obter o conteúdo do arquivo SVG a partir do src da imagem
  fetch(image.src)
    .then((response) => response.text()) // Converte a resposta para texto
    .then((response) => {
      const span = document.createElement("span"); // Cria um elemento <span>
      span.innerHTML = response; // Define o conteúdo do <span> como o SVG retornado
      const inlineSvg = span.getElementsByTagName("svg")[0]; // Obtém o elemento <svg>
      image.parentNode.replaceChild(inlineSvg, image); // Substitui a imagem original pelo SVG inline
      return true;
    });
};

// Calcula a média de um array
function calculateAverage(arr) {
  if (arr.length === 0) {
    return 0; // Handle empty array case to avoid division by zero
  }
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

function apenasNumerosNoArray(arr) {
  return arr.filter((element) => {
    return typeof element === "number" && !isNaN(element);
  });
}

// ----- Consultas de API -----
// Faz uma consulta de API e retorna o resultado
async function pegarDadosDoFlask(link) {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data from Flask:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Adiciona um item a uma tabela via API.
async function adicionarDadoFlask(tabela, valores) {
  const dados = { tabela, valores };

  const opcoes = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  };

  try {
    const resposta = await fetch("/api/adicionar", opcoes);

    // O fetch não lança erro para status como 400 ou 500, então verificamos manualmente.
    if (!resposta.ok) {
      // Analisa a resposta JSON para obter a mensagem de erro do servidor.
      const erroData = await resposta.json();
      throw new Error(
        `Erro do servidor: ${resposta.status} - ${erroData.mensagem}`
      );
    }

    return await resposta.json(); // Retorna os dados da resposta em caso de sucesso.
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    throw erro; // Propaga o erro para o código que chamou a função.
  }
}

// Lista os dados de uma tabela via API.
async function listarDadosFlask(tabela, filtros = {}) {
  const dados = { tabela, filtros };

  const opcoes = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  };

  try {
    const resposta = await fetch("/api/listar", opcoes);

    // Verifica manualmente se houve erro
    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(
        `Erro do servidor (${resposta.status}): ${erroData.mensagem}`
      );
    }

    const json = await resposta.json();
    return json.dados; // retorna apenas os dados úteis
  } catch (erro) {
    console.error("Erro na requisição:", erro.message);
    throw erro;
  }
}

// Lista todas as notas com informações completas (aluno, sala, disciplina, bimestre)
async function listarNotasCompletasFlask() {
  try {
    const resposta = await fetch("/api/notas_completas");

    // Verifica manualmente se houve erro
    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(
        `Erro do servidor (${resposta.status}): ${erroData.mensagem}`
      );
    }

    const json = await resposta.json();
    return json; // já retorna a lista completa de notas
  } catch (erro) {
    console.error("Erro na requisição:", erro.message);
    throw erro;
  }
}

// Atualiza um item a uma tabela via API.
async function atualizarDadoFlask(tabela, valores, condicao, params = []) {
  // Monta o JSON esperado pelo Flask
  const dados = { tabela, valores, condicao, params };

  const opcoes = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  };

  try {
    const resposta = await fetch("/api/atualizar", opcoes);

    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(
        `Erro do servidor: ${resposta.status} - ${erroData.mensagem}`
      );
    }

    return await resposta.json(); // Sucesso
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    throw erro;
  }
}

// Exclui um item de uma tabela via API.
async function excluirDadoFlask(tabela, condicao, params = []) {
  const dados = { tabela, condicao, params };

  const opcoes = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  };

  try {
    const resposta = await fetch("/api/excluir", opcoes);

    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw new Error(
        `Erro do servidor: ${resposta.status} - ${erroData.mensagem}`
      );
    }

    return await resposta.json(); // Sucesso
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    throw erro;
  }
}

// Ordena uma tabela
// Recebe o índice da coluna (partindo de 0) e o elemento (th, passando this)
// Código-fonte: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n, el) {
  // Encontra a tabela do cabeçalho clicado, depois o tbody e, em seguida, pega as linhas
  const table = el.closest("table");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.rows);

  // Define direção da ordenação
  const th = table.querySelectorAll("th")[n];
  const currentDir = th.dataset.sortDir || "desc";
  // Se fir ascendente, se torna descendnete ou vice-versa
  const dir = currentDir === "asc" ? "desc" : "asc";
  th.dataset.sortDir = dir;

  // Remove indicadores de outras colunas
  table.querySelectorAll("th").forEach((header) => {
    if (header !== th) header.removeAttribute("data-sort-dir");
  });

  // Função de comparação
  const compare = (a, b) => {
    const x = a.cells[n]?.innerText.trim().toLowerCase() || "";
    const y = b.cells[n]?.innerText.trim().toLowerCase() || "";

    // Se for número, compara numericamente
    const numX = parseFloat(x.replace(",", "."));
    const numY = parseFloat(y.replace(",", "."));
    if (!isNaN(numX) && !isNaN(numY)) {
      return dir === "asc" ? numX - numY : numY - numX;
    }

    // Caso contrário, compara como texto
    if (x < y) return dir === "asc" ? -1 : 1;
    if (x > y) return dir === "asc" ? 1 : -1;
    return 0;
  };

  // Ordena as linhas e reinsere no DOM
  rows.sort(compare).forEach((row) => tbody.appendChild(row));
}

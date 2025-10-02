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

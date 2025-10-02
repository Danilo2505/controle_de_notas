const modalNotasAlunos = document.querySelector("#modal-notas-alunos");
const tableListagemAlunos = document.querySelector("#table-listagem-alunos");
const linhasTableListagemAlunos = document.querySelector(
  "#table-listagem-alunos > tbody"
);
const tableNotasAluno = document.querySelector("#table-notas-aluno");
const linhasTableNotasAluno = document.querySelector(
  "#table-notas-aluno > tbody"
);

// Percorre os elementos filhos de linhasTableListagemAlunos
for (let i = 0; i < linhasTableListagemAlunos.children.length; i++) {
  const linhaDoAluno = linhasTableListagemAlunos.children[i];
  // ID do aluno
  const idAluno = linhaDoAluno.firstElementChild.textContent;
  console.log(idAluno);
  // <button> para mostra as notas do aluno
  const botao = linhaDoAluno.lastElementChild.querySelector("button");
  // Cria um EventListener para o click no botão das notas de cada aluno
  botao.addEventListener("click", () => {
    mostrarNotasAluno(idAluno);
  });
}

async function carregarTabelaNotasAluno(idAluno) {
  const notas = await pegarDadosDoFlask(`/api/notas?id_aluno=${idAluno}`);
  const fragmento = document.createDocumentFragment();

  document.querySelector(
    "#modal-notas-alunos > div > div > h3 > span"
  ).textContent = notas[0].aluno;

  // Limpa as linhas das notas
  linhasTableNotasAluno.replaceChildren();

  // Obtém as disciplinas criando um conjunto composto pelas
  // notas mapeadas pelas disciplinas
  const disciplinas = [...new Set(notas.map((n) => n.disciplina))];
  // Cria um array bidimensional composto por
  // arrays com o nome da disciplina, 4 notas e média
  let notas_disciplinas = disciplinas.map((n) =>
    Array(n, 1.0, 2.0, 3.0, 4.0, 0)
  );

  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    const bimestre = Number(nota.bimestre.replace("º Bimestre", ""));
    const indiceDisciplina = disciplinas.indexOf(nota.disciplina);
    // Coloca a nota de acordo com a disciplina e o bimestre
    notas_disciplinas[indiceDisciplina][bimestre] = nota.valor;
    // Calcula a média, com 1 casa de precisão
    notas_disciplinas[indiceDisciplina][5] = Number(
      calculateAverage(notas_disciplinas[indiceDisciplina].slice(1, 4)).toFixed(
        1
      )
    );
  }

  console.log(notas_disciplinas);

  for (let i = 0; i < notas_disciplinas.length; i++) {
    const nota_disciplina = notas_disciplinas[i];
    let linha = document.createElement("tr");

    fragmento.appendChild(linha);

    let td_disciplina = document.createElement("td");
    let td_1_bimestre = document.createElement("td");
    let td_2_bimestre = document.createElement("td");
    let td_3_bimestre = document.createElement("td");
    let td_4_bimestre = document.createElement("td");
    let td_media = document.createElement("td");

    td_disciplina.textContent = nota_disciplina[0];
    td_1_bimestre.textContent = nota_disciplina[1];
    td_2_bimestre.textContent = nota_disciplina[2];
    td_3_bimestre.textContent = nota_disciplina[3];
    td_4_bimestre.textContent = nota_disciplina[4];
    td_media.textContent = nota_disciplina[5];

    linha.appendChild(td_disciplina);
    linha.appendChild(td_1_bimestre);
    linha.appendChild(td_2_bimestre);
    linha.appendChild(td_3_bimestre);
    linha.appendChild(td_4_bimestre);
    linha.appendChild(td_media);
    fragmento.appendChild(linha);
  }

  linhasTableNotasAluno.appendChild(fragmento);
}

function mostrarModalNotas() {
  modalNotasAlunos.style.display = "flex";
}

function fecharModalNotas() {
  modalNotasAlunos.style.display = "none";
}

function mostrarNotasAluno(idAluno) {
  carregarTabelaNotasAluno(idAluno);
  mostrarModalNotas();
}

modalNotasAlunos
  .querySelector(".button-fechar")
  .addEventListener("click", fecharModalNotas);

// Quando o usuário clica fora do modalNotasAlunos, o fecha
window.onclick = function (event) {
  if (event.target == modalNotasAlunos) {
    fecharModalNotas();
  }
};

console.log();

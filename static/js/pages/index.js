const modalNotasAlunos = document.querySelector("#modal-notas-alunos");
const tableListagemAlunos = document.querySelector("#table-listagem-alunos");
const linhasTableListagemAlunos = document.querySelector(
  "#table-listagem-alunos > tbody"
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

function carregarTabelaNotasAluno(idAluno) {
  console.log(`idAluno: ${idAluno}`);
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

const selectModoExclusao = document.querySelector("#select-exclusao");
const selectorsSectionsModosExclusao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];

function definirModoExclusao(modoSelecionado) {
  // Coloca a classe escondido em cada seção de modo de exclusão
  selectorsSectionsModosExclusao.forEach((modoExclusao) => {
    document.querySelector(modoExclusao).classList.add("escondido");
  });

  // Retira a classe "escondido" do modo de exclusão selecionado
  switch (modoSelecionado) {
    // Modo de exclusão de disciplinas
    case "disciplina":
      document
        .querySelector("#section-disciplina")
        .classList.remove("escondido");
      break;
    // Modo de exclusão de salas
    case "sala":
      document.querySelector("#section-sala").classList.remove("escondido");
      break;
    // Modo de exclusão de alunos
    case "aluno":
      document.querySelector("#section-aluno").classList.remove("escondido");
      break;
    // Modo de exclusão de notas
    case "nota":
      document.querySelector("#section-nota").classList.remove("escondido");
      break;
  }
}

definirModoExclusao(selectModoExclusao.value);

selectModoExclusao.addEventListener("change", function () {
  definirModoExclusao(this.value);
});

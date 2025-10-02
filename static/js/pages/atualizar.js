const selectModoEdicao = document.querySelector("#select-edicao");
const selectorsSectionsModosEdicao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];

function definirModoEdicao(modoSelecionado) {
  // Coloca a classe escondido em cada seção de modo de edição
  selectorsSectionsModosEdicao.forEach((modoEdicao) => {
    document.querySelector(modoEdicao).classList.add("escondido");
  });

  // Retira a classe "escondido" do modo de edição selecionado
  switch (modoSelecionado) {
    // Modo de edição de disciplinas
    case "disciplina":
      document
        .querySelector("#section-disciplina")
        .classList.remove("escondido");
      break;
    // Modo de edição de salas
    case "sala":
      document.querySelector("#section-sala").classList.remove("escondido");
      break;
    // Modo de edição de alunos
    case "aluno":
      document.querySelector("#section-aluno").classList.remove("escondido");
      break;
    // Modo de edição de notas
    case "nota":
      document.querySelector("#section-nota").classList.remove("escondido");
      break;
  }
}

definirModoEdicao(selectModoEdicao.value);

selectModoEdicao.addEventListener("change", function () {
  definirModoEdicao(this.value);
});

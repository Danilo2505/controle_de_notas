const selectModoAdicao = document.querySelector("#select-adicao");
const selectorsSectionsModosAdicao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];

function definirModoAdicao(modoSelecionado) {
  // Coloca a classe escondido em cada seção de modo de adição
  selectorsSectionsModosAdicao.forEach((modoAdicao) => {
    document.querySelector(modoAdicao).classList.add("escondido");
  });

  // Retira a classe "escondido" do modo de adição selecionado
  switch (modoSelecionado) {
    // Modo de adição de disciplinas
    case "disciplina":
      document
        .querySelector("#section-disciplina")
        .classList.remove("escondido");
      break;
    // Modo de adição de salas
    case "sala":
      document.querySelector("#section-sala").classList.remove("escondido");
      break;
    // Modo de adição de alunos
    case "aluno":
      document.querySelector("#section-aluno").classList.remove("escondido");
      break;
    // Modo de adição de notas
    case "nota":
      document.querySelector("#section-nota").classList.remove("escondido");
      break;
  }
}

definirModoAdicao(selectModoAdicao.value);

selectModoAdicao.addEventListener("change", function () {
  definirModoAdicao(this.value);
});

// Dados do novo aluno para enviar.
const novoAluno = {
  nome: "Maria Souza",
  id_sala: 3, // Exemplo: Supondo que a sala de ID 3 exista.
};

// Chama a função formalizada para adicionar o aluno.
adicionarDadoFlask("alunos", novoAluno)
  .then((data) => {
    if (data.sucesso) {
      console.log("Sucesso:", data.mensagem);
      // Lógica adicional, como recarregar a página ou atualizar a interface.
    } else {
      console.error("Erro do servidor:", data.mensagem);
    }
  })
  .catch((erro) => {
    // Trata erros de rede ou erros específicos lançados pela função.
    console.error("Ocorreu um erro ao adicionar o aluno:", erro.message);
  });

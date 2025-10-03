const selectModoEdicao = document.querySelector("#select-edicao");
const selectorsSectionsModosEdicao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];
const formDisciplina = document.querySelector("#section-disciplina > form");
const formSala = document.querySelector("#section-sala > form");
const formAluno = document.querySelector("#section-aluno > form");
const formNota = document.querySelector("#section-nota > form");

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

// ----- Fomulários -----
/* --- Submissões --- */
formDisciplina.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeDisciplina = [...data.entries()][0][1];

  const novaDisciplina = {
    nome: nomeDisciplina,
  };

  console.log(...data.entries());

  /*
  try {
    const resposta = await adicionarDadoFlask("disciplinas", novaDisciplina);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
  */
});

formSala.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeSala = [...data.entries()][0][1];

  const novaSala = {
    nome: nomeSala,
  };

  console.log(...data.entries());

  /*
  try {
    const resposta = await adicionarDadoFlask("salas", novaSala);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
  */
});

console.log(...data.entries());

formAluno.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeAluno = [...data.entries()][0][1];
  const idSala = [...data.entries()][1][1];

  const novoAluno = {
    nome: nomeAluno,
    id_sala: idSala,
  };

  console.log(...data.entries());

  /*
  try {
    const resposta = await adicionarDadoFlask("alunos", novoAluno);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
  */
});

formNota.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const idNota = [...data.entries()][0][1];
  const idAluno = [...data.entries()][1][1];
  const idDisciplina = [...data.entries()][2][1];
  const idBimestre = [...data.entries()][3][1];
  const valorNota = [...data.entries()][4][1];

  const novaNota = {
    id_aluno: idAluno,
    id_disciplina: idDisciplina,
    id_bimestre: idBimestre,
    valor: valorNota,
  };

  console.log(...data.entries());

  /*
  try {
    const resposta = await atualizarDadoFlask(
      "notas",
      novaNota,
      "id_nota = ?",
      [idNota]
    );
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
  */
});

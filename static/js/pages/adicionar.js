const selectModoAdicao = document.querySelector("#select-adicao");
const selectorsSectionsModosAdicao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];
const formDisciplina = document.querySelector("#section-disciplina > form");
const formSala = document.querySelector("#section-sala > form");
const formAluno = document.querySelector("#section-aluno > form");
const formNota = document.querySelector("#section-nota > form");

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

async function carregarAlunos() {
  const salaId = this.value;
  const alunoSelect = document.getElementById("select-aluno");

  // Limpa opções anteriores
  alunoSelect.innerHTML = '<option value="">Carregando...</option>';

  if (salaId) {
    const response = await fetch(`/api/alunos/${salaId}`);
    const alunos = await response.json();

    // Preenche novamente
    alunoSelect.innerHTML = "";
    alunos.forEach((aluno) => {
      const opt = document.createElement("option");
      opt.value = aluno.id_aluno;
      opt.textContent = aluno.nome;
      alunoSelect.appendChild(opt);
    });

    // Se não houver alunos
    if (alunos.length === 0) {
      alunoSelect.innerHTML =
        '<option value="">Nenhum aluno nesta sala</option>';
    }
  } else {
    alunoSelect.innerHTML =
      '<option value="">Selecione uma sala primeiro</option>';
  }
}

// ----- Fomulários -----
// Verifica se uma sala for escolhida
document
  .querySelector("#select-sala")
  .addEventListener("change", carregarAlunos);

/* --- Submissões --- */
formDisciplina.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeDisciplina = [...data.entries()][0][1];

  const novaDisciplina = {
    nome: nomeDisciplina,
  };

  try {
    const resposta = await adicionarDadoFlask("disciplinas", novaDisciplina);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
});

formSala.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeSala = [...data.entries()][0][1];

  const novaSala = {
    nome: nomeSala,
  };

  try {
    const resposta = await adicionarDadoFlask("salas", novaSala);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
});

formAluno.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const nomeAluno = [...data.entries()][0][1];
  const idSala = [...data.entries()][1][1];

  const novoAluno = {
    nome: nomeAluno,
    id_sala: idSala,
  };

  try {
    const resposta = await adicionarDadoFlask("alunos", novoAluno);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
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
    id_nota: idNota,
    id_aluno: idAluno,
    id_disciplina: idDisciplina,
    id_bimestre: idBimestre,
    valor: valorNota,
  };

  try {
    const resposta = await adicionarDadoFlask("notas", novaNota);
    alert(resposta.mensagem); // Exibe retorno da API
  } catch (erro) {
    alert("Erro ao atualizar nota: " + erro.message);
  }
});

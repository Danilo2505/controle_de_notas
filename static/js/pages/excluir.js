const selectModoExclusao = document.querySelector("#select-exclusao");
const selectorsSectionsModosExclusao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];

const sectionDadoExcluido = document.querySelector("#section-dado-excluido");
const selectDadoExcluido = document.querySelector("#select-dado-excluido");
const divInformacoesDadoExcluido = document.querySelector(
  "#div-informacoes-dado-excluido"
);

const formDisciplina = document.querySelector("#section-disciplina > form");
const formSala = document.querySelector("#section-sala > form");
const formAluno = document.querySelector("#section-aluno > form");
const formNota = document.querySelector("#section-nota > form");

// ----- Funções de interface -----
async function carregarDadosDisponiveis(modoSelecionado) {
  let listaDados, option;

  selectDadoExcluido.replaceChildren(); // Limpa opções anteriores

  switch (modoSelecionado) {
    case "disciplina":
      listaDados = await listarDadosFlask("disciplinas");
      listaDados.forEach((dado) => {
        option = new Option(dado.nome, dado.id_disciplina);
        selectDadoExcluido.add(option);
      });
      break;

    case "sala":
      listaDados = await listarDadosFlask("salas");
      listaDados.forEach((dado) => {
        option = new Option(dado.nome, dado.id_sala);
        selectDadoExcluido.add(option);
      });
      break;

    case "aluno":
      listaDados = await listarDadosFlask("alunos");
      listaDados.forEach((dado) => {
        option = new Option(`${dado.nome} | ${dado.nome_sala}`, dado.id_aluno);
        selectDadoExcluido.add(option);
      });
      break;

    case "nota":
      const listaNotas = await listarNotasCompletasFlask();

      selectDadoExcluido.replaceChildren();

      for (const nota of listaNotas) {
        const textoOption = `${nota.nome_sala} | ${nota.nome_aluno} | ${nota.nome_disciplina} | ${nota.nome_bimestre} | Nota: ${nota.valor}`;
        const option = new Option(textoOption, nota.id_nota);
        selectDadoExcluido.add(option);
      }

      break;
  }
}

function definirModoExclusao(modoSelecionado) {
  selectorsSectionsModosExclusao.forEach((modoExclusao) => {
    document.querySelector(modoExclusao).classList.add("escondido");
  });

  document
    .querySelector(`#section-${modoSelecionado}`)
    .classList.remove("escondido");
}

selectModoExclusao.addEventListener("change", async function () {
  definirModoExclusao(this.value);
  await carregarDadosDisponiveis(this.value);
});

// Atualiza a interface
async function atualizarInterface() {
  const modoAtual = selectModoExclusao.value;
  definirModoExclusao(modoAtual);
  await carregarDadosDisponiveis(modoAtual);
}

// ----- Fomulários -----
// --- Submissões ---
formDisciplina.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idDisciplina = selectDadoExcluido.value;

  try {
    await excluirDadoFlask("disciplinas", "id_disciplina = ?", [idDisciplina]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar disciplina:", erro);
  }
});

formSala.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idSala = selectDadoExcluido.value;

  try {
    await excluirDadoFlask("salas", "id_sala = ?", [idSala]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar sala:", erro);
  }
});

formAluno.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idAluno = selectDadoExcluido.value;

  try {
    await excluirDadoFlask("alunos", "id_aluno = ?", [idAluno]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar aluno:", erro);
  }
});

formNota.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);

  const idNota = selectDadoExcluido.value;

  try {
    await excluirDadoFlask("notas", "id_nota = ?", [idNota]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar nota:", erro);
  }
});

// Primeira execução
atualizarInterface();

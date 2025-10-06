const selectModoEdicao = document.querySelector("#select-edicao");
const selectorsSectionsModosEdicao = [
  "#section-disciplina",
  "#section-sala",
  "#section-aluno",
  "#section-nota",
];

const sectionDadoEditado = document.querySelector("#section-dado-editado");
const selectDadoEditado = document.querySelector("#select-dado-editado");
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

  selectDadoEditado.replaceChildren(); // Limpa opções anteriores

  switch (modoSelecionado) {
    case "disciplina":
      listaDados = await listarDadosFlask("disciplinas");
      listaDados.forEach((dado) => {
        option = new Option(dado.nome, dado.id_disciplina);
        selectDadoEditado.add(option);
      });
      break;

    case "sala":
      listaDados = await listarDadosFlask("salas");
      listaDados.forEach((dado) => {
        option = new Option(dado.nome, dado.id_sala);
        selectDadoEditado.add(option);
      });
      break;

    case "aluno":
      listaDados = await listarDadosFlask("alunos");
      listaDados.forEach((dado) => {
        option = new Option(`${dado.nome} | ${dado.nome_sala}`, dado.id_aluno);
        selectDadoEditado.add(option);
      });
      break;

    case "nota":
      const listaNotas = await listarNotasCompletasFlask();

      selectDadoEditado.replaceChildren();

      for (const nota of listaNotas) {
        const textoOption = `${nota.nome_sala} | ${nota.nome_aluno} | ${nota.nome_disciplina} | ${nota.nome_bimestre} | Nota: ${nota.valor}`;
        const option = new Option(textoOption, nota.id_nota);
        selectDadoEditado.add(option);
      }

      break;
  }
}

function definirModoEdicao(modoSelecionado) {
  selectorsSectionsModosEdicao.forEach((modoEdicao) => {
    document.querySelector(modoEdicao).classList.add("escondido");
  });

  document
    .querySelector(`#section-${modoSelecionado}`)
    .classList.remove("escondido");
}

selectModoEdicao.addEventListener("change", async function () {
  definirModoEdicao(this.value);
  await carregarDadosDisponiveis(this.value);
});

// Atualiza a interface
async function atualizarInterface() {
  const modoAtual = selectModoEdicao.value;
  definirModoEdicao(modoAtual);
  await carregarDadosDisponiveis(modoAtual);
}

// ----- Fomulários -----
// --- Submissões ---
formDisciplina.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const idDisciplina = selectDadoEditado.value;
  const nomeDisciplina = data.get("nome");

  const disciplinaAtualizada = { nome: nomeDisciplina };

  try {
    await atualizarDadoFlask(
      "disciplinas",
      disciplinaAtualizada,
      "id_disciplina = ?",
      [idDisciplina]
    );
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar disciplina:", erro);
  }
});

formSala.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const idSala = selectDadoEditado.value;
  const nomeSala = data.get("nome");

  const salaAtualizada = { nome: nomeSala };

  try {
    await atualizarDadoFlask("salas", salaAtualizada, "id_sala = ?", [idSala]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar sala:", erro);
  }
});

formAluno.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const idAluno = selectDadoEditado.value;
  const nomeAluno = data.get("nome");
  const idSala = data.get("id_sala");

  const alunoAtualizado = { nome: nomeAluno, id_sala: idSala };

  try {
    await atualizarDadoFlask("alunos", alunoAtualizado, "id_aluno = ?", [
      idAluno,
    ]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar aluno:", erro);
  }
});

formNota.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);

  const idNota = selectDadoEditado.value;
  const valorNota = data.get("valor");

  const notaAtualizada = {
    valor: valorNota,
  };

  try {
    await atualizarDadoFlask("notas", notaAtualizada, "id_nota = ?", [idNota]);
    await atualizarInterface();
  } catch (erro) {
    console.error("Erro ao atualizar nota:", erro);
  }
});

// Primeira execução
atualizarInterface();

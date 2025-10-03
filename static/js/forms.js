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

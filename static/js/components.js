function criarComponenteTopBar() {
  const expandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16" style="display: block;">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>`;

  // ----- <div> Top Bar, barra de título -----
  const divTopBar = document.querySelector("#div-top-bar");

  // --- Botão para expandir ou colapsar os links ---
  const buttonExpandCollapseLinks = document.createElement("button");

  buttonExpandCollapseLinks.id = "button-collapse-expand-links";
  buttonExpandCollapseLinks.classList.add("escondido");
  buttonExpandCollapseLinks.innerHTML = expandSvg;

  divTopBar.appendChild(buttonExpandCollapseLinks);

  // --- Lista de links ---
  const ulTopBar = document.createElement("ul");
  const linksTopBar = [
    { href: "/", text: "Listar" },
    { href: "/adicionar.html", text: "Adicionar" },
    { href: "/atualizar.html", text: "Atualizar" },
    { href: "/excluir.html", text: "Excluir" },
  ];

  ulTopBar.id = "ul-top-bar-links";
  ulTopBar.classList.add("escondido");

  // Percorre os links
  linksTopBar.forEach((link) => {
    // Cria um <li> e depois um <a>
    const li = document.createElement("li");
    const a = document.createElement("a");
    // Escreve o link e texto do <a>
    a.href = link.href;
    a.textContent = link.text;
    // Acrescenta o <a> ao <li> e depois o <li> à <ul>
    li.appendChild(a);
    ulTopBar.appendChild(li);
  });

  // Adiciona os elementos na divTopBar
  divTopBar.appendChild(ulTopBar);
}

function configurarEventListenersComponente() {
  const buttonExpandCollapseLinks = document.querySelector(
    "#button-collapse-expand-links"
  );
  const ulTopBarLinks = document.querySelector("#ul-top-bar-links");

  // Controla a expansão ou colapso dosl links da Top Bar
  buttonExpandCollapseLinks.addEventListener("click", () => {
    const expandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16" style="display: block;">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>`;
    const collapseSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" style="display: block;">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>`;

    if (ulTopBarLinks.classList.contains("escondido")) {
      ulTopBarLinks.classList.remove("escondido");
      buttonExpandCollapseLinks.innerHTML = collapseSvg;
    } else {
      ulTopBarLinks.classList.add("escondido");
      buttonExpandCollapseLinks.innerHTML = expandSvg;
    }
  });
}

criarComponenteTopBar();
configurarEventListenersComponente();

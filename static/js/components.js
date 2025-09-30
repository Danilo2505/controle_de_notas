let fragmento;

// ----- <div> Top Bar, barra de título -----
const divTopBar = document.querySelector("#div-top-bar");

// Lista de Links
const ulTopBar = document.createElement("ul");
const linksTopBar = [
  { href: "/", text: "Listar" },
  { href: "/adicionar.html", text: "Adicionar" },
  { href: "/atualizar.html", text: "Atualizar" },
  { href: "/excluir.html", text: "Excluir" },
];

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

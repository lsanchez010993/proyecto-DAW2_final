function formatearGenero(genero) {
  if (!genero) return "";

  const generosFemeninos = [
    "Fantasía",
    "Ciencia Ficción",
    "Aventura",
    "Novela Histórica",
    "Poesía",
    "Biografía",
    "Ficción Contemporánea",
  ];

  // Si el género está en la lista de femeninos, usa "la". Si no, usa "el".
  const articulo = generosFemeninos.includes(genero) ? "la" : "el";

  return `${articulo} ${genero}`;
}

export default formatearGenero;

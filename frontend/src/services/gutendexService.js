import axios from 'axios';
import { APP_MESSAGES } from "../constants/messages";

const mapaCategorias = {
  "terror": ["horror", "ghost stories", "gothic", "supernatural", "vampires"],
  "romance": ["romance", "love stories", "courtship"],
  "fantasía": ["fantasy", "fairy tales", "mythology", "magic"],
  "ciencia ficción": ["science fiction", "dystopian", "future"],
  "aventura": ["adventure", "action", "sea stories", "survival"],
  "misterio": ["mystery", "detective", "crime", "suspense"],
  "novela histórica": ["history", "historical fiction", "biography"],
  "poesía": ["poetry", "sonnets", "ballads"],
  "literatura": ["literature", "classics", "essays"]
};

// [NUEVO] Añadimos el parámetro idioma con valor por defecto 'es'
export const buscarLibrosGratuitosPorGenero = async (genero, idioma = 'es') => {
  try {
    const generoMin = genero ? genero.trim().toLowerCase() : "literatura";
    const terminosBusqueda = mapaCategorias[generoMin] || ["fiction"];
    
    // [MODIFICADO] Inyectamos la variable idioma en la URL
    const promesas = terminosBusqueda.map(termino => 
      axios.get(`https://gutendex.com/books/?topic=${encodeURIComponent(termino)}&languages=${idioma}`)
    );

    const respuestas = await Promise.all(promesas);
    const todosLosLibros = respuestas.flatMap(res => res.data.results || []);

    const librosUnicos = Array.from(
      new Map(todosLosLibros.map(libro => [libro.id, libro])).values()
    );

    return librosUnicos.slice(0, 20); // Devolvemos los 20 mejores

  } catch (error) {
    console.error(APP_MESSAGES.ERRORS.GUTENDEX_ERROR, error);
    return [];
  }
};
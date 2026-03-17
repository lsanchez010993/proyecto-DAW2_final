import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const buscarLibrosGoogle = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${query}&key=${API_KEY}&maxResults=10&langRestrict=es`);
    return response.data.items || [];
  } catch (error) {
    console.error("Error consultando Google Books:", error);
    return [];
  }
};
export const buscarLibrosGratuitos = async () => {
  try {

    const response = await axios.get(`${BASE_URL}?q=ficción&filter=free-ebooks&key=${API_KEY}&maxResults=12&langRestrict=es`);
    return response.data.items || [];
  } catch (error) {
    console.error("Error al buscar libros gratuitos:", error);
    return [];
  }
};
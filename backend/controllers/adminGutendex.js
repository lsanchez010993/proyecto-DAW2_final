const express = require("express");
const router = express.Router();
const axios = require("axios");
const LibroGratuito = require("../models/LibroGratuito");
const verificarToken = require("../middleware/auth");
const MESSAGES = require("../constants/messages");


function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const mapaCategorias = {
  Fantasía: ["fantasy", "fairy tales", "mythology", "magic"],
  Terror: ["horror", "ghost stories", "gothic", "supernatural", "vampires"],
  Romance: ["romance", "love stories", "courtship"],
  "Ciencia Ficción": ["science fiction", "dystopian", "future"],
  Aventura: ["adventure", "action", "sea stories", "survival"],
  Misterio: ["mystery", "detective", "crime", "suspense"],
  "Novela Histórica": ["history", "historical fiction", "biography"],
  Poesía: ["poetry", "sonnets", "ballads"],
  Literatura: ["literature", "classics", "essays"],
};

// ==========================================
// RUTA MAESTRA: IMPORTAR LIBROS (ESTABLE Y OPTIMIZADA)
// ==========================================
async function sincronizarGutendex(req, res) {
  try {
    const idiomas = ["es", "en"];
    let totalImportados = 0;

    console.log("🚀 Iniciando sincronización masiva...");

    for (const idioma of idiomas) {
      for (const [nombreCategoria, terminosIngles] of Object.entries(mapaCategorias)) {
        console.log(`Buscando libros de ${nombreCategoria} en ${idioma}...`);

        let librosValidos = []; // Nuestra "caja temporal"
        const idsIncluidos = new Set();

        // 1. PETICIONES A LA API (SECUENCIALES Y EDUCADAS PARA NO SER BANEADOS)
        for (const termino of terminosIngles) {
          if (librosValidos.length >= 50) break; // Si ya tenemos 50, no pedimos más a la API

          const url = `https://gutendex.com/books/?topic=${encodeURIComponent(termino)}&languages=${idioma}`;

          try {
            const respuesta = await axios.get(url);
            const librosGutendex = respuesta.data.results || [];

            for (const libro of librosGutendex) {
              if (librosValidos.length >= 50) break;

              const portada = libro.formats["image/jpeg"];
              const epub = libro.formats["application/epub+zip"];
              const html = libro.formats["text/html"];
              const textoPlano = libro.formats["text/plain; charset=utf-8"];
              const linkDescarga = epub || html || textoPlano;

              // Filtro estricto: Portada real y enlace válido
              if (portada && linkDescarga && !idsIncluidos.has(libro.id)) {
                idsIncluidos.add(libro.id);
                librosValidos.push({
                  gutendex_id: libro.id,
                  titulo: libro.title,
                  autor: libro.authors?.[0]?.name || "Autor Clásico",
                  portada_url: portada,
                  enlace_descarga: linkDescarga,
                  categoria_tienda: nombreCategoria,
                  idioma: idioma,
                  fecha_actualizacion: new Date(),
                });
              }
            }
          } catch (err) {
            console.error(`⚠️ Gutendex rechazó la conexión en '${termino}'. Saltando...`);
          }

          // Pausa de 600ms obligatoria para calmar a los servidores de Gutendex
          // (evitamos dormir si ya hemos alcanzado 50)
          if (librosValidos.length < 50) {
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
        }

        // 2. GUARDADO EN BASE DE DATOS (BULK, MÁS RÁPIDO)
        if (librosValidos.length > 0) {
          const ops = librosValidos.map((datosLibro) => ({
            updateOne: {
              filter: { gutendex_id: datosLibro.gutendex_id },
              update: { $set: datosLibro },
              upsert: true,
            },
          }));

          await LibroGratuito.bulkWrite(ops, { ordered: false });
          totalImportados += librosValidos.length;
        }
      }
    }

    console.log(`✅ Sincronización TERMINADA con éxito. Guardados/Actualizados: ${totalImportados} libros.`);
    res.json({ message: MESSAGES.LIBROS.SYNC_SUCCESS, total: totalImportados });
  } catch (error) {
    console.error("❌ Error grave en la sincronización:", error);
    res.status(500).json({ message: MESSAGES.LIBROS.SYNC_ERROR });
  }
}

// ==========================================
// RUTA: OBTENER LISTADO (CON FILTROS PARA EL MODAL)
// ==========================================
async function obtenerLibrosGratuitos(req, res) {
  try {
    const { categoria, idioma } = req.query;
    let filtro = {};

    // Si el frontend envía una categoría, filtramos (ignorando mayúsculas/minúsculas)
    if (categoria) {
      const categoriaLimpia = String(categoria).trim();
      if (categoriaLimpia) {
        filtro.categoria_tienda = new RegExp(`^${escapeRegex(categoriaLimpia)}$`, "i");
      }
    }
    // Si el frontend envía un idioma (es/en), filtramos
    if (idioma) {
      const idiomaLimpio = String(idioma).trim().toLowerCase();
      if (idiomaLimpio === "es" || idiomaLimpio === "en") {
        filtro.idioma = idiomaLimpio;
      }
    }

    // Buscamos en MongoDB y ordenamos alfabéticamente (sin límite)
    const libros = await LibroGratuito.find(filtro).sort({ titulo: 1 }).lean();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.LIBROS.FREE_BOOKS_ERROR });
  }
}
module.exports = {
  sincronizarGutendex,
  obtenerLibrosGratuitos,
};

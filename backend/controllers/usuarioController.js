const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const MESSAGES = require("../constants/messages");
const Libro = require("../models/Libro");
const Interaccion = require("../models/Interaccion");

// ==========================================
// ACTUALIZAR PERFIL
// ==========================================
async function actualizarPerfil(req, res) {
  try {
    
    const { nombre, apellidos, email, preferencias, direccion } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      {
        nombre,
        apellidos,
        email,
        gustos_literarios: preferencias,
        direccion,
      },
      { new: true, runValidators: true },
    ).select("-password");
//new: true, runValidators: true:
//se utiliza para que se actualice el usuario y se validen los campos

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    // Error por nombre o email duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El nombre de usuario o email ya está en uso.",
      });
    }

    res.status(500).json({ message: MESSAGES.USUARIOS.UPDATE_ERROR });
  }
}

// ==========================================
// ACTUALIZAR LISTA DE DESEOS
// ==========================================
async function actualizarListaDeseos(req, res) {
  try {
    const { libroId } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    // FindIndex para convertir ambos a String para una comparación exacta
    const index = usuario.lista_deseos.findIndex((id_guardado) => id_guardado.toString() === libroId.toString());

    if (index === -1) {
      // Si no está, lo añade
      usuario.lista_deseos.push(libroId);
    } else {
      // Si ya está, lo elimina
      usuario.lista_deseos.splice(index, 1);
    }

    await usuario.save();

    // Devolver la lista actualizada para que React pinte/despinte el corazón
    res.json({ lista_deseos: usuario.lista_deseos });
  } catch (error) {
    console.error("Error en lista de deseos:", error);
    res.status(500).json({ message: MESSAGES.USUARIOS.WISHLIST_ERROR });
  }
}

// ==========================================
// OBTENER LISTA DE DESEOS (Usuario logueado)
// ==========================================
async function listarDeseos(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .populate({
        path: "lista_deseos",
        select: "titulo autor portada_url precio editorial categorias stock",
      })
      .select("lista_deseos");

    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    return res.json({ data: usuario.lista_deseos || [] });
  } catch (error) {
    console.error("Error al obtener lista de deseos:", error);
    return res.status(500).json({ message: MESSAGES.USUARIOS.WISHLIST_ERROR });
  }
}

// ==========================================
// CAMBIAR CONTRASEÑA
// ==========================================
async function cambiarPassword(req, res) {
  try {
    const { actual, nueva } = req.body;
    const usuario = await Usuario.findById(req.usuario.id); //

    // 1. Verificar si la contraseña actual es correcta
    if (!verificarPassword(nueva)) {
      return res.status(401).json({ message: "La nueva contraseña no es valida. Debe tener al menos 6 caracteres y al menos una mayúscula." });
    }
    const esValida = await bcrypt.compare(actual, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "La contraseña actual no es correcta." });
    }

    // 2. Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(nueva, salt);

    // 3. Guardar cambios
    await usuario.save();
    res.json({ message: MESSAGES.USUARIOS.PASSWORD_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}
function verificarPassword(password) {
  if (password.length < 6) {
    return false;
  }
  if (!password.match(/[A-Z]/, /[a-z]/, /[0-9]/)) {
    return false;
  }
  return true;
}
// ==========================================
// HISTORIAL: COMPRAS (Usuario logueado)
// ==========================================
async function listarCompras(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .populate({
        path: "biblioteca_digital.libro",
        select: "titulo autor portada_url precio editorial categorias",
      })
      .select("biblioteca_digital");

    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    const compras = (usuario.biblioteca_digital || [])
      .map((item) => ({
        fecha_compra: item.fecha_compra,
        tipo_compra: item.tipo_compra,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        libro: item.libro || null,
      }))
      .sort((a, b) => new Date(b.fecha_compra) - new Date(a.fecha_compra));

    return res.json({ data: compras });
  } catch (error) {
    console.error("Error al obtener compras:", error);
    return res.status(500).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}

// ==========================================
// REGISTRAR COMPRA (Simulación)
// ==========================================
async function compraSimulada(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    // Normalizar + validar
    const itemsNormalizados = items.map((it) => ({
      libroId: it?.libroId,
      tipo_compra: it?.tipo_compra === "digital" ? "digital" : "fisico",
      cantidad: Math.max(1, parseInt(it?.cantidad, 10) || 1),
    }));

    // Cargar libros y validar existencia
    const ids = itemsNormalizados.map((it) => it.libroId).filter(Boolean);
    const libros = await Libro.find({ _id: { $in: ids } });
    const mapLibros = new Map(libros.map((l) => [l._id.toString(), l]));

    for (const it of itemsNormalizados) {
      const libro = mapLibros.get(String(it.libroId));
      if (!libro) {
        return res.status(404).json({ message: "Libro no encontrado." });
      }

      const precioUnitario = libro.precio?.[it.tipo_compra] || 0;

      // Si es físico, comprobar stock y reducirlo
      if (it.tipo_compra === "fisico") {
        if ((libro.stock || 0) < it.cantidad) {
          return res.status(400).json({
            message: `Stock insuficiente para "${libro.titulo}".`,
          });
        }
        libro.stock = (libro.stock || 0) - it.cantidad;
      }

      // Subir contador ventas
      libro.ventas = (libro.ventas || 0) + it.cantidad;

      usuario.biblioteca_digital.push({
        libro: libro._id,
        tipo_compra: it.tipo_compra,
        cantidad: it.cantidad,
        precio_unitario: precioUnitario,
        fecha_compra: new Date(),
      });

      await libro.save();
    }

    await usuario.save();

    return res.status(201).json({ message: "Compra registrada correctamente." });
  } catch (error) {
    console.error("Error al registrar compra:", error);
    return res.status(500).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}

// ==========================================
// HISTORIAL: DESCARGAS GRATUITAS (Usuario logueado)
// ==========================================
async function listarDescargasGratuitas(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("historial_descargas_gratuitas");

    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }

    const descargas = (usuario.historial_descargas_gratuitas || [])
      .slice()
      .sort((a, b) => new Date(b.fecha_descarga) - new Date(a.fecha_descarga));

    return res.json({ data: descargas });
  } catch (error) {
    console.error("Error al obtener descargas gratuitas:", error);
    return res.status(500).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}
// ==========================================
// REGISTRAR DESCARGA GRATUITA Y AFINIDAD
// ==========================================
async function registrarDescargasGratuitas(req, res) {
  try {
    const { titulo_guardado, categoria, fecha_descarga, libro_id } = req.body;
    const usuarioId = req.usuario.id;
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.USUARIOS.NOT_FOUND });
    }
    usuario.historial_descargas_gratuitas.push({
      titulo_guardado: titulo_guardado,
      fecha_descarga: new Date(),
      libro_id: libro_id,
    });
    if (categoria) {
      const puntosActuales = usuario.perfil_afinidad.get(categoria) || 0;
      usuario.perfil_afinidad.set(categoria, puntosActuales + 3);
    }
    await usuario.save();
    res.status(200).json({
      message: "Descarga registrada en el historial correctamente",
      afinidad_actualizada: true,
    });
  } catch (error) {
    console.error("Error al registrar la descarga:", error);
    res.status(500).json({ message: MESSAGES.GENERAL.SERVER_ERROR });
  }
}
// ==========================================
// Registrar Interacción y Sumar Afinidad
// ==========================================
async function registrarInteraccionYSumarAfinidad(req, res) {
  try {
    const { libroId, tipoAccion } = req.body;
    const usuarioId = req.usuario.id;
    const nuevaInteraccion = new Interaccion({
      usuario: usuarioId,
      libro: libroId,
      tipo_accion: tipoAccion,
    });
    await nuevaInteraccion.save();
    let puntos = 1;
    if (tipoAccion === "deseo") puntos = 3;
    if (tipoAccion === "carrito") puntos = 5;
    if (tipoAccion === "compra") puntos = 10;

    const libro = await Libro.findById(libroId);

    if (libro && libro.categorias && libro.categorias.length > 0) {
      const usuario = await Usuario.findById(usuarioId);

      // Recorrer las categorías del libro y sumarle los puntos al usuario
      libro.categorias.forEach((categoria) => {
        const puntosActuales = usuario.perfil_afinidad.get(categoria) || 0;
        usuario.perfil_afinidad.set(categoria, puntosActuales + puntos);
      });

      await usuario.save();
    }
    // console.log("llega aqui");

    res.status(200).json({ message: MESSAGES.RECOMENDACIONES.INTERACTION_SUCCESS });
  } catch (error) {
    console.error("Error al registrar interacción:", error);
    res.status(500).json({ message: MESSAGES.RECOMENDACIONES.INTERACTION_ERROR });
  }
}

module.exports = {
  actualizarPerfil,
  actualizarListaDeseos,
  listarDeseos,
  cambiarPassword,
  listarCompras,
  listarDescargasGratuitas,
  compraSimulada,
  registrarDescargasGratuitas,
  registrarInteraccionYSumarAfinidad,
};

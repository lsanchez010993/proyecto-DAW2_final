const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const ResenaLibro = require("../models/ResenaLibro");
const MESSAGES = require("../constants/messages");

function obtenerPaginacion(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function esObjectIdValido(valor) {
  return mongoose.Types.ObjectId.isValid(valor);
}

async function listarResenasPorLibro(req, res) {
  try {
    const { libroId } = req.params;
    if (!esObjectIdValido(libroId)) {
      return res.status(400).json({ message: MESSAGES.RESENAS.BOOK_INVALID });
    }

    const { page, limit, skip } = obtenerPaginacion(req);

    const [totalResenas, resenas, resumen] = await Promise.all([
      ResenaLibro.countDocuments({ libro: libroId }),
      ResenaLibro.find({ libro: libroId })
        .populate("usuario", "nombre avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ResenaLibro.aggregate([
        { $match: { libro: new mongoose.Types.ObjectId(libroId) } },
        {
          $group: {
            _id: null,
            mediaPuntuacion: { $avg: "$puntuacion" },
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const mediaPuntuacion = resumen[0]?.mediaPuntuacion
      ? Number(resumen[0].mediaPuntuacion.toFixed(2))
      : 0;

    return res.json({
      data: resenas,
      resumen: {
        mediaPuntuacion,
        totalResenas,
        paginaActual: page,
        totalPaginas: Math.max(1, Math.ceil(totalResenas / limit)),
      },
    });
  } catch (error) {
    console.error("Error al listar resenas:", error);
    return res.status(500).json({ message: MESSAGES.RESENAS.LIST_ERROR });
  }
}

async function puedeResenar(req, res) {
  try {
    const { libroId } = req.params;
    if (!esObjectIdValido(libroId)) {
      return res.status(400).json({ message: MESSAGES.RESENAS.BOOK_INVALID });
    }

    const usuario = await Usuario.findById(req.usuario.id).select("_id biblioteca_digital.libro");
    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.RESENAS.USER_NOT_FOUND });
    }

    const compraVerificada = (usuario.biblioteca_digital || []).some(
      (item) => String(item.libro) === String(libroId),
    );

    if (!compraVerificada) {
      return res.status(403).json({
        canReview: false,
        message: MESSAGES.RESENAS.FORBIDDEN_NOT_PURCHASED,
      });
    }

    const resenaExistente = await ResenaLibro.findOne({
      usuario: usuario._id,
      libro: libroId,
    }).select("puntuacion resena updatedAt");

    return res.json({
      canReview: true,
      hasReview: Boolean(resenaExistente),
      review: resenaExistente || null,
    });
  } catch (error) {
    console.error("Error al validar permiso de resena:", error);
    return res.status(500).json({ message: MESSAGES.RESENAS.PERMISSION_ERROR });
  }
}

async function upsertResena(req, res) {
  try {
    const { libroId } = req.params;
    const { puntuacion, resena } = req.body;

    if (!esObjectIdValido(libroId)) {
      return res.status(400).json({ message: MESSAGES.RESENAS.BOOK_INVALID });
    }

    if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: MESSAGES.RESENAS.SCORE_INVALID });
    }

    if (resena !== undefined && typeof resena !== "string") {
      return res.status(400).json({ message: MESSAGES.RESENAS.REVIEW_INVALID_TYPE });
    }

    if (typeof resena === "string" && resena.trim().length === 0) {
      return res.status(400).json({ message: MESSAGES.RESENAS.REVIEW_EMPTY });
    }

    const usuario = await Usuario.findById(req.usuario.id).select("_id biblioteca_digital.libro");
    if (!usuario) {
      return res.status(404).json({ message: MESSAGES.RESENAS.USER_NOT_FOUND });
    }

    const compraVerificada = (usuario.biblioteca_digital || []).some(
      (item) => String(item.libro) === String(libroId),
    );

    if (!compraVerificada) {
      return res.status(403).json({ message: MESSAGES.RESENAS.FORBIDDEN_NOT_PURCHASED });
    }

    const payload = {
      puntuacion,
      resena: typeof resena === "string" ? resena.trim() : undefined,
    };

    const resenaExistente = await ResenaLibro.findOne({
      usuario: usuario._id,
      libro: libroId,
    });

    let resultado;
    let created = false;

    if (resenaExistente) {
      resenaExistente.puntuacion = payload.puntuacion;
      if (payload.resena !== undefined) {
        resenaExistente.resena = payload.resena;
      }
      resultado = await resenaExistente.save();
    } else {
      resultado = await ResenaLibro.create({
        usuario: usuario._id,
        libro: libroId,
        ...payload,
      });
      created = true;
    }

    return res.status(created ? 201 : 200).json({
      message: created ? MESSAGES.RESENAS.CREATE_SUCCESS : MESSAGES.RESENAS.UPDATE_SUCCESS,
      data: resultado,
    });
  } catch (error) {
    console.error("Error al guardar resena:", error);
    return res.status(500).json({ message: MESSAGES.RESENAS.SAVE_ERROR });
  }
}

module.exports = {
  listarResenasPorLibro,
  puedeResenar,
  upsertResena,
};

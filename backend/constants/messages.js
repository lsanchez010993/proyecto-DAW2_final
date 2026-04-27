const MESSAGES = {
  GENERAL: {
    SERVER_ERROR: "Error interno del servidor",
    NOT_FOUND: "El recurso solicitado no fue encontrado.",
  },
  USUARIOS: {
    NOT_FOUND: "Usuario no encontrado",
    EMAIL_IN_USE: "El email está en uso",
    CREATE_SUCCESS: "¡Usuario creado con exito",
    SAVE_ERROR: "Error al guardarr",
    INVALID_PASSWORD: "Contraseña incorrecta",
    UPDATE_SUCCESS: "Perfil actualizado con éxito.",
    UPDATE_ERROR: "Error al actualizar el perfil.",
    WISHLIST_ERROR: "Error al actualizar la lista de deseos",
    PASSWORD_SUCCESS: "Contraseña actualizada correctamente",
    DELETE_SUCCESS: "Usuario eliminado correctamente",
    ROLE_UPDATE_ERROR: "Error al actualizar rol y editorial",
    UNAUTHORIZED: "Acceso denegado. Solo admin.",
  },
  LIBROS: {
    NOT_FOUND: "Libro no encontrado",
    CREATE_SUCCESS: "El libro ha sido creado exitosamente.",
    UPDATE_SUCCESS: "Libro actualizado correctamente",
    DELETE_SUCCESS: "Libro eliminado correctamente",
    ISBN_REQUIRED: "El campo ISBN es obligatorio.",
    ISBN_DUPLICATE: "Error: ISBN duplicado.",
    CATEGORY_ERROR: "Error al buscar por categoría",
    AUTHOR_DIR_ERROR: "Error al cargar el directorio",
    SYNC_SUCCESS: "Sincronización exitosa",
    SYNC_ERROR: "Error al sincronizar con Gutendex",
    FREE_BOOKS_ERROR: "Error al obtener el listado de libros gratuitos",
  },
  RECOMENDACIONES: {
    INTERACTION_SUCCESS: "Interacción registrada",
    INTERACTION_ERROR: "Error interno al registrar interacción",
    PRIVATE_ERROR: "Error en recomendaciones privadas",
  }
};

module.exports = MESSAGES;

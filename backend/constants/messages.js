const MESSAGES = {
  GENERAL: {
    SERVER_ERROR: "Error interno del servidor",
    NOT_FOUND: "El recurso solicitado no fue encontrado.",
  },

  USUARIOS: {
    NOT_FOUND: "Usuario no encontrado",
    EMAIL_IN_USE: "El email está en uso",
    CREATE_SUCCESS: "¡Usuario creado con éxito!",
    SAVE_ERROR: "Error al guardar el usuario",
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
  },
  ERRORS_REGISTRO_USER: {
    NOMBRE_USUARIO_EN_USO: "El nombre de usuario está en uso",
    PASSWORD_MAYUSCULA_NUMERO: "La contraseña debe contener al menos una letra mayúscula y un número",
    PASSWORD_LONGITUD: "La contraseña debe tener al menos 6 caracteres",
    PASSWORD_FORMATO: "El formato de la contraseña no es válido",
    EMAIL_FORMATO: "El formato del correo electrónico no es válido",
    CAMPOS_OBLIGATORIOS: "Todos los campos son obligatorios",
    EMAIL_IN_USE: "El email está en uso",
    CREATE_SUCCESS: "¡Cuenta creada con éxito! Redirigiendo...",
    SAVE_ERROR: "Error al guardar el usuario",
  },

  PASSWORD_RESET: {
    EMAIL_REQUIRED: "El correo electrónico es obligatorio",
    TOKEN_REQUIRED: "El token es obligatorio",
    PASSWORD_REQUIRED: "La contraseña es obligatoria",
    FORGOT_SENT: "Correo enviado a: ",
    RESET_SUCCESS: "Contraseña actualizada correctamente",
    TOKEN_INVALID: "El token es inválido o ha expirado",
    EMAIL_SEND_ERROR: "No se pudo enviar el correo de recuperación",
  },
};

module.exports = MESSAGES;

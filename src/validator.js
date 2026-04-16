/**
 * Valida que un email sea un formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }

    // Expresión regular simple pero efectiva para validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida que un string no esté vacío o contenga solo espacios
 * @param {string} str - String a validar
 * @returns {boolean} true si el string tiene contenido
 */
export function isNotEmpty(str) {
    if (typeof str !== 'string') {
        return false;
    }
    return str.trim().length > 0;
}

/**
 * Valida un objeto usuario completo
 * @param {Object} user - Usuario a validar con propiedades name, email, city
 * @returns {Object} Objeto con propiedades isValid (boolean) y errors (array)
 */
export function validateUser(user) {
    const errors = [];

    if (!user || typeof user !== 'object') {
        errors.push('Usuario inválido');
        return { isValid: false, errors };
    }

    if (!isNotEmpty(user.name)) {
        errors.push('El nombre no puede estar vacío');
    }

    if (!isValidEmail(user.email)) {
        errors.push('El email no es válido');
    }

    if (!isNotEmpty(user.city)) {
        errors.push('La ciudad no puede estar vacía');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

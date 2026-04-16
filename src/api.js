const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Obtiene un usuario de la API pública JSONPlaceholder
 * @param {number} userId - ID del usuario a obtener
 * @returns {Promise<Object>} Objeto con datos del usuario (name, email, city)
 * @throws {Error} Si hay error de red o la respuesta es inválida
 */
export async function fetchUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: No se pudo obtener el usuario`);
        }

        const data = await response.json();

        // Extraer solo los campos necesarios
        return {
            name: data.name,
            email: data.email,
            city: data.address?.city || ''
        };
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Error de conexión: No se pudo conectar a la API');
        }
        throw error;
    }
}

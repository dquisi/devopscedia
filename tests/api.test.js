import { jest } from '@jest/globals';
import { fetchUser } from '../src/api.js';

// Mock global fetch
global.fetch = jest.fn();

describe('API - fetchUser', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('obtiene usuario con datos válidos', async () => {
        const mockData = {
            id: 1,
            name: 'Leanne Graham',
            email: 'Bret@april.biz',
            address: {
                city: 'Gwenborough'
            }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const user = await fetchUser(1);

        expect(user).toEqual({
            name: 'Leanne Graham',
            email: 'Bret@april.biz',
            city: 'Gwenborough'
        });
        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
    });

    test('maneja error HTTP', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await expect(fetchUser(999)).rejects.toThrow('Error HTTP 404');
    });

    test('maneja error de conexión', async () => {
        fetch.mockRejectedValueOnce(new TypeError('Network error'));

        await expect(fetchUser(1)).rejects.toThrow('Error de conexión');
    });

    test('maneja respuesta sin ciudad', async () => {
        const mockData = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            address: {}
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const user = await fetchUser(1);

        expect(user).toEqual({
            name: 'John Doe',
            email: 'john@example.com',
            city: ''
        });
    });

    test('maneja respuesta sin address', async () => {
        const mockData = {
            id: 1,
            name: 'Jane Doe',
            email: 'jane@example.com'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const user = await fetchUser(1);

        expect(user).toEqual({
            name: 'Jane Doe',
            email: 'jane@example.com',
            city: ''
        });
    });

    test('maneja error de respuesta incompleta', async () => {
        const mockData = {
            id: 1,
            name: 'Incomplete User'
            // Faltan email y address
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const user = await fetchUser(1);

        expect(user.name).toBe('Incomplete User');
        expect(user.email).toBeUndefined();
        expect(user.city).toBe('');
    });
});

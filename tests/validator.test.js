import { jest } from '@jest/globals';
import { isValidEmail, isNotEmpty, validateUser } from '../src/validator.js';

describe('Validator - isValidEmail', () => {
    test('valida un email correcto', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
    });

    test('rechaza email sin @', () => {
        expect(isValidEmail('userexample.com')).toBe(false);
    });

    test('rechaza email sin dominio', () => {
        expect(isValidEmail('user@')).toBe(false);
    });

    test('rechaza email vacío', () => {
        expect(isValidEmail('')).toBe(false);
    });

    test('rechaza email con tipo incorrecto', () => {
        expect(isValidEmail(123)).toBe(false);
    });

    test('rechaza email con espacios', () => {
        expect(isValidEmail('user @example.com')).toBe(false);
    });
});

describe('Validator - isNotEmpty', () => {
    test('valida string con contenido', () => {
        expect(isNotEmpty('John Doe')).toBe(true);
    });

    test('rechaza string vacío', () => {
        expect(isNotEmpty('')).toBe(false);
    });

    test('rechaza string con solo espacios', () => {
        expect(isNotEmpty('   ')).toBe(false);
    });

    test('rechaza tipo incorrecto', () => {
        expect(isNotEmpty(123)).toBe(false);
    });
});

describe('Validator - validateUser', () => {
    test('valida usuario con datos válidos', () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            city: 'New York'
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    test('rechaza usuario con email inválido', () => {
        const user = {
            name: 'John Doe',
            email: 'invalid-email',
            city: 'New York'
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('El email no es válido');
    });

    test('rechaza usuario con nombre vacío', () => {
        const user = {
            name: '',
            email: 'john@example.com',
            city: 'New York'
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('El nombre no puede estar vacío');
    });

    test('rechaza usuario con ciudad vacía', () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            city: ''
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('La ciudad no puede estar vacía');
    });

    test('rechaza usuario con múltiples errores', () => {
        const user = {
            name: '   ',
            email: 'invalid',
            city: null
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
    });

    test('rechaza usuario null', () => {
        const result = validateUser(null);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Usuario inválido');
    });

    test('rechaza respuesta incompleta de la API', () => {
        const user = {
            name: 'John Doe'
            // Faltan email y city
        };
        const result = validateUser(user);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

import http from 'k6/http';
import { check } from 'k6';

const LOGIN_URL = 'https://fakestoreapi.com/auth/login';

/**
 * Realiza una petición POST al endpoint de login.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña.
 * @returns {Object} El objeto de respuesta de k6.
 */
export function login(username, password) {
  const payload = JSON.stringify({
    username: username,
    password: password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(LOGIN_URL, payload, params, { tags: { name: 'LoginEndpoint' } });

  check(res, {
    'Status es 201': (r) => r.status === 201,
    'Contiene el token de autenticación': (r) => r.json() && r.json().hasOwnProperty('token'),
  });

  return res;
}
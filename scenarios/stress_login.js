import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { login } from '../modules/api/auth_login.js';
import { sleep } from 'k6';
import { check } from 'k6';


const userData = new SharedArray('CSV Users', function () {
  return papaparse.parse(open('../data/data_test.csv'), { header: true }).data;
});

export const options = {
  scenarios: {
    stress_test_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 250 },
        { duration: '5m', target: 250 },
        { duration: '1m', target: 0 }, 
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    'http_req_duration{name:LoginEndpoint}': ['p(99) < 5000'],
    'http_req_failed': ['rate < 0.10'],
    'checks{name:LoginEndpoint}': ['rate >= 0.90'],
  },
};

export default function () {
  const userIndex = __VU % userData.length;
  const user = userData[userIndex];

  const res = login(user.user, user.passwd);

  check(res, {
    'Aserción: Token no es vacío': (r) => r.json('token') && r.json('token').length > 0,
  });

  check(res, {
    'Aserción: Petición es rápida (< 3s)': (r) => r.timings.duration < 3000,
}, { check_group: 'latencia_critica' });

  check(res, {
    'Aserción: Tamaño de respuesta > 20 bytes': (r) => r.body.length > 20,
  });

  sleep(0.5); 
}
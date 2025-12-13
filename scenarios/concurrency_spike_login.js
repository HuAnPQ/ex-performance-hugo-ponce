import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { login } from '../modules/api/auth_login.js'; 
import { sleep, check } from 'k6';

const userData = new SharedArray('CSV Users', function () {
  return papaparse.parse(open('../data/data_test.csv'), { header: true }).data;
});

const MAX_VUS_SPIKE = 150; 

export const options = {
  scenarios: {
    concurrency_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: MAX_VUS_SPIKE }, 
        { duration: '3m', target: MAX_VUS_SPIKE }, 
        { duration: '30s', target: 0 }, 
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95) < 2000'],
    'http_req_failed': ['rate < 0.01'],
    'checks': ['rate >= 0.99'],
    'http_req_duration{name:LoginEndpoint}': ['p(95) < 2000'],
  },
};

export default function () {
  const userIndex = __VU % userData.length;
  const user = userData[userIndex];

  const res = login(user.user, user.passwd);

  // Aserciones Críticas de Concurrencia:
  check(res, {
    'Aserción: Conexión rápida (< 500ms)': (r) => r.timings.connecting < 500,
  });

  check(res, {
    'Aserción: Token de Login no es nulo': (r) => r.json('token') !== null,
  });
  sleep(0.5); 
}
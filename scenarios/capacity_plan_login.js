import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { login } from '../modules/api/auth_login.js';
import { sleep, check } from 'k6';

const userData = new SharedArray('CSV Users', function () {
    return papaparse.parse(open('../data/data_test.csv'), { header: true }).data;
});

export const options = {
    scenarios: {
        capacity_staircase: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                // NIVEL 1: Base (50 VUs)
                { duration: '2m', target: 50 },
                { duration: '3m', target: 50 },
                // NIVEL 2: Crecimiento (100 VUs)
                { duration: '2m', target: 100 },
                { duration: '3m', target: 100 },
                // NIVEL 3: Límite proyectado (150 VUs)
                { duration: '2m', target: 150 },
                { duration: '3m', target: 150 },
                // NIVEL 4: Saturación (200 VUs)
                { duration: '2m', target: 200 },
                { duration: '3m', target: 200 },
            ],
        },
    },

    thresholds: {
        'http_req_duration{name:LoginEndpoint}': ['p(95) < 1500'],
        'http_req_failed': ['rate < 0.01'],
    },
};

export default function () {
    const userIndex = __VU % userData.length;
    const user = userData[userIndex];

    const res = login(user.user, user.passwd);

    check(res, {
        'Capacidad: Status 200/201': (r) => r.status === 200 || r.status === 201,
        'Capacidad: Token presente': (r) => r.json('token') !== undefined,
        'Aserción: Token de Login no es nulo': (r) => r.json('token') !== null,
    });

    sleep(0.5);
}
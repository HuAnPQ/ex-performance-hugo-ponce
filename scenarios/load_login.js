import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { login } from '../modules/api/auth_login.js';
import { sleep } from 'k6';

const userData = new SharedArray('CSV Users', function () {
  return papaparse.parse(open('../data/data_test.csv'), { header: true }).data;
});

export const options = {
  thresholds: {
    'http_req_duration{name:LoginEndpoint}': ['p(95) < 1500'],     
    'checks{name:LoginEndpoint}': ['rate>0.97'],
    'http_req_failed': ['rate<0.03'], 
  },
  
  scenarios: {
    constant_rate_test: {
      executor: 'constant-arrival-rate',
      rate: 20, 
      duration: '5m',
      preAllocatedVUs: 10, 
      maxVUs: 50,
    },
  },
};

export default function () {
  const userIndex = __VU % userData.length;
  const user = userData[userIndex];

  login(user.user, user.passwd);
  sleep(0.1); 
}
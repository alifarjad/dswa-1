import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = __ENV.APP_URL;

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats : ["avg", "med", "p(95)", "p(99)"],
  summaryTimeUnit: 'ms'
};

export default () => {

  http.post(`${BASE_URL}/url`, 
  JSON.stringify({
    url: 'http://'+randomIntBetween(1, 50000)
  }), 
  {
    headers: { 'Content-Type': 'application/json' },
  })

};
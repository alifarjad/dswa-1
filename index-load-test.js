import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.APP_URL;

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats : ["avg", "med", "p(95)", "p(99)"],
  summaryTimeUnit: 'ms'
};

export default () => {
  
  http.get(`${BASE_URL}/`);

};
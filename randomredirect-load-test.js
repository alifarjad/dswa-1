import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.APP_URL;

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats : ["avg", "med", "p(95)", "p(99)"],
  summaryTimeUnit: 'ms'
};

export function setup() {
  http.batch([
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://facebook.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  },
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://instagram.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  },
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://google.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  },
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://cnn.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  },
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://theverge.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  },
  {
    method: 'POST',
    url: `${BASE_URL}/url`,
    body: JSON.stringify({
      url: 'http://bbc.com'
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    }
  }])
}

export default () => {
  
  http.get(`${BASE_URL}/random`, { redirects: 0});

};
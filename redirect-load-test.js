import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.APP_URL;

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats : ["avg", "med", "p(95)", "p(99)"],
  summaryTimeUnit: 'ms'
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function setup() {
  let result = http.batch([
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
  return result.map((result) => {console.log(result.json().shortened); return result.json().shortened})
}

export default (result) => {

  let item = result[Math.floor(Math.random()*result.length)];

  http.get(item, { redirects: 0});

};
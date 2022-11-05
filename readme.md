# CS-E4770 - Project 1

## Url shortener

There are three implementation for the server: Flask, FastAPI, Express.js. A server has the following endpoints:
- `GET /` Serves the webpage
- `GET/<shortened>` Redirects to the url mapped to the value `<shortened>` and returns a `404 Not found` error if the provided value is incorrect.
- `GET /random` Redirects to a random url that the server has mapped and return a 404 error if there aren't value present
- `POST /url` Allows to request a shortened url from the server. The url needs to start with either `http://` or `https://` otherwise it will return a `400 Bad request` error. The following is an example of a valid request:
    ```
    {
        "url" : "http://facebook.com"
    }
    ```
The webpage has a simple ui where there are a text input field and two buttons. The button `Shorten` will send a request to shorten the url specified in the text field. The button `I'm feeling lucky` will take the user to a url that the server has mapped.
Each server is coupled with its own instance of PostgreSQL and is listening for traffic on different ports, to be specific:
- FastAPI server is listening on port 5000
- Flask server is listening on port 5001
- ExpressJS server is listening on port 5002


## How to run

To run the servers you need to install Docker, the version used at development time was `20.10.18, build b40c2f6`.
Go in the projects folder

### For Flask
    # To run
    cd flaskapi/
    docker compose build
    docker compose up --attach backend
    # To stop
    cd flaskapi/
    docker compose down
    docker compose kill (if the one above does not work)

### For FastAPI
    # To run
    cd fastapi/
    docker compose build
    docker compose up --attach backend
    # To stop
    cd fastapi/
    docker compose down
    docker compose kill (if the one above does not work)

### For ExpressJS
    # To run
    cd nodeapi/
    docker compose build
    docker compose up --attach backend
    # To stop
    cd nodeapi/
    docker compose down
    docker compose kill (if the one above does not work)

All the servers can be run together since they do not share the same DBMS instance and listen on different ports.

## Testing

To test the application you need to install k6 in order to run the scripts. In order to run the tests you need to be in the project directory and the application you want to test running. It is advisable to run just one backend at a time if you don't have a powerful machine since it might affect performance. The test are run simulating a load of 10 users over 10 seconds.

### FastAPI backend
    
- For `GET /` run `k6 run -e APP_URL=http://localhost:5000 index-load-test.js`
- For `GET /<shortened_url>` run `k6 run -e APP_URL=http://localhost:5000 redirect-load-test.js`
- For `GET /random` run `k6 run -e APP_URL=http://localhost:5000 randomredirect-load-test.js`
- For `POST /url` run `k6 run -e APP_URL=http://localhost:5000 url-load-test.js`

### Flask backend
    
- For `GET /` run `k6 run -e APP_URL=http://localhost:5001 index-load-test.js`
- For `GET /<shortened_url>` run `k6 run -e APP_URL=http://localhost:5001 redirect-load-test.js`
- For `GET /random` run `k6 run -e APP_URL=http://localhost:5001 randomredirect-load-test.js`
- For `POST /url` run `k6 run -e APP_URL=http://localhost:5001 url-load-test.js`

### Express backend
    
- For `GET /` run `k6 run -e APP_URL=http://localhost:5002 index-load-test.js`
- For `GET /<shortened_url>` run `k6 run -e APP_URL=http://localhost:5002 redirect-load-test.js`
- For `GET /random` run `k6 run -e APP_URL=http://localhost:5002 randomredirect-load-test.js`
- For `POST /url` run `k6 run -e APP_URL=http://localhost:5002 url-load-test.js`

## Load testing results:

### `GET \`
| Framework | avg response time    | med response time     | p(95) response time   | p(99) response time   | avg requests/second |
| --------- | -------------------- | --------------------- | --------------------- | --------------------- | ------------------- |
| Flask     | 12.74ms              | 12.65ms               | 14.51ms               | 16.20ms               | 776                 |
| FastAPI   | 7.21ms               | 7.20ms                | 8.09ms                | 8.80ms                | 1354                |
| ExpressJS | 4.42ms               | 4.06ms                | 6.95ms                | 8.88ms                | 2288                |

### `GET \<shortened_url>`
| Framework | avg response time    | med response time     | p(95) response time   | p(99) response time   | avg requests/second |
| --------- | -------------------- | --------------------- | --------------------- | --------------------- | ------------------- |
| Flask     | 24.20ms              | 23.86ms               | 29.54ms               | 34.35ms               | 417                 |
| FastAPI   | 17.78ms              | 17.45ms               | 21.12ms               | 24.36ms               | 553                 |
| ExpressJS | 7.37ms               | 6.60ms                | 11.01ms               | 14.30ms               | 1385                |

### `GET \random`
| Framework | avg response time    | med response time     | p(95) response time   | p(99) response time   | avg requests/second |
| --------- | -------------------- | --------------------- | --------------------- | --------------------- | ------------------- |
| Flask     | 23.24ms              | 23.00ms               | 28.68ms               | 32.18ms               | 429                 |
| FastAPI   | 17.48ms              | 17.23ms               | 20.29ms               | 22.22ms               | 386                 |
| ExpressJS | 6.70ms               | 6.02ms                | 10.12ms               | 13.27ms               | 1232                |

### `POST \url`
| Framework | avg response time    | med response time     | p(95) response time   | p(99) response time   | avg requests/second |
| --------- | -------------------- | --------------------- | --------------------- | --------------------- | ------------------- |
| Flask     | 30.00ms              | 29.71ms               | 39.09ms               | 43.55ms               | 329                 |
| FastAPI   | 38.71ms              | 37.61ms               | 45.22ms               | 50.58ms               | 253                 |
| ExpressJS | 15.44ms              | 14.01ms               | 20.91ms               | 25.05ms               | 715                 |


To improve the performance of this solution we have two solutions: giving more power to the machines hosting our application or putting a load balancer between the user and the application in order to have multiple instances of the application and distribute requests equally. In the second solution the data of the DBMS instances should be shared in order to guarantee the same data to every instance of the backend. The first solultion is not feasible in real world scenario because distributing the traffic over a lot of machines is much realistic and cheap rather to have the application running on a super computer. The second solution also gurantees better resilience in case one of the instances crashes because the load balancer would compensate with the rest of the running instances. Application wise i would get a more better implementation to generate a random ID for the url mapping since in all the three implementations it is done in a very trivial way. 
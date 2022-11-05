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
    ```
    # To run
    cd nodeapi/
    docker compose build
    docker compose up --attach backend
    # To stop
    cd nodeapi/
    docker compose down
    docker compose kill (if the one above does not work)
    ```

All the servers can be run together since they do not share the same DBMS instance and listen on different ports.

## Testing

To test the application you need to install k6 in order to run the scripts. In order to run the tests you need to be in the project directory and the application you want to test running. It is advisable to run just one backend at a time if you don't have a powerful machine since it might affect performance.

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
|           | avg     | med     | p(95)   | p(99)   | requests/second |
| --------- | ------- | ------- | ------- | ------- | --------------- |
| Flask     | 12.74ms | 12.65ms | 14.51ms | 16.20ms | 776             |
| FastAPI   | 7.21ms  | 7.20ms  | 8.09ms  | 8.80ms  | 1354            |
| ExpressJS | 4.42ms  | 4.06ms  | 6.95ms  | 8.88ms  | 2288            |

### `GET \<shortened_url>`
|           | avg     | med     | p(95)   | p(99)   | requests/second |
| --------- | ------- | ------- | ------- | ------- | --------------- |
| Flask     | 24.20ms | 23.86ms | 29.54ms | 34.35ms | 417             |
| FastAPI   | 17.78ms | 17.45ms | 21.12ms | 24.36ms | 553             |
| ExpressJS | 7.37ms  | 6.60ms  | 11.01ms | 14.30ms | 1385            |

### `GET \random`
|           | avg     | med     | p(95)   | p(99)   | requests/second |
| --------- | ------- | ------- | ------- | ------- | --------------- |
| Flask     | 23.24ms | 23.00ms | 28.68ms | 32.18ms | 429             |
| FastAPI   | 17.48ms | 17.23ms | 20.29ms | 22.22ms | 386             |
| ExpressJS | 6.70ms  | 6.02ms  | 10.12ms | 13.27ms | 1232            |

### `POST \url`
|           | avg     | med     | p(95)   | p(99)   | requests/second |
| --------- | ------- | ------- | ------- | ------- | --------------- |
| Flask     | 30.00ms | 29.71ms | 39.09ms | 43.55ms | 329             |
| FastAPI   | 38.71ms | 37.61ms | 45.22ms | 50.58ms | 253             |
| ExpressJS | 15.44ms | 14.01ms | 20.91ms | 25.05ms | 715             |



[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

Dillinger is a cloud-enabled, mobile-ready, offline-storage compatible,
AngularJS-powered HTML5 Markdown editor.

- Type some Markdown on the left
- See HTML in the right
- ✨Magic ✨

## Features

- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- Import and save files from GitHub, Dropbox, Google Drive and One Drive
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email.
As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually- written in Markdown! To get a feel
for Markdown's syntax, type some text into the left window and
watch the results in the right.

## Tech

Dillinger uses a number of open source projects to work properly:

- [AngularJS] - HTML enhanced for web apps!
- [Ace Editor] - awesome web-based text editor
- [markdown-it] - Markdown parser done right. Fast and easy to extend.
- [Twitter Bootstrap] - great UI boilerplate for modern web apps
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Gulp] - the streaming build system
- [Breakdance](https://breakdance.github.io/breakdance/) - HTML
to Markdown converter
- [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd dillinger
npm i
node app
```

For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:

```sh
node app
```

Second Tab:

```sh
gulp watch
```

(optional) Third:

```sh
karma test
```

#### Building for source

For production release:

```sh
gulp build --prod
```

Generating pre-built zip archives for distribution:

```sh
gulp build dist --prod
```

## Docker

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd dillinger
docker build -t <youruser>/dillinger:${package.json.version} .
```

This will create the dillinger image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}
```

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>

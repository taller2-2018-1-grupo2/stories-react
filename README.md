# Stories - React Frontend

### Para correr:

1. En el root directory:
```
$ npm install
```
2. Para correr de forma local:
```
$ npm start
```

### Para correr en un contenedor de Docker:

En el root directory:

```
$ docker build -t sample-app .

$ docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 3000:3000 \
  --rm \
  sample-app
```
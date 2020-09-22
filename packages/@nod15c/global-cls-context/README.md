# @nod15c/global-cls-context

Global CLS context for express or similar service by Joe Blow

## Quickstart

```bash
make utest
```

## Build

Using makefile

```bash
make build
make lint
make utest
```

Using npm

```bash
npm install
npm run build
npm run test
npm run test:cov
# etc.
```

## Develop

### Server

Run in watch mode under nodemon (ts-node):

```bash
npm install -g pino-pretty
make develop
```

## Lambda

Package to `./lambda` with production dependencies only:

```bash
make lambda
```

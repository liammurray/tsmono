# CLS Experiment

CLS stuff

## Quickstart

The following will run npm install, compile and run tests

```bash
make utest
```

## Build and Test

### Using makefile

Clean build if dist is outdated

```bash
make build
```

Run unit test

```bash
make utest
```

### Using npm

```bash
npm install
npm run build
npm run test
npm run test:cov
# etc.
```

## Develop

### Watch

Run under tsc watch with inspector

```bash
npm install -g pino-pretty
make develop
```

That runs the following (also piping pino output)

```bash
npm run start:watch
```

For non-server projects (e.g. script that runs and exits) the following command will just watch and recompile as needed. This is useful while making changes and re-running tests.

```bash
npm run compile:watch
```

### Inspector

To connect with `chrome://inspect` (or node inspect, etc.) you can run so node listens for an inspector client (debugger).

```bash
npm run start:debug
```

## Lambda

Package to `./lambda` with production dependencies only:

```bash
make lambda
```

## Other

There are some ts-node targets in package.json. If you want to use these you need to install ts-node as a dev dependency. This is probably not that useful since, for example, you can run `npm start:watch` and quickly edit and run tests (incremental typescript compilation is enabled).

### Mocha test runner

The following is used to run NYC using

```bash
npm install --save-dev mocha-explorer-launcher-scripts
```

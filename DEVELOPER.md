# Development

This document describes how you can test, build and publish this project.

## Prerequisite

Before you can start you must install and configure the following products on your development machine:

* [Node.js][nodejs]
* [Git][git]

You will then need to clone this project and install the required dependencies:

```sh
git clone <repository_url> <dir_name>
cd <dir_name>
npm install
```

## Testing locally

You can test the library while developing it, as follow:

1. Start the testing application

   ```sh
   npm run start -w projects/tests-app
   ```

2. Make any modifications

   * to the **library**: under `./projects/library/src/`
   * to the **testing application**: under `./projects/tests-app/src/`
   * to the **tests**: in `./projects/tests-e2e/harness.e2e.ts`

3. Run the tests

   ```sh
   npm run start -w projects/tests-e2e
   ```

## Building the library

The library will be built in the `./dist` directory.

```sh
npm run build -w projects/library
```

## Publishing to NPM repository

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Bump the library version in `./projects/library/package.json`
2. Push the changes
3. Create a new [GitHub release](https://github.com/badisi/wdio-harness/releases/new)
4. Watch the results in: [Actions](https://github.com/badisi/wdio-harness/actions)



[git]: https://git-scm.com/
[nodejs]: https://nodejs.org/

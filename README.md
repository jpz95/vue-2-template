# Vue Project Template

Vue template based on the webpack 4 configuration from [create-react-app](https://github.com/facebook/create-react-app/). The goal was to make a configuration that is better suited for large-scale projects.

Most features were implemented (up to v3.4.1), including:

- **Hot-reloading** - Changes to your code are automatically handled, using a file's dependency tree (no more refreshing the entire app manually!).

- **Optimizations for over 20 file types** - Takes advantage of webpack's bundle optimizations and the browser's file caching to increase your project's performance.

- **Cutting-edge JavaScript** - Supports the latest JavaScript features like arrow functions, the spread operator, and dynamic imports.

- **Autoprefixed CSS** - Uses PostCSS to provide the correct prefixes to your CSS, based on your project's targeted browsers.

- **Unit testing with Mocha** - Supports unit testing for Vue's Single File Components and JavaScript modules, without the need to sacrifice ES5+ syntax (thanks to [mochapack](https://sysgears.github.io/mochapack/)).

- **Environment Variables** - Using [dotenv](https://www.npmjs.com/package/dotenv), the project can have a default environment configuration, that each developer can override so that it best fits their dev environment and tasking. With [dotenv-expand](https://www.npmjs.com/package/dotenv-expand), we can expand this ability to production environments, as well!

## **Scripts**
### Compiles and hot-reloads for development
```
npm run start
```

### Compiles unit tests for Vue components and JavaScript modules.
```
npm run test
```

### Compiles *and hot-reloads* unit tests for Vue components and JavaScript modules.
```
npm run test:watch
```

### Compiles, minifies, and optimizes for production
```
npm run build
```

## **Project Structure (Top-level)**
| Folder | Description |
| --- | --- |
| `webpack` | webpack configuration that was built using principles from the [Create React App](https://create-react-app.dev/docs/folder-structure) project but applied to a Vue-based project. |
| `src` | Main entrypoint for the webapp. webpack will process these files to create development and production bundles. |
| `public` | Files that will be hosted and made public by the server. Contains the webapp's HTML template. |

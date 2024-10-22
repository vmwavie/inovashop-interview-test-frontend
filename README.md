# Inovashop Interview Test Frontend

A Angular 18 applications that show to-do list

## Project setup

To set up the project, follow these steps:

1. Clone the repository:

```bash
  git clone https://github.com/vmwavie/inovashop-interview-test-frontend.git
```

2. Navigate to the project directory:

```bash
cd inovashop-interview-test-frontend.
```

3. Install the dependencies:

```bash
npm install
```

4. Setup your API_URL and WEBSOCKET_API on env.ts

## Project structure

- `public`: Contains static assets such as the favicon and logo SVG file.
- `src`: The main source code directory, containing Angular components, services, and various utility files.
  - `app`: Core application code, including components, modules, and routing.
    - `features`: Feature modules like auth and to-do.
    - `shared`: Shared modules, components, and services used across the application.
  - `assets`: Static assets like images and icons.
  - `environments`: Environment-specific configuration files.
- `server`: Contains server-specific configurations and scripts.
- `Dockerfile`: Used to build a Docker image for the application.
- `docker-compose.yml`: Defines services and configurations for the Docker Compose environment.
- `angular.json`: Angular workspace configuration file.
- `tsconfig.json`: TypeScript compiler configuration file.
- `eslint.config.js`: ESLint configuration file for code linting.
- `postcss.config.js`: PostCSS configuration file for CSS processing.
- `tailwind.config.js`: Tailwind CSS configuration file.

## Available scripts

To run various tasks, use the following npm scripts:

- `npm start`: Starts the development server for your Angular application.
- `npm run build`: Compiles your Angular application for production.
- `npm test`: Runs unit tests for your Angular application.
- `npm run lint`: Runs ESLint to check your code for potential errors and stylistic issues.
- `npm run serve:ssr:frontend`: Starts the server-side rendering of the Angular application.
- `docker compose up`: Builds and runs the application using Docker Compose.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

NestJS is a framework for building efficient, scalable Node.js server-side applications. It leverages progressive JavaScript and is built with TypeScript, fully supporting developers who prefer pure JavaScript. The framework combines principles of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP) to create robust and maintainable applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or later)
- **NestJS CLI**
- **Mongo-migration** (for database migrations)
- **MongoDB**
- **npm** (Node Package Manager)


## Project setup

```bash
$ npm install
```

## Database Setup

```bash
$ npm run migrate:up  # to migrate the tables/collection in the database
```

```bash
$ npm run migrate:down  # to undo the mirgration (delete  the tables/collection) from the database
```

```bash
$ npm run seed  # to seed(populate) data in the database
```

## Compile and run the project

```bash
# development
$ npm  start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run project using docker
```bash
$ docker-compose up
```

## Resources
Check out a few resources that may come in handy when working with NestJs:
- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Visit [NodeJs Documentaion](https://nodejs.org/en/download/package-manager) to learn more about the nodejs
- Visit [MonogDB Documentaion](https://www.mongodb.com/)to learn more about the MonogDB


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Structure
```bash
my-node-app/
├── .husky                          # Pre-commit hooks for code validation (Husky)
├── src
│   ├── apps/                       
│   │   ├── auth                    # Authentication module
│   │   │   ├── dto                 # Data transfer objects for authentication
│   │   ├── user                    # User module
│   │   │   ├── dto                 # Data transfer objects for user management
│   │   │   ├── interface           # User-related interfaces
│   │   │   ├── validation          # Validation logic for user data
│   ├── common/                     
│   │   ├── enums                   # Shared enums across the app
│   │   ├── guards                  # Security guards for route protection
│   │   ├── interceptor             # Interceptor logic
│   │   ├── interfaces              # Common interfaces used throughout the app
│   │   ├── logger                  # Logger configuration and setup
│   │   ├── validations             # Shared validation logic
│   ├── config/                     
│   │   ├── index.ts                # Main configuration entry point
│   │   ├── validations             # Configuration validations
│   ├── db/                         
│   │   ├── migrations              # Database migrations
│   │   ├── schemas                 # Database schemas
│   │   ├── seeders                 # Database seeders for initial data
│   ├── utils/                      
│   │   ├── email                   # Email-related utilities
│   │   ├── sms                     # SMS-related utilities
│   │   ├── upload                  # File upload-related utilities
│   │   ├── time.ts                 # Time and date utilities
│   ├── public/                     # Static files served by the app
│   ├── tests/                      # Unit and integration tests
│   ├── app.ts                      # Main application entry point
│   ├── .env                        # Environment variables
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── eslint.json                     # Linter configuration (ESLint and Prettier)
├── .prettierrc                     # Code formatting rules (Prettier)
├── commitlint.config.js            # Commit message linting for semantic versioning
├── Dockerfile                      # Dockerfile for containerization
├── docker-compose.yml              # Docker Compose for multi-container setup
├── README.md                       # Project overview and documentation
```

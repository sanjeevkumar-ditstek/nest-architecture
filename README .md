## Description

NestJS is a framework for building efficient, scalable Node.js server-side applications. It leverages progressive JavaScript and is built with TypeScript, fully supporting developers who prefer pure JavaScript. The framework combines principles of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP) to create robust and maintainable applications.

## Prerequisites

Before you begin, ensure you have the following installed:

Node.js (version 14 or later)
npm  (Node Package Manager)
NestJS CLI (for scaffolding NestJS projects)
Sequelize CLI (for database migrations)
Docker (optional, for containerized deployment)

## Project setup

```bash
$ npm install
```

## Database Setup

```bash

$ npx sequelize-cli migration:generate --name <migration-name> #Generate a migration file

$ npx sequelize-cli db:migrate # to migrate the tables/collection in the database
``

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



## Resources
Check out a few resources that may come in handy when working with NestJs:
- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Visit [NodeJs Documentaion](https://nodejs.org/en/download/package-manager) to learn more about the nodejs
- Visit [mySql Documentaion](https://dev.mysql.com/doc/)to learn more about the MonogDB


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

## ADDED Requirements

### Requirement: Unit Testing Pattern for Services
All backend services SHALL have corresponding unit tests that mock external dependencies (Prisma, Hubs, etc.) using NestJS's `Test.createTestingModule`.

#### Scenario: Mocking Prisma in Service Test
- **WHEN** a service is tested that depends on `PrismaService`
- **THEN** a mock implementation of Prisma is injected to avoid real database calls

### Requirement: Test Coverage Reporting
The backend SHALL be configured to generate coverage reports for unit tests.

#### Scenario: Generating coverage
- **WHEN** running `pnpm run test:cov`
- **THEN** a coverage report is generated in the `server/coverage` directory


# ⚡ QuickStarter — TypeScript Clean Architecture Template

**QuickStarter** is a lightweight backend architecture template designed to promote clean, modular, and maintainable development practices.
It combines the strengths of Domain-Driven Design (DDD), Clean Architecture, and SOLID principles while remaining technology-agnostic.

> Think of it as a “starter core” — not a framework, but a foundation for building structured, scalable backends.

---

## Core Philosophy

QuickStarter’s main goal is to decouple business logic from infrastructure.
This separation enables developers to focus on domain problems first, while keeping platform and technology details interchangeable.

It defines:
- Interfaces (I...) → pure contracts
- Abstract classes (Base...) → reusable abstract implementations
- Concrete classes (Basic...) → dynamic, instantiable defaults

This layered approach encourages composition, flexibility, and clean dependencies.

---

## Naming Conventions

The project adheres to TypeScript’s language standards — camelCase for variables and PascalCase for types, interfaces, and classes.

| Element Type | Prefix | Description |
|---------------|---------|-------------|
| Interface | I | Contract or behavior definition |
| Abstract class | Base | Base implementation of an interface |
| Concrete class | Basic | Instantiable, configurable default implementation |

### Example

```typescript
interface IFoo {
  bar(): string;
}

abstract class BaseFoo implements IFoo {
  abstract bar(): string;
}

class BasicFoo extends BaseFoo {
  constructor(
    protected readonly barValue: IFoo | string | (() => string)
  ) {
    super();
  }

  override bar(): string {
    if (typeof this.barValue === 'function') return this.barValue();
    if (typeof this.barValue === 'string') return this.barValue;
    return this.barValue.bar();
  }
}
```

---

## Architecture Overview

QuickStarter organizes the backend into independent layers:

1. Core — shared contracts and abstract logic
2. Domain — pure business rules and logic
3. Infra — real-world implementations (databases, APIs, etc.)
4. Core-Ext — reusable extension packages (HTTP, CLI, etc.)
5. Apps — runnable applications (HTTP, CLI, cron, etc.)

---

## Core Layer

### Use Cases

A Use Case represents one business operation.
Each defines input and output types and an execute method, optionally with async support and error recovery.

```typescript
type MyFooInput = { /* arguments */ };
type MyFooOutput = { /* return type */ };

class MyFooUseCase implements IUseCase<MyFooInput, MyFooOutput> {
  execute(input: MyFooInput): MyFooOutput {
    // business logic
  }

  onError?(error: Error): MyFooOutput {
    // fallback logic
  }
}

class MyAsyncUseCase implements IUseCase<void, string> {
  async execute(): Promise<string> {
    return "Async response";
  }
}
```
---

## Adapters & Executors

In QuickStarter, **adapters** and **executors** are the core components that connect routes to use cases and manage transport-specific input/output.

### UseCaseAdapter

- Converts raw transport input (HTTP request, CLI arguments, Cron payload, etc.) into the input type expected by the **UseCase**.
- Ensures the use case is **decoupled from transport details**.
- Can be synchronous or asynchronous depending on the input source.

### OutputAdapter

- Converts the use case output into a format suitable for the transport.
  - HTTP → JSON response
  - CLI → Console output
  - Cron → Logging, notifications, etc.
- Keeps the use case logic independent of the output format.

### FailureAdapter

- Handles exceptions raised during use case execution.
- Converts errors into a transport-specific format.
  - HTTP → JSON error response
  - CLI → Console error message
  - Cron → Logs or alerts
- Works seamlessly with `BaseAppError` and other custom application errors.

### UseCaseExecutor

- Central orchestrator of route execution.
- Steps executed by the executor:
  1. Receives input from the route.
  2. Passes input through the **UseCaseAdapter** to generate the use case input type.
  3. Executes the **UseCase**.
  4. Passes output through the **OutputAdapter**.
  5. Catches and processes errors via the **FailureAdapter**.
- Enables **transport-agnostic routes**, allowing the same use case and route to work with different adapters (HTTP, CLI, Cron, etc.).

### Example

```typescript
const HelloWorldExecutor = new BasicUseCaseExecutor(
    new MyFooUseCase( /* ... inject dependencies here ... */ ),
    new BasicUseCaseAdapter(
        (routeRequest) => { return {
          /* ... convert application request into MyFooInput, supports async and Promise */
        }}
    ),

    new JSONResponseAdapter(200),    // Converts MyFooOutput into an application layer response
    new JSONResponseFailureAdapter() // Failure handler (optional - returns an application layer response)
);

```

## Routes & Routers

QuickStarter provides a flexible routing system built with:

- **Interfaces**: `IRoute`, `IRouter`
- **Base classes**: `BaseRoute`, `BaseRouter`
- **Concrete implementations**: `BasicRoute`, `BasicRouter`

This allows defining transport-agnostic routes that can be reused across HTTP, CLI, Cron, or other application types.

### Core Interfaces

- `IRoute` - Defines a route and exposes a method to retrieve its use case executor.

- `IRouter` - Defines a router that can mount multiple routes or other routers, enabling hierarchical routing.

### Base Classes

- `BaseRoute` — Abstract class providing skeleton logic for routes.
- `BaseRouter` — Abstract class providing default router logic and mounting functionality.

### Basic Implementations

- `BasicRoute` — Ready-to-use route that wraps a UseCaseExecutor.
- `BasicRouter` — Ready-to-use router that can mount multiple routes and sub-routers.

### Flow Overview

1. The `IRouter` map request descriptions (HTTP, CLI, Cron, etc.) into an `IRoute`.
2. The `IRoute` delegates execution to a **UseCaseExecutor**.
3. The **UseCaseExecutor**:
   - Uses a **UseCaseAdapter** to convert raw input into the use case input type.
   - Executes the **UseCase**.
   - Passes the result through an **OutputAdapter**.
   - Handles exceptions via a **FailureAdapter**.
4. The response is returned to the transport layer.
5. Routers can mount other routers to create a **hierarchical route tree**.

### Benefits

- **Transport-agnostic**: same routers and routes can be reused with different adapters.
- **Hierarchical routing**: routers can mount sub-routers for clean structure.
- **Centralized execution**: UseCaseExecutor ensures input/output and errors are handled consistently.
- **Decoupled business logic**: routes and executors do not depend on transport details.


---

## Error Management

Errors are managed via a common base class: BaseAppError.


```typescript
export interface IAppError {
  codeValue: number; // Custom numeric error code
  codeName: string;  // Custom string identifier
  detail?: unknown;  // Optional extra details
}

export class BaseAppError extends Error implements IAppError {
  readonly codeName: string;
  readonly codeValue: number;
  readonly detail: unknown;
  readonly stack?: string | undefined;
  private readonly parentError: Error | null;

  constructor(codeValue: number, codeName: string, detail: unknown, parentError?: Error) {
    super(codeName, { cause: parentError });
    this.name = new.target.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.codeValue = codeValue;
    this.codeName = codeName;
    this.detail = detail;
    this.parentError = parentError ?? null;
    if (this.parentError) this.stack = this.parentError.stack;
  }

  get message(): string {
    if (this.parentError) return `${this.codeName}: ${this.parentError.message}`;
    return this.codeName;
  }
}
```

---

## Domain Layer

The src/domain folder contains the business core of your application.

- domain/usecases — concrete implementations of IUseCase
- domain/models — shared business types and entities
- domain/repos — repository interfaces for business storage
- domain/services — reusable business services (these are never reimplemented in infra; only their dependencies are)
- domain/constants.ts — central place for shared constants

---

## Infrastructure Layer

The src/infra directory contains all external integrations and infrastructure implementations.

Typical structure:
```
src/
 └── infra/
     ├── index.ts           # default repositories or loader (optional)
     ├── aws/
     │    └── s3/           # implements e.g. AvatarFileManageRepository
     ├── oauth/             # implements e.g. AuthManagerRepository
     └── ...
```
Each folder corresponds to a specific provider or external service.
Repositories implemented here fulfill domain repository contracts defined in src/domain/repos.

---

## Core Extensions

src/core-ext contains optional plugins and adapters that can be used independently.

For example:
- core-ext/http — mount use cases on an Express-based HTTP server.
- core-ext/cli — translate CLI commands into use case calls.

Each extension is modular and can be imported separately depending on your needs.

---

## Applications

The src/apps folder contains runnable application definitions.

Each application exposes a fully configured instance of your system.  
You may define multiple apps for different contexts:

- httpApplication — for your API server
- cronApplication — for scheduled jobs
- cliApplication — for developer tools or task runners

They can coexist in separate processes or share the same one through a custom entrypoint.

---

## Summary

QuickStarter provides:
- A clean, modular, SOLID architecture.
- Clear separation between domain and infrastructure.
- Extensible adapters and executors.
- Consistent error handling.
- Optional extension packages for HTTP, CLI, and more.

It is not a framework — it’s a foundation to start strong and scale cleanly.

---

## TODO

- BaseLogger + BasicLogger (with supports levels, formatters and handler)
- Refactor executors / adapters to have an abstraction layer for documentation (OpenAPI / cli manual)
- Testing domain and infra
- Testing and benchmark project
- Other core-ext ideas: JWT OAuth (any social login)

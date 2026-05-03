You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection


## Folders Structure
src/app/
├── core/                 # Elementos globales (se instancian una sola vez)
│   ├── guards/           # Protección de rutas (ej. para que no entren sin login)
│   ├── interceptors/     # Para inyectar el token de autenticación en peticiones HTTP
│   ├── layout/           # Componentes estructurales (Navbar, Sidebar)
│   └── services/         # Servicios globales (ej. AuthService)
│
├── shared/               # Componentes y utilidades reutilizables en toda la app
│   ├── components/       # Botones, modales, etiquetas de estado (Pendiente, En Progreso)[cite: 2]
│   ├── interfaces/       # Modelos TypeScript (User, Project, Ticket)[cite: 2]
│   └── utils/            # Funciones de ayuda y validadores de formularios
│
└── features/             # Los módulos principales del negocio según el PDF
    │
    ├── auth/             # Autenticación[cite: 2]
    │   ├── components/   # Formularios internos
    │   ├── pages/        # Pantalla de login y registro[cite: 2]
    │   └── services/     # Llamadas a la API de autenticación
    │
    ├── projects/         # Gestión de Proyectos[cite: 2]
    │   ├── components/   # Tarjetas de proyecto, modales de creación/edición[cite: 2]
    │   ├── pages/        # Listado de proyectos y vista detalle[cite: 2]
    │   └── services/     # Consumo de la API de proyectos[cite: 2]
    │
    └── tickets/          # Gestión y Tablero de Tickets[cite: 2]
        ├── components/   # Tarjeta individual de ticket, formulario de ticket[cite: 2]
        ├── pages/        # Tablero de trabajo (Kanban) agrupado por estados[cite: 2]
        └── services/     # Consumo de la API para mover estados y asignar responsables[cite: 2]
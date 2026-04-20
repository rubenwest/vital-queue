# CLAUDE.md — Prueba técnica Angular (Picis)

## Contexto del proyecto

Prueba técnica de 3h para Senior Frontend Engineer en Picis (HealthTech).
Stack objetivo: Angular 21+ standalone, Signals, SCSS, Vitest, TypeScript strict.
Arquitectura base ya decidida. Tu misión es ejecutar con criterio senior, no solo generar código.

---

## Stack y versiones

- Angular 21+ con **standalone components siempre** (nunca NgModules)
- TypeScript con `strict: true` y `noImplicitAny: true`
- SCSS con design tokens en variables CSS
- RxJS para streams asíncronos, Signals para estado local/UI
- Reactive Forms con tipado estricto `FormGroup<T>`
- Vitest para testing unitario
- Todo el código, carpetas etc en ingles con nombres claros.

---

## Arquitectura de carpetas

```
src/app/
├── core/           # Singleton: interceptors, guards, servicios globales, modelos globales
├── shared/         # UI reutilizable sin lógica de negocio: ui/, directives/, pipes/, utils/
├── features/       # Bounded contexts, lazy-loaded
│   └── [feature]/
│       ├── pages/       # smart components (routing targets)
│       ├── components/  # dumb components
│       ├── services/    # lógica de negocio
│       ├── store/       # signalStore si hay estado compartido
│       ├── models/      # tipos e interfaces de la feature
│       └── [feature].routes.ts
├── layouts/        # shell components si aplica
└── app.routes.ts
styles/
├── _tokens.scss    # design tokens
├── _mixins.scss
└── styles.scss
```

---

## Reglas de código — SIEMPRE

### Componentes

- `standalone: true` en todos los componentes
- `changeDetection: ChangeDetectionStrategy.OnPush` en todos
- `inject()` funcional en vez de constructor para inyección de dependencias
- Smart components en `pages/`, dumb components en `components/`
- Los dumb components solo reciben `@Input()` y emiten `@Output()` o usan signals
- Tipado explícito en todos los `@Input()` e `@Output()`
- Todo el código, carpetas etc en ingles con nombres claros.

### Servicios

- `providedIn: 'root'` solo para servicios globales (core)
- Servicios de feature se proveen en la ruta de la feature o en el componente raíz de la feature
- Un servicio por responsabilidad (HTTP separado de lógica de negocio si aplica)

### Estado

- **Signals** para estado local de componente y estado de UI
- **RxJS** para streams HTTP, eventos del DOM complejos, operadores de transformación
- **NgRx signalStore** si hay estado compartido entre componentes de una misma feature
- No usar NgRx clásico (actions/reducers/effects) salvo que se pida explícitamente

### Formularios

- **Reactive Forms tipados** siempre: `FormGroup<{ field: FormControl<string> }>`
- Validaciones en el modelo del formulario, no en el template
- Mensajes de error en componentes dumb reutilizables

### HTTP

- Un servicio dedicado por dominio/recurso
- Interceptor funcional centralizado para manejo de errores HTTP
- Tipado de respuestas con interfaces, nunca `any`
- `catchError` con feedback al usuario, no `console.log`

### TypeScript

- `strict: true` — obligatorio
- Sin `any` bajo ningún concepto
- Interfaces para modelos de datos, types para uniones/aliases
- `readonly` en propiedades que no deban mutar

### SCSS

- Design tokens en variables CSS en `_tokens.scss`
- BEM o nomenclatura consistente
- Sin magic numbers — usar tokens o variables
- Sin estilos inline en el template salvo casos excepcionales justificados

### Testing

- Tests en archivos `.spec.ts` junto al fichero que testean
- Mocks de servicios HTTP con `HttpClientTestingModule` o `provideHttpClientTesting()`
- Al menos: 1 test de servicio con HTTP mockeado + 1 test de componente con lógica
- Arrange-Act-Assert bien separado con comentarios

### Git

- Commits atómicos en formato Conventional Commits:
  `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`
- Un commit por unidad lógica de trabajo, no al final de todo

---

## Patrones que debes aplicar (y dejar visibles)

1. **Barrel files** solo en `shared/ui/` — no en todos lados (daña tree-shaking)
2. **Lazy loading** con `loadComponent` o `loadChildren` en todas las features
3. **Interceptor funcional** para errores (HTTP 4xx/5xx → notificación usuario)
4. **Error boundaries**: el usuario siempre sabe qué pasó, nunca falla en silencio
5. **Accesibilidad básica**: roles ARIA correctos, labels en formularios, contraste — en HealthTech esto importa
6. **Environment variables** para URLs de API, nunca hardcodeadas

---

## Lo que NO hacer

- ❌ NgModules
- ❌ Constructor injection (usar `inject()`)
- ❌ `any` en TypeScript
- ❌ Estado en componentes que debería estar en un store/servicio
- ❌ Lógica de negocio en componentes (va en servicios)
- ❌ `console.log` en código de producción
- ❌ Estilos sin tokens para colores/espaciados clave
- ❌ Commits grandes al final — commits atómicos durante el desarrollo

---

## Cómo responder a mis peticiones

- **Dame código directamente** sin preámbulos ni resúmenes innecesarios
- Si hay una decisión técnica relevante, 1-2 líneas de justificación máximo
- Si ves algo en mi código que va contra estas reglas, dímelo brevemente antes de corregirlo
- Prioriza completitud y corrección sobre explicaciones largas
- Si algo no queda claro en el enunciado, propón la interpretación más razonable y sigue adelante

---

## README del proyecto (template para rellenar al final)

```markdown
# [Nombre del proyecto]

## Decisiones arquitectónicas

**Estructura**: core/shared/features con lazy loading por feature.
Cada feature es un bounded context autónomo — candidato natural a microfrontend si la plataforma escala.

**Estado**: Signals para estado local/UI. RxJS para streams asíncronos.
[NgRx signalStore para X feature porque...] — eliminar si no aplica.

**Formularios**: Reactive Forms tipados. Validaciones centralizadas en el modelo.

**Errores**: Interceptor HTTP centralizado. El usuario siempre recibe feedback.

**Testing**: [X tests unitarios]. Estrategia: unit (servicios + lógica) + component (interacción).

## Stack

- Angular 21 standalone
- TypeScript strict
- SCSS + CSS custom properties
- Vitest

## Con más tiempo haría

- [ ] Tests de integración con Playwright
- [ ] Storybook para componentes shared
- [ ] i18n con @angular/localize (equipo internacional)
- [ ] Accesibilidad: auditoría completa con axe
- [ ] [Específico de la prueba...]

## Cómo escalaría esto a la plataforma de Picis

- Estructura de features lista para extraer como microfrontends con Module Federation
- Design tokens centralizados como base de un design system
- signalStore escalable a NgRx si el estado crece en complejidad
```

# VitalQueue — ER Queue Dashboard

Angular application that simulates an Emergency Room queue dashboard. Built as a technical assessment for a Senior Frontend Engineer position.

---

## Setup & run

**Requirements:** Node.js 20+, npm 11+

```bash
npm install
npm start           # dev server → http://localhost:4200
npm test            # unit tests (Vitest, watch mode)
ng test --no-watch  # single test run
npm run build       # production build
```

---

## Architecture decisions

### Structure: `core / shared / features`

Each feature is a lazy-loaded bounded context. The only feature here is `queue`, which owns its pages, components, services, and models. This maps naturally to a microfrontend boundary if the platform scales.

```
src/app/
├── core/           # Singleton infrastructure: interceptors, global services
├── shared/         # Reusable UI with no business logic: pipes, components
└── features/
    └── queue/
        ├── pages/        # Smart components (routing targets)
        ├── components/   # Dumb components
        ├── services/     # Business logic
        └── models/       # Types and interfaces
```

### State: Signals + computed

`QueueService` holds a single `signal<Patient[]>` as the source of truth. The sorted queue is a `computed()` that filters waiting patients and sorts by triage level → arrival time. Any mutation (add, admit, discharge, triage update) triggers automatic re-derivation with no manual subscriptions.

RxJS is not used for local state — only Angular's `HttpClient` pipeline uses it, which is the appropriate boundary.

### Service scope

`QueueService` is provided at the route level (`providers` array in `queue.routes.ts`), not `providedIn: 'root'`. This means the dashboard and intake pages share the same instance within the `/queue` route tree, but the service is destroyed when the user leaves the feature — correct scoping without global pollution.

### Forms

Typed Reactive Forms: `FormGroup<{ field: FormControl<T> }>`. Validations are declared in the model, not in the template. On failed submit, `markAllAsTouched()` is called and focus moves programmatically to the first invalid field via `viewChild` + `.ng-invalid[id]` selector.

### Waiting time display

`WaitingTimePipe` is `pure: true`. A `tick` signal in `QueueDashboardComponent` increments every second via `setInterval`. It is passed as `[tick]="tick()"` to each `PatientRowComponent` and forwarded as the second argument of the pipe. This forces Angular's change detection to re-evaluate the pipe every second without needing `pure: false` or `ChangeDetectorRef`.

### Error handling

A functional `HttpInterceptorFn` catches all `HttpErrorResponse` instances. Known status codes map to user-facing messages; unknown codes fall back to generic client/server error copy. `NotificationService` queues `AppNotification` signals with auto-dismiss (5 s) and timer cleanup on manual close. The toast component is mounted at root level outside `<router-outlet>` so it survives navigation.

### Design tokens

All colors, spacing, typography, and triage-level colors live in `src/styles/_tokens.scss` as CSS custom properties. Components use `@use 'styles/mixins'` for layout helpers (`flex`, `card`, `respond-to`). No magic numbers in component stylesheets.

---

## Trade-offs and assumptions

- **In-memory state only.** There is no persistence. Refreshing the page resets the queue. A real implementation would sync with a backend via `HttpClient` and the environment's `apiBaseUrl`.
- **No authentication.** The 401 handler in the interceptor shows a toast and is wired to navigate to `/login`, but that route does not exist in this assessment. The pattern is in place for when auth is added.
- **Single triage selector per row.** The spec says "a control on each queue row". A dropdown was chosen over inline radio buttons for compactness at scale — an ER queue can have many patients simultaneously.
- **`TriageLevel` as a numeric enum.** Sorting is `a.triageLevel - b.triageLevel`, which requires numbers. All form controls that deal with triage use `[ngValue]` (not `[value]`) to preserve the numeric type across Angular's binding layer.
- **No optimistic updates / loading states.** With in-memory state, operations are synchronous. When HTTP calls are introduced, loading and error states should be added per-operation.

---

## Known limitations

- Queue state is lost on page refresh (no persistence layer).
- No pagination or virtual scrolling — with hundreds of patients the list would become unwieldy.
- Waiting time display truncates at hours + minutes beyond the first minute. This is intentional; clinical staff typically care about minutes, not seconds once a patient has been waiting longer.
- No end-to-end tests. Unit tests cover services, the HTTP interceptor, the notification system, and the waiting-time pipe (39 tests total).

---

## Next steps with more time

- [ ] Connect to a real REST API using `environment.apiBaseUrl`; add loading skeletons and per-operation error states
- [ ] Persist queue state across sessions (WebSocket for live multi-user sync, or `localStorage` for single-user resilience)
- [ ] Virtual scrolling (`@angular/cdk/scrolling`) for large queues
- [ ] End-to-end tests with Playwright covering the intake → queue → discharge flow
- [ ] Storybook for `PatientRowComponent` and `NotificationToastComponent`
- [ ] Full accessibility audit with axe-core; add keyboard navigation for queue actions
- [ ] i18n with `@angular/localize` (clinical environments are often multilingual)
- [ ] Role-based views: triage nurse vs. attending physician see different controls

---

## AI usage

GitHub Copilot (inline suggestions) and Claude (Claude Code CLI) were used throughout.

**What AI generated:**
- Initial scaffolding: folder structure, route configuration, SCSS token system
- Boilerplate for standalone components (decorator, imports, OnPush)
- First drafts of `QueueService`, `WaitingTimePipe`, and the error interceptor
- Unit test skeletons (Arrange/Act/Assert structure and edge-case enumeration)

**What was manually implemented or validated:**
- The `tick` signal pattern for OnPush-compatible live updates — AI generated `pure: false` initially; the correct approach (`pure: true` + tick as pipe argument) was reasoned through and fixed after identifying the root cause
- The `[selected]` fix on the triage select — AI used `[value]` on the `<select>`; the rendering-order bug was diagnosed and fixed manually
- All Copilot PR review comments were evaluated individually: some applied directly (`[ngValue]`, aria attributes), others required judgment (`AppNotification` rename, timer leak with Map)
- Architecture decisions: service scope at route level vs. component level, signal vs. RxJS boundaries, pipe purity strategy
- SCSS design system: token naming, triage color palette, BEM structure

AI tools accelerated scaffolding and test coverage. All generated code was reviewed, several bugs were caught and corrected, and architectural decisions were made with explicit reasoning rather than accepting AI defaults.

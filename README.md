# VitalQueue — ER Queue Dashboard

Angular application that simulates an Emergency Room queue dashboard.

## Setup & Run

- **Prerequisites:** Node.js 20+, npm 11+
- **Install:** `npm install`
- **Run:** `npm start` → [http://localhost:4200](http://localhost:4200)
- **Tests:** `ng test --no-watch`
- **Build:** `npm run build`

## Architecture Decisions

### Structure: `core / shared / features`

I went with a simple feature-based structure. The `queue` feature owns its pages, components, services, and models, keeping related UI and business logic grouped without adding unnecessary layers.

This is intentionally pragmatic for a time-boxed exercise. For a larger product with multiple workflows and stricter domain boundaries, I would consider a more explicit domain/application/infrastructure separation.

```text
src/app/
├── core/        # App-wide infrastructure: interceptors, global services
├── shared/      # Reusable UI building blocks: pipes, components
└── features/
    └── queue/
        ├── pages/       # Route-level components
        ├── components/  # Presentational components
        ├── services/    # Queue logic
        └── models/      # Types and interfaces
```

### State: Signals + computed

`QueueService` uses a single `signal<Patient[]>` as the source of truth. The active queue is a `computed()` that filters waiting patients and sorts by triage level first, then by arrival time. This keeps state flow simple and avoids manual subscription management.

### Service scope

`QueueService` is provided at the route level, not globally. The intake and dashboard pages share the same queue instance within the feature, but the service is destroyed when the user leaves — correct scoping without polluting the root injector.

### Forms

The intake form uses typed Reactive Forms with validation defined in the component class. On invalid submit, all fields are marked as touched and focus moves programmatically to the first invalid field. Small detail, but it matters in clinical contexts where accessibility is not optional.

### Waiting time display

Waiting time is rendered through a custom pure pipe. A timer signal in the dashboard updates every second and is passed down to each row as an input, which triggers pipe re-evaluation without relying on `pure: false` or `ChangeDetectorRef`. It took a couple of iterations to get right with OnPush — more on that in the AI section.

### Error handling

A small global error layer using `HttpInterceptorFn` and a signal-based `NotificationService`. The assessment runs in-memory so no real HTTP errors fire, but the infrastructure is in place for when API integration happens.

### Styling

Colors, spacing, and triage-level indicators are defined in shared SCSS tokens. No hard-coded values in component styles.

## Trade-offs & Assumptions

- **In-memory state only.** Refreshing the page resets the queue. Intentional for the scope of the exercise.
- **No backend integration.** All operations are synchronous and local.
- **Dropdown for triage per row.** Chosen for compactness — an ER queue can have many patients on screen at once.
- **Numeric triage levels.** Keeps priority sorting straightforward: `a.triageLevel - b.triageLevel`.
- **Deterministic ordering.** Triage first, arrival time second. In an ER context, predictable and auditable ordering matters.

## Known Limitations

- Queue state is lost on refresh.
- No loading or error states for queue operations (no real API).
- No pagination or virtual scrolling for large queues.
- No end-to-end tests.
- Accessibility was considered but not exhaustively audited.
- Responsive layout was designed for desktop and tablet but not validated against real clinical-device constraints.

## Next Steps (More Time)

- Mock or real API integration with loading and error states per operation
- Persist queue state across refreshes (WebSocket for multi-user sync, `localStorage` as a minimum)
- Virtual scrolling for large queues (`@angular/cdk/scrolling`)
- End-to-end tests with Playwright for the main intake → queue → discharge flow
- Full accessibility audit with axe-core
- Queue history / completed-patient tracking

## AI Usage

- **Where AI was used:** Claude (Claude Code CLI) and GitHub Copilot for scaffolding, boilerplate generation, test skeletons, and first drafts of services and the error interceptor.

- **What was generated vs manually implemented:** AI helped with initial structure and some first-pass code. Architecture decisions, service scoping, debugging, and refinement were handled manually. Two bugs in AI-generated code were caught and fixed:
  - The waiting-time pipe was initially `pure: false` with a tick signal that was never read in any template. With `OnPush`, Angular only re-evaluates pure pipes when their inputs change — without passing `tick` as an explicit pipe argument, the waiting times froze silently on screen. Fixed by switching to `pure: true` and threading `tick` as a second argument from dashboard → row → pipe.
  - The triage select used `[value]` on the `<select>` element. Angular applies that binding before `@for` has rendered the `<option>` elements, so the control ends up with no matching option selected. Fixed by moving selection logic to `[selected]="level === patient().triageLevel"` on each individual option.

  Both required understanding the Angular rendering and change detection pipeline to diagnose, not just reading an error message.

- **What I validated myself:** Application structure and architectural choices, queue ordering and re-sorting on triage change, admit/discharge behavior, waiting-time live updates, form validation and focus management, all Copilot PR review suggestions (applied some, adjusted others, skipped none without reasoning), and final test results.

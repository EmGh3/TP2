Title: fix(zone): prevent long-running timers/subscriptions (Zone pollution fixes)

Summary

This branch implements a set of defensive fixes to avoid DOM/timer/subscription leaks across the app. The goal is to ensure components properly clean up long-running resources in ngOnDestroy and to prefer safe one-shot patterns for HTTP flows.

What I changed (high level)

- Added teardown to Observable with setInterval so the timer is cleared on unsubscribe.
  - `src/app/rxjs/test-observable/test-observable.component.ts`
- Added `destroy$` + `takeUntil` to long-lived component subscriptions and bound handlers so event listeners can be removed reliably.
  - `src/app/cv/add-cv/add-cv.component.ts` (valueChanges, statusChanges, form.valueChanges) — added bound handler for beforeunload and clearTimeout on destroy
  - `src/app/cv/cv/cv.component.ts` (selectCv$ subscription) — added takeUntil
- Cleared blur timeout in autocomplete so it doesn't update state after destroy.
  - `src/app/cv/autocomplete/autocomplete.component.ts`
- Defensive unsubscribe for immediate `from`/`of` subscriptions.
  - `src/app/rxjs/from-of/from-of.component.ts`
- Replaced manual subscribe for one-shot HTTP calls with `firstValueFrom` for clarity.
  - `src/app/cv/details-cv/details-cv.component.ts`

Tests added

- `src/app/rxjs/test-observable/test-observable.component.spec.ts` — verifies interval teardown doesn't leak after unsubscribe
- `src/app/cv/add-cv/add-cv.component.spec.ts` — asserts beforeunload listener removal and autosave timer cleared on destroy

How to run tests locally

- Install deps (if not installed):

```powershell
npm install
```

- Run unit tests:

```powershell
npm test -- --watch=false
```

Notes and rationale

- Many HTTP calls were one-shot and already safe; I converted a few to `firstValueFrom` for clarity and to avoid creating unnecessary subscriptions.
- For form control and service subjects that are long-lived, we added `takeUntil(this.destroy$)` and complete `destroy$` in ngOnDestroy.
- For DOM/timer-based callbacks, we keep references to the handler/timeout id so they can be removed/cleared during cleanup.

Next steps / recommended follow-ups

- Run `ng lint` locally and address any style issues (I made functional fixes; lint may recommend stylistic changes).
- Push this branch and open a PR for review: `git push -u origin fix/zone-pollution-20251130` then open PR on GitHub.
- Optionally scan additional modules for similar patterns and add more unit tests to assert cleanup across the app.

Files changed (major)

- src/app/rxjs/test-observable/test-observable.component.ts
- src/app/cv/add-cv/add-cv.component.ts
- src/app/cv/cv/cv.component.ts
- src/app/cv/autocomplete/autocomplete.component.ts
- src/app/rxjs/from-of/from-of.component.ts
- src/app/cv/details-cv/details-cv.component.ts
- plus tests modified/added

Checklist for PR

- [ ] CI (unit tests) green
- [ ] Code review by a teammate
- [ ] Optional: run e2e locally to ensure no regression

If you want, I can try to push the branch; your environment previously returned a 403 when attempting to push. If you want me to reattempt, confirm and I will retry; otherwise, you can push and open the PR with the commands above.

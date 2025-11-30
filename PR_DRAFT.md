## PR draft: fix(zone): prevent zone pollution (timers/subscriptions/listeners)

This is a ready-to-post PR body for branch `fix/zone-pollution-20251130`.

Summary
-------
- Fixes several potential "zone pollution" and resource-leak patterns across the app (timers, event listeners, long-lived subscriptions).
- Adds unit tests that assert teardown behavior for representative components.

Files changed (high level)
- src/app/cv/add-cv/add-cv.component.ts — use Renderer2.listen + RxJS timer for autosave; unsubscribe/unlisten in ngOnDestroy
- src/app/cv/cv/cv.component.ts — use firstValueFrom() in ngOnInit for one-shot getCvs()
- src/app/auth/login/login.component.ts — convert auth subscribe to firstValueFrom
- src/app/cv/autocomplete/autocomplete.component.ts — clear blur timeout in ngOnDestroy
- src/app/rxjs/test-observable/* — add teardown for interval-backed observable and tests
- tests added/updated: autocomplete.spec.ts, test-observable.spec.ts, add-cv.spec.ts

What to verify locally
----------------------
1. Install deps if needed:

```powershell
npm install
```

2. Unit tests:

```powershell
npm test -- --watch=false
```

3. Run dev server and optionally E2E (dev server must be running and reachable at http://localhost:4200):

```powershell
npm start
# in a separate shell (after the server is up):
npx cypress run --spec "cypress/e2e/embauche.spec.ts" --headless
```

Suggested reviewers & labels
----------------------------
- Reviewers: @team-frontend, @maintainer (pick actual usernames)
- Labels: bug, cleanup, tests

Checklist for PR
----------------
- [ ] Unit tests pass in CI
- [ ] Code review approval
- [ ] Optional: Run E2E locally or in CI against staging
- [ ] Add lint fixes if CI flags style issues

Notes
-----
- I could not push the branch due to remote permissions (HTTP 403). I included a `patches/` folder and a `fix-zone-pollution.bundle` in the repo root so you can fetch/apply the commits on a machine with push rights.
- If you prefer, I can prepare a small GitHub Actions workflow that runs the leak-detection tests on PRs — say the basic `node` + `npm test` matrix. Ask and I'll add it to this branch.

Commands to push from your machine (PowerShell)
---------------------------------------------
```powershell
git checkout -b fix/zone-pollution-20251130
git am patches/*.patch
git push -u origin fix/zone-pollution-20251130
```

Or fetch from bundle:

```powershell
git fetch ../fix-zone-pollution.bundle HEAD:fix/zone-pollution-20251130
git push -u origin fix/zone-pollution-20251130
```

---
If you want, I can now:
- Draft the PR on GitHub (title, description, checklist, reviewers) once you push.
- Add a small GitHub Actions workflow to fail PRs if unit tests fail.

Tell me which of those you want next and I'll proceed.

# PR: fix(zone): prevent zone pollution (timers/subscriptions/listeners)

Summary
-------
This PR fixes several potential "zone pollution" and resource-leak patterns across the app (timers, global event listeners, heavy synchronous work in Angular zone, and long-lived subscriptions). It adds unit tests that assert teardown behavior and a small CI workflow to run typecheck + tests on PRs.

What changed (high level)
-------------------------
- Use Renderer2.listen + unlisten where global listeners were present (e.g. `AddCvComponent`).
- Replace raw setTimeout autosave with RxJS `timer`+Subscription and unsubscribe in ngOnDestroy (`AddCvComponent`).
- Add `destroy$` + `takeUntil` patterns where appropriate for long-lived subscriptions.
- Convert one-shot HTTP subscribes to `firstValueFrom` for clarity and safe one-shot usage (`CvComponent`, `LoginComponent`).
- Provide teardown for Observables built with `setInterval` (clearInterval in teardown function).
- Reduce CPU/zone pollution in `optimizationPattern/`:
  - Replace recursive Fibonacci with iterative algorithm (`user-list.component.ts`).
  - Create heavy ChartJS chart outside Angular zone and destroy it in ngOnDestroy (`rh.component.ts`).
- Add tests for cleanup (autocomplete blur timeout, autosave unlisten/unsubscribe, test-observable teardown, chart create/destroy).
- Add CI workflow `.github/workflows/ci.yml` to run type-check and unit tests on PRs and pushes to this branch.

Files changed (major)
--------------------
- src/app/cv/add-cv/add-cv.component.ts (+ spec)
- src/app/cv/cv/cv.component.ts
- src/app/auth/login/login.component.ts
- src/app/cv/autocomplete/autocomplete.component.ts (+ spec)
- src/app/rxjs/test-observable/* (+ spec)
- src/app/rxjs/from-of/from-of.component.ts
- src/app/optimizationPattern/user-list/user-list.component.ts
- src/app/optimizationPattern/rh/rh.component.ts (+ spec)
- .github/workflows/ci.yml
- PR_DRAFT.md / PR_DESCRIPTION.md / PR_FINAL.md (this file)

How I validated locally
----------------------
- Ran TypeScript type-check: `npx tsc -p tsconfig.json --noEmit` (no errors).
- Ran unit tests (Karma): `npm test -- --watch=false` — unit tests passed in this environment after the changes.

How to push & open PR (copy/paste)
---------------------------------
Apply patch series (keeps commit metadata):
```powershell
git checkout -b fix/zone-pollution-20251130
git am patches/*.patch
git push -u origin fix/zone-pollution-20251130
```

Or fetch the bundle and push:
```powershell
git fetch ./fix-zone-pollution.bundle HEAD:fix/zone-pollution-20251130
git checkout fix/zone-pollution-20251130
git push -u origin fix/zone-pollution-20251130
```

Create PR (web):
- Open: https://github.com/EmGh3/TP2/pulls → New pull request
- Base: `signal`, Compare: `fix/zone-pollution-20251130`.
- Paste this PR body or `PR_DRAFT.md`.

Create PR (gh CLI):
```powershell
gh auth login --web
gh pr create --base signal --head fix/zone-pollution-20251130 \
  --title "fix(zone): prevent zone pollution (timers/subscriptions/listeners)" \
  --body-file PR_DRAFT.md \
  --label bug,cleanup,tests \
  --reviewer <reviewer1>,<reviewer2>
```

Notes and recommended follow-ups
--------------------------------
- After PR is opened, CI will run the typecheck and unit tests (workflow added). Address any CI failures/lint issues if they appear.
- Consider scanning other folders for the same patterns and add small unit tests if needed.
- Optionally add a small runtime dev-only monitor that logs long-running intervals/subscriptions to help catch regressions.

If you want, I can:
- Attempt to push the branch from here again (will likely fail unless remote auth changed).
- Create a ZIP of `fix-zone-pollution.bundle` + `patches/` for easy transfer (say "make zip").
- Draft the GitHub PR (labels, reviewers) once you confirm the branch is pushed.

---
End of PR body.

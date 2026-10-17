# My Healthcare — MVP Roadmap

This is a planning document. A task is **not complete** until code exists, it has been tested, and the evidence is recorded.

## Phase 0 — Validate the problem

- [ ] Interview 10–20 people in one chosen user segment.
- [ ] Record their current way of deciding meals and tracking food.
- [ ] Identify the three most frequent pain points.
- [ ] Test whether budget, food preference, routine, or tracking is the strongest initial wedge.
- [ ] Record findings and update the product brief.

**Tests:** interview notes and a short synthesis exist.
**Done when:** one initial segment and one main use case are chosen based on evidence.

## Phase 1 — Clickable / working MVP

- [ ] Language selection (Hindi/English).
- [ ] Basic onboarding and explicit consent.
- [ ] Food preference library with Regularly Eat / Can Eat / Avoid.
- [ ] Meal logging and edit/delete.
- [ ] Daily dashboard with transparent estimates.
- [ ] Meal suggestion screen with Accept / Edit / Replace / Regenerate.
- [ ] Clear empty, loading, error, and offline states.
- [ ] Safety notices and a route to seek professional advice where appropriate.

**Tests:** onboarding, logging, edits, preference filters, and error states are manually or automatically tested.
**Done when:** a new user can complete the core flow without founder intervention.

## Phase 2 — Baseline and feedback

- [ ] Support a 15-day baseline period.
- [ ] Avoid presenting personalized recommendations as validated during baseline collection.
- [ ] Let users correct missing or inaccurate entries.
- [ ] Add weekly summaries of recorded behavior.
- [ ] Conduct a small usability pilot with informed participants.

**Tests:** date boundaries, missing data, edited logs, and baseline status are tested.
**Done when:** pilot users can explain what the dashboard means and where estimates are uncertain.

## Phase 3 — Data quality and integrations

- [ ] Select a reputable nutrition data source and document its license/coverage.
- [ ] Show quantities, assumptions, and confidence limitations.
- [ ] Evaluate Health Connect / Apple Health support only if it adds clear user value.
- [ ] Implement opt-in permission flows, revocation, and manual fallback.
- [ ] Do not claim exact nutrition from photos without validated measurement capability.

**Tests:** missing nutrient data, denied permissions, revoked permissions, and sync failures.
**Done when:** estimates and integration status are transparent and gracefully degrade.

## Phase 4 — Pro hypothesis

- [ ] Interview users about detailed meal plans and budget-aware personalization.
- [ ] Test willingness to pay before committing to subscription architecture.
- [ ] Consider gram-based plans only when food data and serving assumptions support them.
- [ ] Consider specific goal templates only with appropriate safety boundaries.

**Tests:** user comprehension, pricing interviews, and safe handling of allergies/restrictions.
**Done when:** a paid feature solves a validated problem and can be delivered responsibly.

## Release gates

- [ ] No secrets in source control.
- [ ] Privacy notice and consent are reviewed.
- [ ] User data export/delete behavior is defined.
- [ ] No diagnostic, treatment, or guaranteed-result claims.
- [ ] Core flows and error states are tested.
- [ ] Demo accurately labels mocked, planned, and live functionality.

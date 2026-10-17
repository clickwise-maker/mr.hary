# My Healthcare

> **Project archive / source of truth.** This folder preserves the product concept and decisions so development can resume without losing the original direction.

## Status

- **Stage:** idea / product specification; implementation status must be verified before describing features as working.
- **Founder setup:** solo founder.
- **Primary market hypothesis:** Indian users who want practical, affordable daily nutrition guidance.
- **Core promise:** help people decide what to eat now using their food preferences, budget, routine, and goals.
- **Safety boundary:** wellness and nutrition support, not diagnosis, treatment, or emergency medical advice.

## Product concept

My Healthcare is a personalized daily health companion. It starts with baseline tracking, then helps users make more practical food and nutrition decisions using their preferences, routine, goals, and budget.

### Product principles

1. Be useful for everyday decisions, not just retrospective charts.
2. Make suggestions explainable and editable.
3. Respect food choices, allergies, restrictions, budget, language, and schedule.
4. Never pretend estimates are exact measurements.
5. Keep users in control: Accept, Edit, Replace, or Regenerate suggestions.
6. Clearly separate planned features from features that have actually been implemented and tested.

## MVP scope

1. Onboarding: language, age, height, weight, routine, sleep, goal, allergies, restrictions.
2. Food preferences: a starter library of 50 vegetarian and 50 non-vegetarian foods; users mark **Regularly Eat**, **Can Eat**, or **Avoid**.
3. Baseline period: first 15 days focus on tracking and establishing a baseline; do not present personalized advice as validated during this period.
4. Food logging: text-first logging initially; photo logging only if reliably implemented and validated.
5. Daily dashboard: estimated nutrition balance, water tracking, and logged meals.
6. Suggestions: practical meal options that respect the user's preferences, timing, and budget; user can accept, edit, replace, or regenerate.
7. Weekly review: summarize recorded patterns and progress without diagnosis or guarantees.
8. Manual-first tracking. Optional Health Connect / Apple Health integration only when supported and explicitly authorized.

## Later / Pro direction

Potential paid mode, only after validation:
- More detailed gram-based meal plans with multiple vegetarian/non-vegetarian options.
- Goal-specific plans for users such as runners or bodybuilders.
- Budget-aware meal planning (for example, a user-defined daily food budget).
- Additional integrations and personalization.

These are roadmap ideas, not claims of current functionality.

## Key documents

- [Product brief](docs/product-brief.md)
- [MVP and roadmap](docs/roadmap.md)
- [Safety, privacy, and product decisions](docs/decisions.md)
- [Founder / funding brief](docs/funding-brief.md)

## Next step

Build a small demonstrable prototype, test it with a small group of users, record what works and what does not, and update this folder with evidence before applying to accelerators.

## Accuracy rule

Never claim that the app is live, that health integrations work, that AI nutrition estimates are clinically validated, or that users have achieved outcomes unless there is evidence in the repository to support the claim.

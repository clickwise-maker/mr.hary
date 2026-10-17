# My Healthcare — Decisions and Guardrails

## Preserved product decisions

- Product name: **My Healthcare**.
- Start with a Free / Normal mode.
- First 15 days are for baseline tracking, not a promise of validated personalized advice.
- Initial languages: Hindi and English; additional languages may follow.
- Starter food library concept: 50 vegetarian and 50 non-vegetarian foods.
- Food labels: **Regularly Eat**, **Can Eat**, **Avoid**.
- Manual tracking must remain available even if a watch or health-platform integration is unavailable.
- Dashboard concept: Live Nutrition Balance with estimates such as protein and water; food logging can be text-first, with photo logging only when supported.
- Suggestion controls: **Accept / Edit / Replace / Regenerate**.
- Weekly review summarizes the user's recorded patterns.
- Pro is a future paid mode, not a current promise: detailed meal options, possible gram-based plans, goals, and budget-aware planning.
- A future own-watch phase is not part of v1.

## Safety boundaries

- The product is a wellness/nutrition companion, not a diagnostic or treatment system.
- Do not guarantee weight loss, disease prevention, or medical outcomes.
- Do not tell users to stop medication or ignore a clinician.
- Treat allergies, dietary restrictions, and missing/conflicting information conservatively.
- Avoid dangerous calorie restriction or extreme diet recommendations.
- If a request indicates an urgent medical situation, direct the user to local emergency services or qualified medical care rather than trying to manage it with meal advice.
- Clearly label generated content and estimated nutrient values.

## Privacy and security requirements

- Collect the minimum data necessary.
- Explain collection and purpose before requesting health-related data.
- Use explicit opt-in for external health-platform integrations.
- Keep authentication secrets and API keys out of the repository.
- Define retention, deletion, export, and access controls before collecting real users' health data.
- Do not use real personal health information in demo fixtures or screenshots.
- Restrict access to sensitive records and log privileged access without logging unnecessary health details.
- Review applicable Indian data-protection and health-related requirements before launch.

## Product truthfulness

Every feature must be marked as one of:
- **Planned** — idea only.
- **Prototype** — partial/demo implementation; may use mock data.
- **Implemented** — code exists.
- **Tested** — verification evidence exists.
- **Released** — users can access it.

Never upgrade a feature's status without evidence.

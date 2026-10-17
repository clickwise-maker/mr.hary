# My Healthcare — Product Brief

## 1. Problem hypothesis

People may have access to plenty of health and food information yet still struggle with a daily practical question: **what should I eat now, given my goals, food preferences, schedule, and budget?**

This is a hypothesis to validate with interviews and prototype tests, not yet a proven market finding.

## 2. Product vision

A friendly daily health companion that turns a user's food preferences and routine into understandable, adjustable nutrition decisions.

Working positioning line:
> Health trackers tell you what happened; My Healthcare aims to help you decide what to eat next.

Do not use this as a claim of superiority over named competitors until comparative evidence exists.

## 3. Intended initial user

Start with a narrow group of Indian adults who:
- want to improve everyday eating habits;
- have a limited or clearly defined food budget;
- eat familiar home-cooked or locally available foods;
- want simple guidance rather than complex nutrition dashboards.

Choose the first specific user segment after interviews.

## 4. Inputs

- Preferred language (initially English and Hindi; more languages later).
- Age, height, weight, routine, sleep, and goal, when voluntarily provided.
- Allergies, dietary restrictions, and foods to avoid.
- Food preferences and foods the user regularly eats.
- Budget and meal timing.
- Optional activity data from a supported health platform, with explicit permission.
- Manual logging if integrations are unavailable.

Collect only what is needed. Explain why sensitive health-related information is requested, how it is used, and how the user can delete it.

## 5. Main experience

1. Welcome and explain scope/limitations.
2. User selects language and completes basic onboarding.
3. User selects foods as **Regularly Eat**, **Can Eat**, or **Avoid**.
4. First 15 days: baseline tracking, logging, and preference correction.
5. Dashboard displays logged information and clearly labeled estimates.
6. The user requests meal suggestions.
7. Suggestions show their rationale and allow **Accept / Edit / Replace / Regenerate**.
8. Weekly review summarizes recorded habits and uncertainty.
9. User can correct or delete entries and change preferences.

## 6. Nutrition balance

The dashboard may estimate items such as protein, water, and selected nutrients remaining against a user goal. Estimates must disclose uncertainty and depend on food quantities and reliable nutrition data. Do not imply that a photo alone provides exact gram-level nutrition.

## 7. Monetization hypothesis

Free / Normal mode:
- onboarding, baseline tracking, basic food logging, and general suggestions within a clearly defined limit.

Potential Pro mode:
- more detailed meal options;
- gram-based plans when data quality supports them;
- budget and goal-specific planning;
- richer review and integrations.

Validate willingness to pay before finalizing feature gates or pricing.

## 8. Success metrics to test

- Onboarding completion.
- Percentage of users who log meals on multiple days.
- Suggestion acceptance, edit, replace, and regenerate rates.
- User-reported usefulness and trust.
- Week-one and week-four retention.
- Nutrition-estimate correction rate.
- Safety incidents or suggestions blocked due to missing/conflicting information.

Do not optimize only for engagement; prioritize safe and useful outcomes.

## 9. Unknowns to validate

- Which initial segment has the strongest repeated need?
- Do users want meal decisions, tracking, or both?
- What data source is reliable enough for nutrition estimates?
- Which recommendations can be offered safely without a clinician?
- Will users pay, and for which specific benefit?
- What data must be retained, and for how long?

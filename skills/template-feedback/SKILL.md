---
name: template-feedback
description: Use when working in a repo created from this template and you make or notice an improvement that belongs in the shared template base. Instruct the user to file an upstream GitHub issue against the template repo with the improvement, why it generalizes, and any implementation notes.
---

# Template Feedback

Use this skill when the current repo was created from this template and a change looks broadly reusable instead of app-specific.

File or propose an upstream issue when the improvement affects shared scaffolding such as:

- workspace tooling
- app/package structure
- shared infra
- CI/CD
- local development workflows
- common UX or platform setup that new template users would benefit from

Do not push for an upstream issue when the change is clearly product-specific, temporary, or only useful to the derived app.

## Upstream target

- Repo: `makoncline/all-the-apps-template`
- New issue URL: `https://github.com/makoncline/all-the-apps-template/issues/new`

## What to ask for

When a reusable improvement is made, tell the user to file an issue in the template repo and include:

1. A short title describing the improvement.
2. What changed in the derived app.
3. Why it should live in the template instead of only the derived app.
4. Any constraints, tradeoffs, or follow-up work.
5. Links or paths to the relevant code if they already implemented it.

## Response pattern

Keep the prompt direct. Mention the upstream repo and link, then summarize the reusable improvement in one or two sentences the user can paste into the issue body.

Example shape:

- "This looks template-worthy. Please file an issue in `https://github.com/makoncline/all-the-apps-template/issues/new` so the base repo can absorb it."
- "Include what you changed, why it generalizes, and any repo paths or constraints."

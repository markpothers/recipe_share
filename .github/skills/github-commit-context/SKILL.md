---
name: github-commit-context
description: 'Load GitHub commit and PR context for files under review. Use when: reviewing what changed in a refactoring, understanding scope of a branch, regression review needs change context, checking what files were modified, understanding before/after of a class-to-functional migration.'
argument-hint: 'File path or component name to check change context for'
---

# GitHub Commit Context Workflow

## Purpose

Establish what changed and where before beginning a regression review or refactoring analysis. This prevents reviewing the wrong file version and ensures regression checks are scoped to actual changes.

---

## Procedure

### Step 1 — Check for an Active Pull Request

Use the `github-pull-request_activePullRequest` tool to check if the current branch has an open PR.

- If a PR exists: note the PR title, description, and linked files — these describe the intended scope of the refactoring
- If no PR: proceed to step 2

### Step 2 — List Changed Files on the Branch

Use the `get_changed_files` tool to list all files changed on the current branch relative to the default branch (`master`).

From the changed files list, identify:
- The **original class component** file (if still present, e.g., `chefDetails.js`)
- The **new functional component** file (e.g., `chefDetails.tsx`)
- The **new hook file** (e.g., `src/chefDetails/hooks/useChefDetailsModel.ts`)
- Any **test files** that were added or modified
- Any **type files** that were modified

### Step 3 — Summarize the Change Context

Produce a structured summary:

```
## Change Context Summary

Branch: <branch name>
PR: <PR title and number, or "None">

### Files Changed
| File | Status | Role |
|---|---|---|
| src/.../chefDetails.js | modified | Original class component (partially preserved) |
| src/.../chefDetails.tsx | added | New functional component shell |
| src/.../hooks/useChefDetailsModel.ts | added | Extracted hook |
| ... | ... | ... |

### Scope Notes
- <Any notable patterns — e.g., "original .js file retained for comparison">
- <Any unexpected files changed — e.g., type files, navigation files>

### Regression Focus Areas
Based on the changed files, the highest regression risk areas are:
1. <area 1>
2. <area 2>
3. <area 3>
```

---

## Usage in Regression Review

After producing the Change Context Summary, hand it to the **RegressionReviewAgent** as opening context so it knows precisely which files to compare and which change vectors to focus on.

---

## Communication Style

- Keep responses short and clear — no verbose narration.
- If the change context surfaces more than 3 regression focus areas, present them one at a time for discussion before proceeding.
- Track agreed scope decisions in a running plan; implement together once all are reviewed.

---

## Notes

- **This codebase commits directly to `master`** — there is no feature branch workflow. `get_changed_files` compares the working tree against the last committed state. If nothing is staged/uncommitted, results may be empty. In that case, skip to Step 3 and use the file list provided by the user or agent invoking this skill.
- If `get_changed_files` returns no changes, ask the user which files are part of the refactoring being reviewed and proceed with those.
- If the original class component file is no longer present (deleted and replaced), note this — it means the refactoring replaced rather than renamed the file. The RegressionReviewAgent will rely on the hook structure and test changes alone, which increases uncertainty in ratings.
- This skill does not evaluate code quality — it only establishes what changed and where

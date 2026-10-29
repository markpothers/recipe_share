# Recipe-Share

Recipe-Share is a social app for creating, saving, and browsing recipes. A **Chef** is a member account; recipes can be fully authored in the app or saved as a **blog preview** that links to an external page.

TypeScript names for API and UI shapes live in `recipeshare/src/centralTypes.ts`. This glossary uses the same words agents should use in issues, tests, and docs.

## People

**Chef**:
A person who uses the app; the account holder and author of recipes. Not a generic “user” in product language.
_Avoid_: User (when meaning a member account)

**Logged-in Chef**:
The authenticated session identity the app holds after login (`LoggedInChef` in code).
_Avoid_: Current user, auth user

**Simple Chef**:
The core profile fields for a Chef embedded inside a full Chef-details payload (`SimpleChef`).

## Recipes

**Recipe**:
The full recipe payload for the recipe details screen—ingredients, instructions, images, comments, and nested recipe metadata (`Recipe` in code).
_Avoid_: Full recipe (prefer **Recipe** vs **List Recipe** when distinguishing list rows)

**List Recipe**:
A summary row for one recipe in a feed or list—enough to render a card and navigate to details (`ListRecipe`). Not the same shape as **Recipe**.
_Avoid_: Recipe summary, card recipe

**Blog preview**:
A recipe whose details screen shows metadata in the app and renders the source page in a WebView when `show_blog_preview` is true and an acknowledgement link is set.
_Avoid_: Blog recipe (as a separate entity type)

**Full recipe (display mode)**:
A recipe whose details screen shows ingredients, instructions, and photos authored in the app (`show_blog_preview` false, or content provided in-app).

**New recipe**:
The in-progress composition state while a Chef creates or edits a recipe before save (`NewRecipe`).

## Chefs in lists and detail

**List Chef**:
A summary row for one Chef in a Chef list—counts and profile basics for list cards (`ListChef`).
_Avoid_: Chef summary

**Chef details**:
The full Chef profile payload for the Chef details screen—stats, follow state, and related lists (`Chef` in code wraps `SimpleChef` plus activity fields).

## Screens (product)

**Recipe list**:
A tab or stack screen that loads a defined collection of **List Recipe** rows (feed, my recipes, liked recipes, browse lists, etc.).

**Chef list**:
A screen that loads a defined collection of **List Chef** rows (follow graph, newest, most popular, etc.).

**Recipe details**:
The screen that loads one **Recipe** and renders either a **full recipe** or **blog preview**.

**Chef details**:
The screen that loads one **Chef details** payload and sub-lists of that Chef’s recipes.

**New recipe**:
The screen where a Chef composes a **New recipe** (keyboard or voice input).

## Lists (definitions)

**Recipe list definition**:
Which recipes appear in a **Recipe list** (e.g. my feed, recipes I like, newest)—driven by list query parameters and API endpoints, not a separate domain object name in code.

**Chef list definition**:
Which chefs appear in a **Chef list** (e.g. chefs I follow, top chefs)—see `ChefListQuery` and navigation enums in `recipeshare/src/navigation/types.ts`.

---
name: refactoring-patterns
description: 'Load RecipeShare class-to-functional refactoring patterns, conventions, known traps, and per-refactoring checklist. Use when: starting a refactoring task, converting a class component, extracting a hook, checking splitting conventions, reviewing naming patterns, or auditing lifecycle migration.'
argument-hint: 'Component name or file path to refactor'
---

# RecipeShare Class → Functional Component Refactoring Patterns

## Reference Files (Gold Standard)

- Hook: `src/newRecipe/hooks/useNewRecipeModel.tsx`
- Component: `src/newRecipe/newRecipe.tsx`

Use these two files as the canonical before/after examples when planning any refactoring.

---

## File Split Convention

Every refactored feature produces exactly **two files**:

| Role | Location | Naming |
|---|---|---|
| Hook | `src/<feature>/hooks/use<Feature>Model.ts` | camelCase, `use` prefix, `Model` suffix |
| Component | `src/<feature>/<Feature>.tsx` | PascalCase, replaces original `.js` file |

Examples:
- `src/newRecipe/hooks/useNewRecipeModel.tsx` + `src/newRecipe/newRecipe.tsx`
- `src/chefDetails/hooks/useChefDetailsModel.ts` + `src/chefDetails/chefDetails.tsx`
- `src/profile/hooks/useProfileModel.ts` + `src/profile/profile.tsx`

---

## Hook Shape

```typescript
export const use<Feature>Model = (
    navigation: <Feature>NavigationProps,
    route: <Feature>RouteProps,
    // ...any imperative refs passed in from component
) => {
    // All useState, useCallback, useEffect, useRef, useMemo here
    // Redux access via useAppSelector(getLoggedInChef) from ../../redux

    return {
        // Single flat object — do NOT destructure internally
        // All state values, callbacks, and refs the component needs
    };
};
```

**Rules**:
- Hook receives `navigation` and `route` as parameters (not from context)
- Any refs the component owns and passes imperatively (e.g., `FlatList` ref, `TextInput` ref) are passed INTO the hook, not created inside it
- Redux state accessed via `useAppSelector` — never prop-drilled
- Returns a **single flat object** with all state + handlers the component needs
- Hook file is `.ts` unless it renders JSX (e.g., uses `AppHeader` inline), in which case use `.tsx`

---

## Component Shape

```tsx
export default function <Feature>({ navigation, route }: <Feature>Props) {
    const scrollRef = useRef<FlatList>(null);
    // Only refs for imperative DOM/native control — no other state here

    const model = use<Feature>Model(navigation, route, scrollRef /*, ...other refs*/);

    return (
        // Thin JSX shell — all logic comes from model
        // Destructure from model at point of use: model.someValue, model.someCallback
    );
}
```

**Rules**:
- Component owns refs (creates them with `useRef`)
- Component passes refs into hook
- All event handlers, state values, and derived state come from the hook
- No business logic, fetch calls, or state management in the component file

---

## Known Traps (High-Risk Migration Areas)

### 1. Abort Controller
Class components often cancel fetches via instance variables. In hooks, abort controllers must be created fresh per fetch and stored in a `useRef` if shared across calls.

```typescript
// Wrong — recreates on every render
const controller = new AbortController();

// Right — persists across renders
const abortController = useRef<AbortController | null>(null);
// In fetch: abortController.current = new AbortController();
```

### 2. NetInfo Subscription Cleanup
NetInfo subscriptions returned from `addEventListener` must be unsubscribed in the `useEffect` cleanup. Missing this causes memory leaks and stale callbacks.

```typescript
useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => { ... });
    return () => unsubscribe();
}, []);
```

### 3. Scroll Ref Callbacks (`scrollToTop`, `scrollToOffset`)
`this.recipeFlatList.current.scrollToOffset(...)` in class components becomes `recipeFlatList.current?.scrollToOffset(...)` in hooks. The ref is passed in from the component — the hook must NOT create it.

Check: is `scrollToTop` still wired to the header button? This is registered via `navigation.setOptions` and is a common regression point.

### 4. Header Button Registration (`navigation.setOptions`)
In class components, `componentDidMount` called `this.props.navigation.setOptions(...)` once.  
In hooks, this must be in a `useEffect` with correct dependencies. A stale closure is the most common failure mode — if the callback inside `setOptions` captures state from the first render only, the header button will call a stale version of the function.

```typescript
useEffect(() => {
    navigation.setOptions({
        headerRight: () => <Button onPress={scrollToTop} />  // scrollToTop must be stable via useCallback
    });
}, [navigation, scrollToTop]); // scrollToTop in deps array
```

### 5. Search Bar Z-Index / Animated Position
Search bars managed with `Animated.Value` in class components (e.g., `yOffset`, `searchBarZIndex`) need `useRef` in hooks — `useState` will cause unnecessary re-renders and position resets. The animation value itself is not React state.

```typescript
// Wrong
const [yOffset] = useState(new Animated.Value(0));

// Right
const yOffset = useRef(new Animated.Value(0)).current;
```

### 6. Pagination Offset
`componentDidUpdate` often compared `prevProps.offset !== this.props.offset` to trigger the next page fetch. In hooks, this is a `useEffect` with the offset value in the dependency array. Ensure the offset state update and fetch trigger are not creating an infinite loop.

### 7. `componentDidUpdate` Guard Patterns
Class components use `if (condition) return;` guard patterns inside `componentDidUpdate`. Translating these to `useEffect` requires splitting into separate effects by concern, or using `useRef` to track previous values.

---

## Communication Style

- Keep responses short and clear. Avoid lengthy explanations unless asked.
- If a refactoring raises more than 3 issues (traps, risks, checklist failures), present them one at a time for discussion.
- Record the outcome of each sub-discussion in a running plan. Apply all decisions together once all issues are reviewed.

---

## Per-Refactoring Checklist

Run through this checklist for every component being refactored:

### State Audit
- [ ] All `this.state` fields → `useState` hooks
- [ ] All `this.setState` calls → corresponding setter functions
- [ ] Any instance variables (`this.foo`) → `useRef` for mutable, `useState` for reactive

### Lifecycle Audit
- [ ] `componentDidMount` → `useEffect(fn, [])` with cleanup if any subscriptions
- [ ] `componentWillUnmount` → return value of `useEffect` cleanup
- [ ] `componentDidUpdate` with guards → split into separate `useEffect` hooks by concern
- [ ] Any `shouldComponentUpdate` → `React.memo` + `useCallback` for stable callbacks

### Render Audit
- [ ] `this.props.X` → destructured from `navigation`/`route`/model return
- [ ] `this.state.X` → from model return object
- [ ] `this.methodName` → from model return object (ensure `useCallback` wrapping)

### Ref Audit
- [ ] Instance refs (`this.scrollRef`) → `useRef` in component, passed to hook
- [ ] `createRef` in class constructors → `useRef` in component
- [ ] Any `ref.current` null-checks present where needed

### Redux Audit
- [ ] `mapStateToProps` → `useAppSelector(getLoggedInChef)` inside hook
- [ ] `mapDispatchToProps` → `useAppDispatch()` inside hook (if needed)
- [ ] `connect(...)` HOC → removed entirely

### Type Audit
- [ ] Props type defined (navigation + route props from `../../navigation`)
- [ ] Hook return type defined (explicit interface, not inferred)
- [ ] All local types checked against `src/centralTypes.ts` for duplicates
- [ ] No `any` types introduced

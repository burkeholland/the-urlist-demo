# Drag-and-Drop Reorder Plan

TL;DR — Add single-item in-list reordering to `app/new/page.tsx` using `@dnd-kit` (core + sortable). Keep order in memory only; update the existing `links` state on drag end, add minimal drag styling via `cn`, and include keyboard accessibility (keyboard sensor). No changes to add/remove flows.

## Steps

1. Install dependencies: add `@dnd-kit/core`, `@dnd-kit/sortable`, and optionally `@dnd-kit/modifiers` to `package.json` and install them.
2. Add an `arrayMove<T>(arr: T[], from: number, to: number): T[]` helper in `lib/utils.ts` (export it for reuse).
3. Edit `app/new/page.tsx`: wrap the links list in `DndContext` and `SortableContext`; make each displayed link a sortable item via `useSortable` (use the link string or a stable id as the item `id`).
4. Implement `onDragEnd` to compute `active.index` and `over.index`, call `arrayMove(links, fromIndex, toIndex)`, and `setLinks` with the resulting array (preserve existing dedupe rules).
5. Add minimal UX/accessibility: keyboard sensor, `aria-live` status for reorder completion, and toggle `isDragging` classes via `cn` to show subtle elevation/outline on the dragged item and a highlighted drop slot.

## Files to edit

- `package.json` — add the dnd-kit dependencies.
- `lib/utils.ts` — add and export `arrayMove` helper.
- `app/new/page.tsx` — primary edits: import DnD providers/hooks, convert each displayed link into a sortable item, implement `onDragEnd` that updates `links` state, and add drag-active CSS toggles.
- Optional: `app/globals.css` for small CSS transitions/tuning if desired.

## Implementation details & conventions

- Use the link string as the sortable `id` if links are unique; otherwise use a stable computed id (e.g., `${index}-${hash(link)}`) to avoid key collisions while reordering.
- Only allow one item to be dragged at a time (default `@dnd-kit` behavior). Do not implement multi-drag.
- Keep add/remove and validate flows unchanged. The reorder only mutates the in-memory `links` array.
- Keep TypeScript typing strict and minimal: type `links` as `string[]`, `arrayMove<T>` generic.

## Edge cases considered

- Dragging an item onto itself or dropping without movement — the `onDragEnd` handler should be a no-op.
- Single-item list — dragging should do nothing and not crash.
- Rapid repeated drags — state update occurs on drag end only to avoid intermediate churn.
- Duplicates — reordering uses indices so it won't create duplicates; dedupe logic for adding remains unchanged.
- Keyboard-only users — include `KeyboardSensor` so users can reorder via keyboard.

## Accessibility & UX

- Add `KeyboardSensor` and `PointerSensor` via `useSensors` / `useSensor` to ensure keyboard and pointer support.
- Provide a small `aria-live="polite"` message after reordering, e.g., “Moved item to position X”.
- Visual: subtle scale/box-shadow on the dragged item and a dashed highlight on the target slot. Use the existing `cn` utility and Tailwind classes for styling consistency.
- Keep the Remove (`X`) button visible and operable (ensure drag handles or full-item drag area do not block the Remove button's click target).

## QA checklist (manual)

- Drag an item to a new position with mouse; confirm order changes.
- Reorder via keyboard (select item, use keyboard controls) and confirm order changes and `aria-live` announcement.
- Drag an item and drop it back to the same position — confirm no change and no errors.
- Ensure Remove (`X`) still removes the expected item after reordering.

## Notes

- In-memory only for now; persistence to backend or localStorage can be added later if desired.
- Simple visuals only (CSS transform + shadow); if you want fancier animations later, consider `framer-motion`.

---

*Saved plan created from user-approved plan.*

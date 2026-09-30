# Task manager quality checklist

Use this checklist when changing task state, filters, persistence, or the interface.

## Task lifecycle
- [ ] Create a task with a normal title.
- [ ] Verify empty and whitespace-only titles are rejected or handled consistently.
- [ ] Mark a task complete, then active again.
- [ ] Confirm the remaining-task count matches the visible task state.
- [ ] Clear completed tasks and confirm active tasks remain.
- [ ] Switch between All, Active, and Completed filters after changing task state.

## Persistence
- [ ] Refresh after creating and completing tasks.
- [ ] Verify malformed or outdated stored data does not crash the page.
- [ ] Verify storage failures leave the interface usable and provide understandable feedback.
- [ ] Confirm clearing completed tasks is reflected after refresh.

## Accessibility and layout
- [ ] Use the app with keyboard only and check visible focus.
- [ ] Ensure task actions have meaningful accessible names.
- [ ] Check empty states, long titles, and narrow mobile layouts.

Run the repository CI workflow before merging. Avoid storing sensitive information in tasks.
# Nord Studio — Task Manager

A compact, browser-based task manager built with vanilla HTML, CSS, and JavaScript. It supports creating tasks, assigning priorities, filtering the list, and clearing completed work.

## Features

- Create tasks with low, medium, or high priority
- Filter tasks by all, active, or completed
- Track remaining tasks
- Clear completed tasks
- Minimal interface with no framework or build step

## Run locally

Clone the repository and open `index.html` in a modern browser. Or serve it locally:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Project structure

- `index.html` — accessible page structure
- `style.css` — layout and visual styling
- `app.js` — task creation, filtering, and list interactions

## Notes

This is a front-end project. Unless persistence is implemented in `app.js`, tasks may not survive a page refresh. Avoid entering sensitive information into the task list.

## Future improvements

- Persist tasks with versioned local storage
- Add edit, delete, and undo actions
- Add due dates and sorting
- Improve keyboard and screen-reader support
- Add tests for filtering and task-state transitions

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const priorityInput = document.getElementById("priority-input");
    const addBtn = document.getElementById("add-btn");
    const taskList = document.getElementById("task-list");
    const footer = document.getElementById("todo-footer");
    const taskCount = document.getElementById("task-count");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const tabButtons = document.querySelectorAll(".tab-btn");

    const STORAGE_KEY = "nord_matrix_tasks";

    function loadTasks() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(stored)) return [];
            return stored.filter((task) =>
                task &&
                Number.isSafeInteger(task.id) &&
                typeof task.text === "string" &&
                task.text.trim().length > 0 &&
                typeof task.completed === "boolean" &&
                ["low", "medium", "high"].includes(task.priority)
            );
        } catch {
            return [];
        }
    }

    let tasks = loadTasks();
    let currentFilter = "all";

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        createTask();
    });
    clearAllBtn.addEventListener("click", clearCompletedTasks);

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tabButtons.forEach((btn) => {
                const active = btn === button;
                btn.classList.toggle("active", active);
                btn.setAttribute("aria-pressed", String(active));
            });
            currentFilter = button.getAttribute("data-filter") || "all";
            renderTasks();
        });
    });

    renderTasks();

    function createTask() {
        const text = taskInput.value.trim();
        if (!text) {
            taskInput.focus();
            return;
        }

        const nextId = Math.max(Date.now(), ...tasks.map((task) => task.id + 1), 1);
        tasks.push({
            id: nextId,
            text,
            priority: priorityInput.value,
            completed: false,
        });

        if (!updateStorage()) return;
        renderTasks();
        taskInput.value = "";
        taskInput.focus();
    }

    function toggleTask(id) {
        tasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        if (!updateStorage()) return;
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter((task) => task.id !== id);
        if (!updateStorage()) return;
        renderTasks();
    }

    function clearCompletedTasks() {
        const remaining = tasks.filter((task) => !task.completed);
        if (remaining.length === tasks.length) return;
        tasks = remaining;
        if (!updateStorage()) return;
        renderTasks();
    }

    function updateStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            return true;
        } catch {
            renderStorageError();
            return false;
        }
    }

    function renderStorageError() {
        taskList.replaceChildren();
        const message = document.createElement("li");
        message.className = "empty-state error-state";
        message.textContent = "Browser storage is unavailable. Your latest change was not saved.";
        taskList.appendChild(message);
    }

    function renderTasks() {
        taskList.replaceChildren();

        const filteredTasks = tasks.filter((task) => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

        footer.hidden = tasks.length === 0;

        if (filteredTasks.length === 0) {
            const empty = document.createElement("li");
            empty.className = "empty-state";
            empty.textContent = tasks.length === 0
                ? "No objectives yet. Deploy your first task above."
                : `No ${currentFilter} objectives.`;
            taskList.appendChild(empty);
        } else {
            filteredTasks.forEach(renderTask);
        }

        const activeCount = tasks.filter((task) => !task.completed).length;
        taskCount.textContent = `${activeCount} active objective${activeCount === 1 ? "" : "s"} remaining`;
    }

    function renderTask(task) {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "task-toggle";
        toggleBtn.type = "button";
        toggleBtn.setAttribute("aria-pressed", String(task.completed));
        toggleBtn.setAttribute("aria-label", task.completed ? "Mark task active" : "Mark task completed");

        const contentArea = document.createElement("span");
        contentArea.className = "task-content-area";

        const badge = document.createElement("span");
        badge.className = `badge ${task.priority}`;
        badge.textContent = task.priority;

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;

        contentArea.append(badge, textSpan);
        toggleBtn.appendChild(contentArea);
        toggleBtn.addEventListener("click", () => toggleTask(task.id));

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.type = "button";
        delBtn.textContent = "✕";
        delBtn.setAttribute("aria-label", `Delete task: ${task.text}`);
        delBtn.addEventListener("click", () => deleteTask(task.id));

        li.append(toggleBtn, delBtn);
        taskList.appendChild(li);
    }
});

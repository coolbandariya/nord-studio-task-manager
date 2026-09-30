document.addEventListener("DOMContentLoaded", () => {
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
                task && Number.isSafeInteger(task.id) &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean" &&
                ["low", "medium", "high"].includes(task.priority)
            );
        } catch {
            return [];
        }
    }

    let tasks = loadTasks();
    let currentFilter = "all";

    renderTasks();

    addBtn.addEventListener("click", createTask);
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") createTask();
    });
    clearAllBtn.addEventListener("click", clearCompletedTasks);

    // Setup Navigation Filter Tab Event Listeners
    tabButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            const selected = e.currentTarget;
            selected.classList.add("active");
            currentFilter = selected.getAttribute("data-filter") || "all";
            renderTasks();
        });
    });

    function createTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const newObj = {
            id: Date.now(),
            text: text,
            priority: priorityInput.value,
            completed: false
        };

        tasks.push(newObj);
        updateStorage();
        renderTasks();
        taskInput.value = "";
    }

    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) return { ...task, completed: !task.completed };
            return task;
        });
        updateStorage();
        renderTasks();
    }

    function deleteTask(id, event) {
        event.stopPropagation();
        tasks = tasks.filter(task => task.id !== id);
        updateStorage();
        renderTasks();
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        updateStorage();
        renderTasks();
    }

    function updateStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Could not save tasks to browser storage:", error);
        }
    }

    function renderTasks() {
        taskList.replaceChildren();
        
        // Filter elements depending on active navigation state
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

        if (tasks.length === 0) {
            footer.style.display = "none";
            const empty = document.createElement("li");
            empty.className = "empty-state";
            empty.textContent = "No pending objectives active";
            taskList.appendChild(empty);
            return;
        }

        footer.style.display = "flex";

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            if (task.completed) li.classList.add("completed");
            li.addEventListener("click", () => toggleTask(task.id));

            // Inner content element wrapper
            const contentArea = document.createElement("div");
            contentArea.className = "task-content-area";

            // Dynamic badge priority selector rendering
            const badge = document.createElement("span");
            badge.className = `badge ${task.priority}`;
            badge.textContent = task.priority;

            const textSpan = document.createElement("span");
            textSpan.textContent = task.text;

            contentArea.appendChild(badge);
            contentArea.appendChild(textSpan);

            const delBtn = document.createElement("button");
            delBtn.className = "delete-btn";
            delBtn.textContent = "✕";
            delBtn.addEventListener("click", (e) => deleteTask(task.id, e));

            li.appendChild(contentArea);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });

        const activeCount = tasks.filter(t => !t.completed).length;
        taskCount.textContent = `${activeCount} active objective${activeCount === 1 ? '' : 's'} remaining`;
    }
});
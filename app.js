document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const priorityInput = document.getElementById("priority-input");
    const addBtn = document.getElementById("add-btn");
    const taskList = document.getElementById("task-list");
    const footer = document.getElementById("todo-footer");
    const taskCount = document.getElementById("task-count");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let tasks = JSON.parse(localStorage.getItem("nord_matrix_tasks")) || [];
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
            e.target.classList.add("active");
            currentFilter = e.target.getAttribute("data-filter");
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
        localStorage.setItem("nord_matrix_tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        
        // Filter elements depending on active navigation state
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

        if (tasks.length === 0) {
            footer.style.display = "none";
            taskList.innerHTML = `<li style="background: transparent; border: 1px dashed #4C566A; justify-content: center; color: #4C566A; cursor: default;">No pending objectives active</li>`;
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
            badge.innerText = task.priority;

            const textSpan = document.createElement("span");
            textSpan.innerText = task.text;

            contentArea.appendChild(badge);
            contentArea.appendChild(textSpan);

            const delBtn = document.createElement("button");
            delBtn.className = "delete-btn";
            delBtn.innerHTML = "✕";
            delBtn.addEventListener("click", (e) => deleteTask(task.id, e));

            li.appendChild(contentArea);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });

        const activeCount = tasks.filter(t => !t.completed).length;
        taskCount.innerText = `${activeCount} active objective${activeCount === 1 ? '' : 's'} remaining`;
    }
});
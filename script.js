document.addEventListener('DOMContentLoaded', function() {
    // Utility: Get IST date string
    function getISTDateString() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset - now.getTimezoneOffset() * 60000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return istTime.toLocaleDateString('en-IN', options);
    }

    // Display IST date
    function showDate() {
        document.getElementById('date').textContent = getISTDateString();
    }
    showDate();
    setInterval(showDate, 60 * 1000);

    // LocalStorage helpers
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render tasks
    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        getTasks().forEach((task, idx) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span class="task-text">${task}</span>
                <button class="edit-btn" data-idx="${idx}">Edit</button>
                <button class="delete-btn" data-idx="${idx}">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }
    renderTasks();

    // Add task
    document.getElementById('add-task-btn').onclick = function() {
        const input = document.getElementById('task-input');
        const val = input.value.trim();
        if (val) {
            const tasks = getTasks();
            tasks.push(val);
            saveTasks(tasks);
            renderTasks();
            input.value = '';
        }
    };

    // Edit/Delete handlers
    document.getElementById('task-list').onclick = function(e) {
        const idx = e.target.dataset.idx;
        if (e.target.classList.contains('edit-btn')) {
            const tasks = getTasks();
            const newTask = prompt('Edit your task:', tasks[idx]);
            if (newTask !== null && newTask.trim() !== '') {
                tasks[idx] = newTask.trim();
                saveTasks(tasks);
                renderTasks();
            }
        }
        if (e.target.classList.contains('delete-btn')) {
            const li = e.target.closest('li');
            li.classList.add('fade-out');
            setTimeout(() => {
                const tasks = getTasks();
                tasks.splice(idx, 1);
                saveTasks(tasks);
                renderTasks();
            }, 400);
        }
    };
});
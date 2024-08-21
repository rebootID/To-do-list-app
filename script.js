/* script.js */
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const prioritySelect = document.getElementById("priority");
  const dueDateInput = document.getElementById("due-date");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  addTaskBtn.addEventListener("click", addTask);
  taskList.addEventListener("click", handleTaskActions);

  // Load tasks from Local Storage
  loadTasks();

  function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") {
      alert("Please enter a task");
      return;
    }

    const taskItem = createTaskElement(taskText, priority, dueDate, false);

    taskList.appendChild(taskItem);
    saveTasks();
    taskInput.value = "";
    dueDateInput.value = "";
    prioritySelect.value = "low";
  }

  function createTaskElement(taskText, priority, dueDate, completed) {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${priority}-priority`;
    if (completed) taskItem.classList.add("completed");
    taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              completed ? "checked" : ""
            }>
            <div class="task-info">
                <span class="task-text">${taskText}</span>
                <span>Due: ${dueDate ? dueDate : "No deadline"}</span>
            </div>
            <div>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
    return taskItem;
  }

  function handleTaskActions(e) {
    if (e.target.classList.contains("edit")) {
      const taskItem = e.target.closest(".task-item");
      taskInput.value = taskItem.querySelector(".task-text").textContent;
      prioritySelect.value = taskItem.className.split(" ")[1].split("-")[0];
      dueDateInput.value = taskItem
        .querySelector(".task-info span:nth-child(2)")
        .textContent.split(": ")[1];
      categorySelect.value = taskItem
        .querySelector(".task-info span:nth-child(3)")
        .textContent.split(": ")[1];
      taskList.removeChild(taskItem);
    } else if (e.target.classList.contains("delete")) {
      const taskItem = e.target.closest(".task-item");
      taskList.removeChild(taskItem);
      saveTasks();
    } else if (e.target.classList.contains("task-checkbox")) {
      const taskItem = e.target.closest(".task-item");
      taskItem.classList.toggle("completed");
      saveTasks();
    }
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((taskItem) => {
      tasks.push({
        text: taskItem.querySelector(".task-text").textContent,
        priority: taskItem.className.split(" ")[1].split("-")[0],
        dueDate: taskItem
          .querySelector(".task-info span:nth-child(2)")
          .querySelector(".task-info span:nth-child(3)")
          .textContent.split(": ")[1],
        completed: taskItem.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskElement(
        task.text,
        task.priority,
        task.dueDate,
        task.completed
      );
      taskList.appendChild(taskItem);
    });
  }
});

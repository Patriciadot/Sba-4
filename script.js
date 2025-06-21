let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const category = document.getElementById("taskCategory").value.trim();
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (!name || !category || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const task = { name, category, deadline, status };
  tasks.push(task);
  saveTasks();
  clearForm();
  updateCategoryFilter();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearForm() {
  document.getElementById("taskName").value = '';
  document.getElementById("taskCategory").value = '';
  document.getElementById("taskDeadline").value = '';
  document.getElementById("taskStatus").value = 'In Progress';
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const filterCategory = document.getElementById("filterCategory").value;
  const filterStatus = document.getElementById("filterStatus").value;

  const today = new Date().toISOString().split("T")[0];

  tasks.forEach((task, index) => {
    
    let displayStatus = task.status;
    if (task.status !== "Completed" && task.deadline < today) {
      displayStatus = "Overdue";
    }

    
    if ((filterCategory && task.category !== filterCategory) ||
        (filterStatus && displayStatus !== filterStatus)) {
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.category}</td>
      <td>${task.deadline}</td>
      <td class="${displayStatus === 'Overdue' ? 'overdue' : ''}">${displayStatus}</td>
      <td>
        <select onchange="updateTaskStatus(${index}, this.value)">
          <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>
    `;
    list.appendChild(row);
  });
}

function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  renderTasks();
}

function updateCategoryFilter() {
  const filter = document.getElementById("filterCategory");
  const categories = [...new Set(tasks.map(task => task.category))];
  filter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

updateCategoryFilter();
renderTasks();
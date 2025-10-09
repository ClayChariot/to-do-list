const todoList = JSON.parse(localStorage.getItem("STORAGE_KEY")) || [];


renderTodoList();

const inputElement = document.querySelector(".name-input");
const dateInputElement = document.querySelector(".due-date-input");
const hoursSelect = document.getElementById("hours");
const minutesSelect = document.getElementById("minutes");
const errorElement = document.querySelector(".error-text");

document.addEventListener("DOMContentLoaded", () => {
  populateTimeSelects(hoursSelect, minutesSelect);
});

document.querySelector(".add-todo-button")
  .addEventListener("click", () => { addTodo(); });

document.querySelector(".name-input")
  .addEventListener("keydown", (event) => { if (event.key === "Enter") { addTodo(); } });




function renderTodoList() {

  sortTasks(todoList);

  let todoListHTML = "";

  todoList.forEach((todoObject, index) => {
    const { name, dueDateDisplay, h, m } = todoObject;

    const timeString = h && m ? `${h}:${m} h` : "";
    const html = `
      <div class="addedItemName">${name}</div>
      <div class="addedItemDate">${dueDateDisplay}</div>
      <div class="addedItemTime">${timeString}</div>
      <div class="delete-todo-button-column"><button class="delete-todo-button">DELETE</button></div>
    `;
    todoListHTML += html;
  });

  document.querySelector(".todo-grid").innerHTML = todoListHTML;

  document.querySelectorAll(".delete-todo-button")
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener("click", () => {
        todoList.splice(index, 1);
        errorElement.classList.remove("active");
        renderTodoList();
        saveTasks();
      });
    });
}




function addTodo() {
  const name = validateInputTask(inputElement);
  if (!name) return;

  // Get display date and clean sort date
  const { display: dueDateDisplay, sort: sortDate } = validateInputDate(dateInputElement);

  const h = hoursSelect.value;
  const m = minutesSelect.value;

  // Validate time input
  if ((h && !m) || (!h && m)) {
    errorElement.textContent = "You haven't entered the correct time!";
    errorElement.classList.add("active");
    return;
  } else if ((!sortDate && (h || m))) {
    errorElement.textContent = "You haven't entered a date!";
    errorElement.classList.add("active");
    return;
  }

  // Create new task object
  const newTask = { name, sortDate, dueDateDisplay, h, m };

  // Check for duplicate
  if (isDuplicateTask(newTask)) {
    errorElement.textContent = "You have already added that task!";
    errorElement.classList.add("active");
    return;
  }

  todoList.push(newTask);
  sortTasks(todoList);
  renderTodoList();
  saveTasks();
  restoreInputValues();
}



function saveTasks() {
  localStorage.setItem("STORAGE_KEY", JSON.stringify(todoList));
}

function populateTimeSelects(hoursSelect, minutesSelect) {
  for (let h = 0; h < 24; h++) {
    const option = document.createElement("option");
    option.value = h.toString().padStart(2, "0");
    option.textContent = h.toString().padStart(2, "0");
    hoursSelect.appendChild(option);
  }

  for (let m = 0; m < 60; m++) {
    const option = document.createElement("option");
    option.value = m.toString().padStart(2, "0");
    option.textContent = m.toString().padStart(2, "0");
    minutesSelect.appendChild(option);
  }
}

function restoreInputValues() {
  hoursSelect.value = "";
  minutesSelect.value = "";
  inputElement.value = "";
  dateInputElement.value = "";
  errorElement.textContent = "";

}

function validateInputTask(inputElement) {
  let name = inputElement.value;

  if (!name) {
    errorElement.textContent = "You haven't entered a task!";
    errorElement.classList.add("active");
    return null;
  }

  name = name.trim();
  name = name.replace(/\s{2,}/g, ' ');
  name = name.replace(/(["'])\s+/g, "$1");
  name = name.replace(/\s+(["'])/g, "$1");

  const regex = /^[\p{L}\p{N}\p{S}\p{P}]+(?: [\p{L}\p{N}\p{S}\p{P}]+)*$/u;
  const hasLetterOrDigit = /\p{L}|\p{N}/u.test(name);
  const isValid = regex.test(name);

  if (!isValid || !hasLetterOrDigit) {
    errorElement.textContent = "invalid task!";
    errorElement.classList.add("active");
    return null;
  }

  return name;
}

function validateInputDate(dateInputElement) {
  if (!dateInputElement.value) return { display: "", sort: "" };

  const [year, month, day] = dateInputElement.value.split("-");
  const sortDate = `${day}.${month}.${year}`; // for sorting

  const date = new Date(dateInputElement.value);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[date.getDay()];
  const display = `${dayName} ${sortDate}.`; // for showing in DOM

  return { display, sort: sortDate };
}

function sortTasks(todoList) {
  return todoList.sort((a, b) => {
    const aHasDate = !!a.sortDate;
    const bHasDate = !!b.sortDate;

    if (!aHasDate && bHasDate) return -1;
    if (aHasDate && !bHasDate) return 1;
    if (!aHasDate && !bHasDate) return 0;

    const aTime = toTimestamp(a);
    const bTime = toTimestamp(b);

    return aTime - bTime; // no time (00:00) comes before timed tasks
  });
}

function toTimestamp(task) {
  if (!task.sortDate) return null;
  const [day, month, year] = task.sortDate.split(".").map(Number);
  const hours = task.h ? Number(task.h) : 0;
  const mins = task.m ? Number(task.m) : 0;
  return new Date(year, month - 1, day, hours, mins).getTime();
}
function isDuplicateTask(newTask) {
  return todoList.some(task =>
    task.name.toUpperCase() === newTask.name.toUpperCase() &&
    task.sortDate === newTask.sortDate &&
    task.h === newTask.h &&
    task.m === newTask.m
  );
}



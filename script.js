const todoList = JSON.parse(localStorage.getItem("STORAGE_KEY")) || [];

renderTodoList();

document.addEventListener("DOMContentLoaded", () => {
  const hoursSelect = document.getElementById("hours");
  const minutesSelect = document.getElementById("minutes");
  populateTimeSelects(hoursSelect, minutesSelect);
});

function renderTodoList() {
  let todoListHTML = '';

  todoList.forEach((todoObject, index) => {
    const { name, dueDate, h, m } = todoObject;

    if (!h || !m) {
    const html = `
      <div class="addedItemName">${name}</div>
      <div class="addedItemDate">${dueDate}</div>
      <div class="addedItemTime">${h}${m}</div>
      <div><button class="delete-todo-button js-delete-todo-button">UKLONI</button></div> 
    `;
    todoListHTML += html;
  
  }
  else {const html = `
      <div class="addedItemName">${name}</div>
      <div class="addedItemDate">${dueDate}</div>
      <div class="addedItemTime">${h}:${m} h</div>
      <div><button class="delete-todo-button js-delete-todo-button">UKLONI</button></div> 
    `;
    todoListHTML += html;}
  });
  
  document.querySelector('.js-todo-list')
    .innerHTML = todoListHTML;

  document.querySelectorAll('.js-delete-todo-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        todoList.splice(index, 1);
        renderTodoList();
        saveTasks();
      });
    });
}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
    
  });

document.querySelector('.js-name-input')
  .addEventListener('keydown', (event) => {
    if (event.key==="Enter") {

    addTodo();
    
    }
  });



function addTodo() {
    const inputElement = document.querySelector('.js-name-input');
    let name = inputElement.value;
    if (!name) {alert("niste uneli zadatak!");
        return;
    }

    else {
    name = name.trim();

    // Step 2: Replace multiple spaces with a single space
    name = name.replace(/\s{2,}/g, ' ');
    name = name.replace(/(["'])\s+/g, "$1");
    name = name.replace(/\s+(["'])/g, "$1");

    // Optional: Update the input field
    inputElement.value = name;

    
    const regex = /^[\p{L}\p{N}\p{S}\p{P}]+(?: [\p{L}\p{N}\p{S}\p{P}]+)*$/u;
    const hasLetterOrDigit = /\p{L}|\p{N}/u.test(name);
    const isValid = regex.test(name);
    


    if(!isValid || !hasLetterOrDigit) {
    alert("neispravan unos!");
    return;
    }
    }
  

  const dateInputElement = document.querySelector('.js-due-date-input');
  let dueDate = dateInputElement.value;
  if (!dueDate) {
    dueDate="";} 
  else {
    const [year, month, day] = dueDate.split('-');

    let formattedDate = `${day}.${month}.${year}.`;

    

    // Convert input value (yyyy-mm-dd) to Date
      const date = new Date(dueDate);
      

      // Array of day names
      const days = ["Nedelja","Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
     

      // Get day name
      const dayName = days[date.getDay()];
      

      dueDate = dayName+" "+formattedDate;
      }
    
    const hoursSelect = document.getElementById("hours");
    const minutesSelect = document.getElementById("minutes");
    populateTimeSelects(hoursSelect, minutesSelect);
    

    const h = hoursSelect.value;
    const m = minutesSelect.value;

    if ((h && !m) || (!h && m)) {
    alert("niste uneli ispravno vreme!");
    return;
    }
    else if ((!dueDate && h && m))  {
    alert("niste uneli datum!");
    return;
    }
    

  {
  todoList.push({
    name,
    dueDate, h, m
  });

}
  hoursSelect.value="";
  minutesSelect.value="";
  inputElement.value = '';
  dateInputElement.value="";

  
  renderTodoList();
  saveTasks();
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




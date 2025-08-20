const todoList = JSON.parse(localStorage.getItem("STORAGE_KEY")) || [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  todoList.forEach((todoObject, index) => {
    const { name, dueDate } = todoObject;
    const html = `
      <div class="addedItemName">${name}</div>
      <div class="addedItemDate">${dueDate}</div>
      <div><button class="delete-todo-button js-delete-todo-button">UKLONI</button></div> 
    `;
    todoListHTML += html;
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
    if (!name) {alert("niste ništa uneli!");
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

    
    const regex = /^(?! )[A-Za-zČčĆćĐđŠšŽžА-Яа-яЉљЊњЋћЏџ0-9!@#\$%\^\&\*\(\)\-\_\=\+\[\]\{\};:'",<>\.\?\/\\|`~€£¥₹¤§±×÷°²³½¾¿¡«»„“”•…†‡–—¨©®™✓✔✗✘★☆☑☐☒∞Ωµ\s]+(?<! )$/;
    const hasLetterOrDigit = /[A-Za-zČčĆćĐđŠšŽžА-Яа-яЉљЊњЋћЏџ0-9]/.test(name);
    const isValid = regex.test(name);
    


    if(!isValid || !hasLetterOrDigit) {
    alert("neispravan unos!");
    return;
    }
    }
  

  const dateInputElement = document.querySelector('.js-due-date-input');
  let dueDate = dateInputElement.value;
  if (!dueDate) {
    alert("niste uneli datum!");
    return;}

    const [year, month, day] = dueDate.split('-');

    let formattedDate = `${day}.${month}.${year}.`;

    dueDate = formattedDate;

  todoList.push({
    name,
    dueDate
  });

  inputElement.value = '';

  renderTodoList();
  saveTasks();
}


function saveTasks() {
  localStorage.setItem("STORAGE_KEY", JSON.stringify(todoList));
}


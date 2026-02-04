
//ZMIENNE
let todos = [];
let nextId = 1;

//LIMIT ZNAKÓW
const TITLE_MAX_LENGTH = 50; //POWINNO WYSTARCZYĆ NA HASŁOWY ZAPIS WIEKSZOŚCI ZADAŃ TYPU "ODEBRAĆ DZIECI ZE SZKOŁY"
const DESCRIPTION_MAX_LENGTH = 160; //LIMIT JAK W PIERWSZYCH SMSACH


//ELEMENTY HTML

const form = document.getElementById('todo-form');
const titleInput = document.getElementById('title-input');
const descriptionInput = document.getElementById('description-input');
const todoList = document.getElementById('todo-list');

const titleError = document.getElementById('title-error');
const descriptionError = document.getElementById('description-error');

const dialog = document.getElementById('details-dialog');
const dialogContent = document.getElementById('details-content');
const dialogClose = document.getElementById('close-dialog');

const titleCounter = document.getElementById('title-counter');
const descriptionCounter = document.getElementById('description-counter');

//WALIDACJA
function validate(title, description) {
    let valid = true;

    titleError.textContent = '';
    descriptionError.textContent = '';

    if (!title) {
        titleError.textContent = 'Tytuł jest wymagany';
        valid = false;
    }

    if (title.length > TITLE_MAX_LENGTH) {
        titleError.textContent = 'Tytuł jest za długi';
        valid = false;
    }

    if (description.length > DESCRIPTION_MAX_LENGTH) {
        descriptionError.textContent = 'Opis jest za długi';
        valid = false;
    }

    return valid;
}


//CRUD
function addTodo(title, description) {
    const todo = {
        id: nextId,
        title: title,
        description: description,
        status: 'todo',
        createdAt: new Date()
    };

    nextId++;
    todos.push(todo);
    sortTodos();
    renderTodos();
}

function removeTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
}

function toggleStatus(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.status = todo.status === 'todo' ? 'done' : 'todo';
        renderTodos();
    }
}

//SORTOWANIE
function sortTodos() {
    todos.sort((a, b) => a.createdAt - b.createdAt);
}

//RENDER
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo) => {
        const item = document.createElement('div');
        item.className = 'todo-item';

        const title = document.createElement('h3');
        title.textContent = todo.title;

        const date = document.createElement('div');
        date.textContent = todo.createdAt.toLocaleString();
        date.className = 'todo-date';

        const status = document.createElement('div');
        status.innerHTML = todo.status === 'done' ? '&#10003;' : '&#10007;';
        status.className = `todo-status ${todo.status}`;

        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'Szczegóły';
        detailsBtn.onclick = () => openDetails(todo);

        const statusBtn = document.createElement('button');
        statusBtn.textContent = 'Zmień status';
        statusBtn.onclick = () => toggleStatus(todo.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Usuń';
        deleteBtn.onclick = () => removeTodo(todo.id);

        item.appendChild(title);
        item.appendChild(date);
        item.appendChild(status);
        item.appendChild(detailsBtn);
        item.appendChild(statusBtn);
        item.appendChild(deleteBtn);

        todoList.appendChild(item);
    });
}

//OKNA DIALOGOWE
function openDetails(todo) {
    dialogContent.innerHTML = `
    <h2>${todo.title}</h2>
   <p>
  <strong>Status:</strong>
  ${todo.status === 'done' ? '&#10003;' : '&#10007;'}
   </p>
    <p><strong>Utworzono:</strong> ${todo.createdAt.toLocaleString()}</p>
    <p>${todo.description || 'Brak opisu'}</p>
  `;
    dialog.showModal();
}

dialogClose.onclick = () => {
    dialog.close();
};

function updateCounter(input, counter, maxLength) {
    const remaining = maxLength - input.value.length;
    counter.textContent = `Pozostało: ${remaining}`;
}

//EVENTY + LICZNIK


titleInput.addEventListener('input', () => {
    updateCounter(titleInput, titleCounter, TITLE_MAX_LENGTH);
});

descriptionInput.addEventListener('input', () => {
    updateCounter(descriptionInput, descriptionCounter, DESCRIPTION_MAX_LENGTH);
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    try {
        const isValid = validate(title, description);
        if (!isValid) {
            throw new Error('Błąd walidacji');
        }

        addTodo(title, description);
        titleInput.value = '';
        descriptionInput.value = '';


        titleCounter.textContent = `Pozostało: ${TITLE_MAX_LENGTH}`;
        descriptionCounter.textContent = `Pozostało: ${DESCRIPTION_MAX_LENGTH}`;

    } catch (error) {
        console.error(error);
    }
});



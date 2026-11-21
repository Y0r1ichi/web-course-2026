// Состояние приложения: массив объектов { id, text, completed }
let tasks = [];
let nextId = 1;
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const warning = document.getElementById('warning');
const counter = document.getElementById('counter');
const filters = document.getElementById('filters');
const list = document.getElementById('task-list');
const empty = document.getElementById('empty');

// Отрисовка всего интерфейса на основе массива tasks
function render() {
  // 1. Фильтрация по текущему фильтру
  const visible = tasks.filter(function (task) {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  // 2. Генерация разметки задач в JS
  list.innerHTML = '';
  visible.map(createTaskElement).forEach(function (li) {
    list.appendChild(li);
  });
  empty.hidden = visible.length > 0;

  // 3. Счётчик
  const done = tasks.filter(function (t) { return t.completed; }).length;
  counter.textContent = 'Осталось: ' + (tasks.length - done) + ', Выполнено: ' + done;

  // 4. Подсветка активного фильтра
  filters.querySelectorAll('.filter').forEach(function (btn) {
    btn.classList.toggle('is-active', btn.dataset.filter === currentFilter);
  });
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Выполнено');

  const text = document.createElement('span');
  text.className = 'task__text';
  text.textContent = task.text; // textContent — безопасно, без вставки HTML

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'task__delete';
  del.textContent = 'Удалить';

  li.append(checkbox, text, del);
  return li;
}

function addTask(text) {
  tasks.push({ id: nextId++, text: text, completed: false });
  render();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) task.completed = !task.completed;
  });
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) { return task.id !== id; });
  render();
}

// Добавление: кнопка «Добавить» и Enter (оба вызывают submit формы)
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    warning.hidden = false;
    input.classList.add('invalid');
    input.focus();
    return;
  }
  warning.hidden = true;
  input.classList.remove('invalid');
  addTask(text);
  input.value = '';
  input.focus();
});

input.addEventListener('input', function () {
  warning.hidden = true;
  input.classList.remove('invalid');
});

// Делегирование событий: чекбокс и «Удалить» внутри списка
list.addEventListener('click', function (event) {
  const li = event.target.closest('.task');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (event.target.closest('.task__delete')) {
    deleteTask(id);
  } else if (event.target.matches('input[type="checkbox"]')) {
    toggleTask(id);
  }
});

// Фильтры
filters.addEventListener('click', function (event) {
  const btn = event.target.closest('.filter');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  render();
});

render();

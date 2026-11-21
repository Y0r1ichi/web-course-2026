// VIEW — только работа с DOM. Данных не хранит, модель не меняет.

export function getElements() {
  return {
    form: document.querySelector('#add-form'),
    input: document.querySelector('#task-input'),
    warning: document.querySelector('#warning'),
    counter: document.querySelector('#counter'),
    filters: document.querySelector('#filters'),
    list: document.querySelector('#task-list'),
    empty: document.querySelector('#empty')
  };
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

// Перерисовка всего интерфейса по данным
export function render(els, visibleTasks, stats, currentFilter) {
  els.list.innerHTML = '';
  visibleTasks
    .map(createTaskElement)
    .forEach(function (li) { els.list.appendChild(li); });
  els.empty.hidden = visibleTasks.length > 0;

  els.counter.textContent =
    'Всего: ' + stats.total + ', Осталось: ' + stats.active + ', Выполнено: ' + stats.done;

  els.filters.querySelectorAll('.filter').forEach(function (btn) {
    btn.classList.toggle('is-active', btn.dataset.filter === currentFilter);
  });
}

export function getInputValue(els) {
  return els.input.value;
}

export function clearInput(els) {
  els.input.value = '';
  els.input.focus();
}

export function showWarning(els) {
  els.warning.hidden = false;
  els.input.classList.add('invalid');
  els.input.focus();
}

export function hideWarning(els) {
  els.warning.hidden = true;
  els.input.classList.remove('invalid');
}

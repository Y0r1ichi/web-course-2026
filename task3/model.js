// MODEL — данные и логика. Ничего не знает о DOM.
// Состояние передаётся в функции как аргумент, глобальных переменных нет.

// Начальное состояние: массив объектов { id, text, completed }
export function createState() {
  return { tasks: [], nextId: 1, filter: 'all' }; // filter: 'all' | 'active' | 'completed'
}

export function addTask(state, text) {
  state.tasks.push({ id: state.nextId, text: text, completed: false });
  state.nextId += 1;
}

export function toggleTask(state, id) {
  state.tasks.forEach(function (task) {
    if (task.id === id) task.completed = !task.completed;
  });
}

export function deleteTask(state, id) {
  state.tasks = state.tasks.filter(function (task) { return task.id !== id; });
}

export function setFilter(state, filter) {
  state.filter = filter;
}

// Задачи под текущий фильтр (в данных остаются все, скрываются только в отображении)
export function getVisibleTasks(state) {
  return state.tasks.filter(function (task) {
    if (state.filter === 'active') return !task.completed;
    if (state.filter === 'completed') return task.completed;
    return true;
  });
}

// Данные для счётчика
export function getStats(state) {
  const done = state.tasks.filter(function (task) { return task.completed; }).length;
  return { total: state.tasks.length, active: state.tasks.length - done, done: done };
}

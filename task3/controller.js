// CONTROLLER — связывает Model и View:
// принимает события, меняет модель, вызывает перерисовку.

import {
  createState, addTask, toggleTask, deleteTask,
  setFilter, getVisibleTasks, getStats
} from './model.js';
import {
  getElements, render, getInputValue, clearInput,
  showWarning, hideWarning
} from './view.js';

function init() {
  const state = createState();
  const els = getElements();

  function update() {
    render(els, getVisibleTasks(state), getStats(state), state.filter);
  }

  function handleAdd(event) {
    event.preventDefault();
    const text = getInputValue(els).trim();
    if (text === '') {
      showWarning(els);
      return;
    }
    hideWarning(els);
    addTask(state, text);
    clearInput(els);
    update();
  }

  // Делегирование событий: чекбокс и «Удалить» внутри списка
  function handleListClick(event) {
    const li = event.target.closest('.task');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (event.target.closest('.task__delete')) {
      deleteTask(state, id);
      update();
    } else if (event.target.matches('input[type="checkbox"]')) {
      toggleTask(state, id);
      update();
    }
  }

  function handleFilterClick(event) {
    const btn = event.target.closest('.filter');
    if (!btn) return;
    setFilter(state, btn.dataset.filter);
    update();
  }

  // Добавление: кнопка «Добавить» и Enter (оба вызывают submit формы)
  els.form.addEventListener('submit', handleAdd);
  els.input.addEventListener('input', function () { hideWarning(els); });
  els.list.addEventListener('click', handleListClick);
  els.filters.addEventListener('click', handleFilterClick);

  update(); // первичная отрисовка
}

init();

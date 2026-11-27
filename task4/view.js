// VIEW — только работа с DOM. Не хранит состояние игры: рисует то, что дали.

import { CODE_LENGTH } from './model.js';

function plural(n, one, few, many) {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function formatHint(bulls, cows) {
  const bullsText = `${bulls} ${plural(bulls, 'бык', 'быка', 'быков')}`;
  const cowsText = `${cows} ${plural(cows, 'корова', 'коровы', 'коров')}`;
  return `${bullsText}, ${cowsText}`;
}

function createHistoryItem(attempt) {
  const itemEl = document.createElement('li');
  itemEl.className = 'history__item';
  if (attempt.bulls === CODE_LENGTH) {
    itemEl.classList.add('history__item--win');
  }

  const guessEl = document.createElement('span');
  guessEl.className = 'history__guess';
  guessEl.textContent = attempt.guess;

  const hintEl = document.createElement('span');
  hintEl.className = 'history__hint';
  hintEl.textContent = `→ ${formatHint(attempt.bulls, attempt.cows)}`;

  itemEl.append(guessEl, hintEl);
  return itemEl;
}

export function createView() {
  const formEl = document.querySelector('#guess-form');
  const inputEl = document.querySelector('#guess-input');
  const submitBtnEl = document.querySelector('#submit-btn');
  const giveUpBtnEl = document.querySelector('#giveup-btn');
  const newGameBtnEl = document.querySelector('#newgame-btn');
  const counterEl = document.querySelector('#counter');
  const messageEl = document.querySelector('#message');
  const errorEl = document.querySelector('#error');
  const historyEl = document.querySelector('#history');
  const emptyEl = document.querySelector('#history-empty');

  // Вся отрисовка — из массива данных, без накопления разметки в innerHTML.
  function render(state) {
    const isPlaying = state.status === 'playing';
    const attemptsCount = state.attempts.length;

    counterEl.textContent = `Попыток: ${attemptsCount}`;
    submitBtnEl.textContent = isPlaying ? `Попытка № ${attemptsCount + 1}` : 'Игра окончена';

    inputEl.disabled = !isPlaying;
    submitBtnEl.disabled = !isPlaying;
    giveUpBtnEl.disabled = !isPlaying;

    messageEl.dataset.status = state.status;
    if (state.status === 'won') {
      messageEl.textContent = `Угадано! Число ${state.secret}, попыток: ${attemptsCount}.`;
    } else if (state.status === 'gaveUp') {
      messageEl.textContent = `Ответ: ${state.secret}. Сыграем ещё?`;
    } else {
      messageEl.textContent = `Загадано число из ${CODE_LENGTH} разных цифр. Попробуйте угадать.`;
    }

    errorEl.textContent = '';
    historyEl.replaceChildren(...state.attempts.map(createHistoryItem));
    emptyEl.hidden = attemptsCount > 0;
    historyEl.scrollTop = historyEl.scrollHeight;

    if (isPlaying) {
      inputEl.value = '';
      inputEl.focus();
    }
  }

  function showError(text) {
    errorEl.textContent = text;
    inputEl.select();
  }

  function onSubmit(handler) {
    formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      handler(inputEl.value);
    });
  }

  function onGiveUp(handler) {
    giveUpBtnEl.addEventListener('click', handler);
  }

  function onNewGame(handler) {
    newGameBtnEl.addEventListener('click', handler);
  }

  return { render, showError, onSubmit, onGiveUp, onNewGame };
}

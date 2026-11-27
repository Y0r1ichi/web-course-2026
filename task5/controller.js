// CONTROLLER: связывает модель и вид, управляет таймерами. Он же точка входа.
import { createModel } from './model.js';
import { createView } from './view.js';

const LIGHT_MS = 500;   // сколько горит кнопка при показе
const PAUSE_MS = 250;   // пауза между кнопками
const CLICK_MS = 250;   // подсветка при клике игрока

// Все setTimeout регистрируются, чтобы их можно было отменить разом.
function createTimers() {
  const ids = new Set();

  function wait(ms) {
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        ids.delete(id);
        resolve();
      }, ms);
      ids.add(id);
    });
  }

  function cancelAll() {
    ids.forEach((id) => clearTimeout(id));
    ids.clear();
  }

  return { wait, cancelAll };
}

function createController(model, view, timers) {

  async function showSequence() {
    model.setPhase('showing');                 // клики игнорируются
    view.setStatus('Запоминайте…');
    await timers.wait(600);

    for (const color of model.getSequence()) {
      view.light(color);
      view.playSound(color);
      await timers.wait(LIGHT_MS);
      view.unlight(color);
      await timers.wait(PAUSE_MS);
    }

    model.setPhase('input');
    view.setStatus('Ваш ход');
  }

  function nextRound() {
    model.addStep();
    view.setLevel(model.getLevel());
    showSequence();
  }

  function handleStart() {
    timers.cancelAll();                        // убираем «хвосты» прошлой игры
    view.clearLights();
    model.reset();
    view.setLevel(0);
    view.setStartLabel('Заново');
    nextRound();
  }

  async function handlePad(color) {
    if (model.getPhase() !== 'input') return;  // во время показа клики не считаются

    view.light(color);
    view.playSound(color);
    timers.wait(CLICK_MS).then(() => view.unlight(color));

    const result = model.checkInput(color);

    if (result === 'wrong') {
      model.setPhase('over');
      view.playError();
      view.setStatus(`Ошибка! Вы дошли до уровня ${model.getLevel()}`);
      view.setStartLabel('Ещё раз');
      return;
    }

    if (result === 'complete') {
      model.setPhase('showing');               // блокируем ввод до следующего показа
      view.setStatus('Верно!');
      await timers.wait(700);
      nextRound();
    }
  }

  function init() {
    view.onStart(handleStart);
    view.onPad(handlePad);
  }

  return { init };
}

createController(createModel(), createView(), createTimers()).init();

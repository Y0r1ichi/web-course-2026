// CONTROLLER: игровой цикл на requestAnimationFrame. Он же точка входа.
import { createModel } from './model.js';
import { createView } from './view.js';

const MOVE_INTERVAL = 150; // мс между шагами змейки (не зависит от частоты кадров)

function createController(model, view) {
  let frameId = 0;
  let lastMoveTime = 0;

  // update: двигаем змейку только если прошло достаточно времени.
  function update(currentTime) {
    const elapsed = currentTime - lastMoveTime;
    if (elapsed >= MOVE_INTERVAL) {
      model.step();
      lastMoveTime = currentTime - (elapsed % MOVE_INTERVAL); // остаток времени не теряем
    }
  }

  // draw: отдаём состояние виду.
  function draw() {
    view.render(model.getState());
  }

  function frame(currentTime) {
    update(currentTime);
    draw();
    if (model.getState().status === 'playing') {
      frameId = requestAnimationFrame(frame);
    }
  }

  function start() {
    cancelAnimationFrame(frameId); // защита от двух параллельных циклов
    model.newGame();
    lastMoveTime = performance.now();
    draw();
    frameId = requestAnimationFrame(frame);
  }

  function init() {
    view.onKey(model.setDirection);
    view.onRestart(start);
    start();
  }

  return { init };
}

createController(createModel(), createView()).init();

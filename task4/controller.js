// CONTROLLER — связывает модель и представление. Своей логики игры не содержит.

import { createModel } from './model.js';
import { createView } from './view.js';

function init() {
  const model = createModel();
  const view = createView();

  function refresh() {
    view.render(model.getState());
  }

  view.onSubmit((value) => {
    const result = model.makeGuess(value);
    if (!result.ok) {
      view.showError(result.error); // попытка не засчитана, состояние прежнее
      return;
    }
    refresh();
  });

  view.onGiveUp(() => {
    model.giveUp();
    refresh();
  });

  view.onNewGame(() => {
    model.newGame();
    refresh();
  });

  model.newGame();
  refresh();
}

init();

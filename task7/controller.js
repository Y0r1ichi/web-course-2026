// CONTROLLER: связывает модель и вид, управляет запросами и дебаунсом. Он же точка входа.
import { createModel, fetchPosts } from './model.js';
import { createView } from './view.js';

const N_PER_FETCH = 10;       // сколько постов грузим за один запрос
const SEARCH_DELAY_MS = 300;  // задержка дебаунса поиска

// Дебаунс: вызывает callback только после паузы в delay мс с последнего вызова.
function createDebounce(callback, delay) {
  let timerId = 0;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}

function createController(model, view) {

  function refresh() {
    view.render(model.getState());
  }

  // Если пользователь у конца страницы (или страница ещё не заполнена) — грузим дальше.
  function checkNeedMore() {
    if (view.isNearBottom()) loadMore();
  }

  async function loadMore() {
    if (!model.canLoadMore()) return;   // защита от повторных и лишних запросов

    model.setLoading(true);
    refresh();
    try {
      const page = await fetchPosts(model.getLoadedCount(), N_PER_FETCH);
      model.addPage(page.posts, { total: page.total, limit: N_PER_FETCH });
    } catch (error) {
      model.setError(error.message);    // понятное сообщение пользователю
    } finally {
      model.setLoading(false);
      refresh();
    }
    checkNeedMore();                    // вдруг экран всё ещё не заполнен
  }

  function retry() {
    model.setError(null);
    loadMore();
  }

  // Фильтр работает по уже загруженному массиву, новых запросов к серверу нет.
  const applyFilter = createDebounce((text) => {
    model.setQuery(text);
    refresh();
    checkNeedMore();                    // если поиск очистили — подгрузка продолжится
  }, SEARCH_DELAY_MS);

  function init() {
    view.onScroll(checkNeedMore);
    view.onSearch(applyFilter);
    view.onRetry(retry);
    refresh();
    loadMore();
  }

  return { init };
}

createController(createModel(), createView()).init();

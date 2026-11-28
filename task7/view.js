// VIEW: только работа с DOM. Не хранит данные: рисует то, что дали.

const NEAR_BOTTOM_PX = 200; // за сколько пикселей до конца страницы начинать подгрузку

function createCard(post) {
  const cardEl = document.createElement('article');
  cardEl.className = 'card';

  const titleEl = document.createElement('h2');
  titleEl.className = 'card__title';
  titleEl.textContent = post.title;

  const bodyEl = document.createElement('p');
  bodyEl.className = 'card__body';
  bodyEl.textContent = post.body;

  const authorEl = document.createElement('span');
  authorEl.className = 'card__author';
  authorEl.textContent = `Автор: ${post.userId}`;

  cardEl.append(titleEl, bodyEl, authorEl);
  return cardEl;
}

export function createView() {
  const searchEl = document.querySelector('#search');
  const infoEl = document.querySelector('#info');
  const postsEl = document.querySelector('#posts');
  const emptyEl = document.querySelector('#empty');
  const loaderEl = document.querySelector('#loader');
  const errorEl = document.querySelector('#error');
  const errorTextEl = document.querySelector('#error-text');
  const retryBtnEl = document.querySelector('#retry');
  const endEl = document.querySelector('#end');

  function render(state) {
    postsEl.replaceChildren(...state.visiblePosts.map(createCard));

    const isSearching = state.query !== '';
    const total = state.total ?? '…';
    infoEl.hidden = !isSearching;
    infoEl.textContent = state.hasMore
      ? `Поиск идёт по загруженным постам (${state.loadedCount} из ${total}). Очистите поиск, чтобы продолжить подгрузку.`
      : `Найдено: ${state.visiblePosts.length} из ${state.loadedCount}.`;

    emptyEl.hidden = !(isSearching && state.visiblePosts.length === 0);
    loaderEl.hidden = !state.loading;
    errorEl.hidden = state.error === null;
    errorTextEl.textContent = state.error ?? '';
    endEl.hidden = state.hasMore || state.loading || state.error !== null || state.loadedCount === 0;
  }

  function isNearBottom() {
    const scrolled = window.innerHeight + window.scrollY;
    return scrolled >= document.documentElement.scrollHeight - NEAR_BOTTOM_PX;
  }

  function onScroll(handler) {
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
  }

  function onSearch(handler) {
    searchEl.addEventListener('input', () => handler(searchEl.value));
  }

  function onRetry(handler) {
    retryBtnEl.addEventListener('click', handler);
  }

  return { render, isNearBottom, onScroll, onSearch, onRetry };
}

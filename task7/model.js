// MODEL: данные, правила и запрос к серверу. Ничего не знает про DOM.

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Запрос порции постов. Любая ошибка превращается в понятное сообщение.
export async function fetchPosts(start, limit) {
  try {
    const response = await fetch(`${API_URL}?_start=${start}&_limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку (код ${response.status}). Попробуйте позже.`);
    }
    const posts = await response.json();
    const total = Number(response.headers.get('x-total-count'));
    return { posts, total: Number.isFinite(total) && total > 0 ? total : null };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Не удалось связаться с сервером. Проверьте интернет-соединение.');
    }
    throw error;
  }
}

export function createModel() {
  const state = {
    posts: [],        // все загруженные посты — единый источник для отрисовки и фильтра
    query: '',        // строка поиска (в нижнем регистре, без пробелов по краям)
    loading: false,
    error: null,      // текст ошибки или null
    hasMore: true,    // есть ли ещё посты на сервере
    total: null,      // сколько всего постов на сервере (если сервер сообщил)
  };

  function addPage(newPosts, { total, limit }) {
    const knownIds = new Set(state.posts.map((post) => post.id));
    newPosts.forEach((post) => {
      if (!knownIds.has(post.id)) state.posts.push(post);
    });
    state.total = total;
    if (newPosts.length === 0) {
      state.hasMore = false;
    } else if (total !== null) {
      state.hasMore = state.posts.length < total;
    } else {
      state.hasMore = newPosts.length >= limit;
    }
  }

  function setQuery(text) {
    state.query = String(text).trim().toLowerCase();
  }

  // Подгрузка разрешена, только если есть что грузить, нет активного запроса,
  // нет необработанной ошибки и не включён поиск (поиск идёт по уже загруженным).
  function canLoadMore() {
    return state.hasMore && !state.loading && state.error === null && state.query === '';
  }

  function getVisiblePosts() {
    if (state.query === '') return state.posts;
    return state.posts.filter((post) => post.title.toLowerCase().includes(state.query));
  }

  function getState() {
    return {
      visiblePosts: getVisiblePosts().map((post) => ({ ...post })),
      loadedCount: state.posts.length,
      query: state.query,
      loading: state.loading,
      error: state.error,
      hasMore: state.hasMore,
      total: state.total,
    };
  }

  return {
    addPage,
    setQuery,
    canLoadMore,
    getState,
    getLoadedCount: () => state.posts.length,
    setLoading: (value) => { state.loading = value; },
    setError: (message) => { state.error = message; },
  };
}

// MODEL: состояние игры и правила. Ничего не знает про DOM, Canvas и время.

export const GRID_SIZE = 20;       // поле 20×20 клеток
const START_LENGTH = 3;            // начальная длина змейки

// «Цена» яблока: чтобы змейка росла быстрее, достаточно увеличить growth.
const FRUIT = { points: 1, growth: 1 };

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function samePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isOpposite(nameA, nameB) {
  const a = DIRECTIONS[nameA];
  const b = DIRECTIONS[nameB];
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function createModel() {
  const state = {
    snake: [],          // сегменты, голова — первый элемент
    direction: 'right', // текущее направление
    queue: [],          // очередь нажатий (не больше 2), чтобы быстрые нажатия не терялись
    apple: null,        // { x, y }
    score: 0,
    pendingGrowth: 0,   // сколько сегментов ещё нужно отрастить
    status: 'playing',  // 'playing' | 'over' | 'won'
  };

  // Яблоко — в случайной свободной клетке (не на теле змейки).
  function placeApple() {
    const free = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = { x, y };
        if (!state.snake.some((segment) => samePoint(segment, cell))) {
          free.push(cell);
        }
      }
    }
    if (free.length === 0) return null;
    return free[Math.floor(Math.random() * free.length)];
  }

  function newGame() {
    const center = Math.floor(GRID_SIZE / 2);
    state.snake = Array.from({ length: START_LENGTH }, (_, i) => ({ x: center - i, y: center }));
    state.direction = 'right';
    state.queue = [];
    state.score = 0;
    state.pendingGrowth = 0;
    state.status = 'playing';
    state.apple = placeApple();
  }

  // Разворот на 180° и повтор текущего направления игнорируются.
  function setDirection(name) {
    if (state.status !== 'playing' || !DIRECTIONS[name]) return;
    const last = state.queue.length > 0 ? state.queue[state.queue.length - 1] : state.direction;
    if (name === last || isOpposite(name, last)) return;
    if (state.queue.length < 2) state.queue.push(name);
  }

  // Один шаг змейки на одну клетку.
  function step() {
    if (state.status !== 'playing') return;

    if (state.queue.length > 0) state.direction = state.queue.shift();
    const delta = DIRECTIONS[state.direction];
    const head = state.snake[0];
    const newHead = { x: head.x + delta.x, y: head.y + delta.y };

    const hitsWall = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
    if (hitsWall) {
      state.status = 'over';
      return;
    }

    const eats = state.apple !== null && samePoint(newHead, state.apple);
    const grows = eats || state.pendingGrowth > 0;
    // Если хвост сдвинется, его клетка освободится — на неё врезаться нельзя считать.
    const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
    if (bodyToCheck.some((segment) => samePoint(segment, newHead))) {
      state.status = 'over';
      return;
    }

    state.snake.unshift(newHead);
    if (eats) {
      state.score += FRUIT.points;
      state.pendingGrowth += FRUIT.growth;
    }
    if (state.pendingGrowth > 0) {
      state.pendingGrowth--;
    } else {
      state.snake.pop();
    }

    if (eats) {
      state.apple = placeApple();
      if (state.apple === null) state.status = 'won'; // поле заполнено
    }
  }

  // Отдаём копию, чтобы снаружи состояние нельзя было испортить.
  function getState() {
    return {
      snake: state.snake.map((segment) => ({ ...segment })),
      apple: state.apple ? { ...state.apple } : null,
      score: state.score,
      status: state.status,
    };
  }

  return { newGame, setDirection, step, getState };
}

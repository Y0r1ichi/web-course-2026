// VIEW: только работа с DOM и Canvas. Не хранит состояние игры.

import { GRID_SIZE } from './model.js';

const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const COLORS = {
  grid: '#1a1d26',
  snake: '#2ecc71',
  head: '#8cf0b4',
  apple: '#e74c3c',
};

export function createView() {
  const canvasEl = document.querySelector('#board');
  const ctx = canvasEl.getContext('2d');
  const scoreEl = document.querySelector('#score');
  const restartBtn = document.querySelector('#restart');
  const cell = canvasEl.width / GRID_SIZE;

  function drawGrid() {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID_SIZE; i++) {
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, canvasEl.height);
      ctx.moveTo(0, i * cell);
      ctx.lineTo(canvasEl.width, i * cell);
    }
    ctx.stroke();
  }

  function drawApple(apple) {
    ctx.fillStyle = COLORS.apple;
    ctx.beginPath();
    ctx.arc(apple.x * cell + cell / 2, apple.y * cell + cell / 2, cell / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSnake(snake) {
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? COLORS.head : COLORS.snake;
      ctx.fillRect(segment.x * cell + 1, segment.y * cell + 1, cell - 2, cell - 2);
    });
  }

  function drawGameOver(state) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = '#eceff4';
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px system-ui, sans-serif';
    const title = state.status === 'won' ? 'Победа!' : 'Игра окончена';
    ctx.fillText(title, canvasEl.width / 2, canvasEl.height / 2 - 10);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(`Счёт: ${state.score}`, canvasEl.width / 2, canvasEl.height / 2 + 30);
  }

  // Полная перерисовка кадра по данным из модели.
  function render(state) {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    drawGrid();
    if (state.apple) drawApple(state.apple);
    drawSnake(state.snake);

    scoreEl.textContent = state.score;
    const isPlaying = state.status === 'playing';
    restartBtn.hidden = isPlaying;
    if (!isPlaying) drawGameOver(state);
  }

  function onKey(handler) {
    window.addEventListener('keydown', (event) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault(); // чтобы стрелки не прокручивали страницу
      handler(direction);
    });
  }

  function onRestart(handler) {
    restartBtn.addEventListener('click', handler);
  }

  return { render, onKey, onRestart };
}

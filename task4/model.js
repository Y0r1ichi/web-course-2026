// MODEL — состояние игры и вся логика. Ничего не знает про DOM.

export const CODE_LENGTH = 4;

export function createModel() {
  const state = {
    secret: '',
    attempts: [], // [{ guess: '1234', bulls: 1, cows: 2 }]
    status: 'playing', // 'playing' | 'won' | 'gaveUp'
  };

  // Перемешиваем цифры 0–9 (Фишер–Йетс) и берём первые 4 — так они не повторяются.
  function generateSecret() {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, CODE_LENGTH).join('');
  }

  // Быки — совпали цифра и позиция. Коровы — цифра есть в числе, но на другом месте.
  function countBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secret[i]) {
        bulls++;
      } else if (secret.includes(guess[i])) {
        cows++;
      }
    }
    return { bulls, cows };
  }

  // Возвращает текст ошибки или null, если ввод корректен.
  function validate(guess) {
    if (guess === '') {
      return `Введите ${CODE_LENGTH} цифры.`;
    }
    if (!/^[0-9]+$/.test(guess) || guess.length !== CODE_LENGTH) {
      return `Нужно ввести ровно ${CODE_LENGTH} цифры (0–9), без букв и пробелов.`;
    }
    if (new Set(guess).size !== CODE_LENGTH) {
      return 'Цифры не должны повторяться.';
    }
    if (state.attempts.some((attempt) => attempt.guess === guess)) {
      return 'Такую попытку вы уже делали.';
    }
    return null;
  }

  function newGame() {
    state.secret = generateSecret();
    state.attempts = [];
    state.status = 'playing';
  }

  // Некорректный ввод не засчитывается: состояние не меняется.
  function makeGuess(rawGuess) {
    if (state.status !== 'playing') {
      return { ok: false, error: 'Игра окончена. Нажмите «Новая игра».' };
    }
    const guess = String(rawGuess).trim();
    const error = validate(guess);
    if (error) {
      return { ok: false, error };
    }
    const { bulls, cows } = countBullsAndCows(state.secret, guess);
    state.attempts.push({ guess, bulls, cows });
    if (bulls === CODE_LENGTH) {
      state.status = 'won';
    }
    return { ok: true, error: null };
  }

  function giveUp() {
    if (state.status === 'playing') {
      state.status = 'gaveUp';
    }
  }

  // Отдаём копию; загаданное число раскрываем только когда игра закончена.
  function getState() {
    return {
      attempts: state.attempts.map((attempt) => ({ ...attempt })),
      status: state.status,
      secret: state.status === 'playing' ? null : state.secret,
    };
  }

  return { newGame, makeGuess, giveUp, getState };
}

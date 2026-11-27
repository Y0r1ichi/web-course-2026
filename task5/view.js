

const FREQUENCIES = { green: 330, red: 262, yellow: 220, blue: 165 };

export function createView() {
  const pads = document.querySelectorAll('.pad');
  const startBtn = document.querySelector('#start');
  const levelEl = document.querySelector('#level');
  const statusEl = document.querySelector('#status');
  const audio = new (window.AudioContext || window.webkitAudioContext)();

  function findPad(color) {
    return document.querySelector(`.pad[data-color="${color}"]`);
  }

  function beep(frequency, type, duration) {
    if (audio.state === 'suspended') audio.resume();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  }

  return {
    light: (color) => findPad(color).classList.add('is-lit'),
    unlight: (color) => findPad(color).classList.remove('is-lit'),
    clearLights: () => pads.forEach((pad) => pad.classList.remove('is-lit')),
    setLevel: (level) => { levelEl.textContent = level; },
    setStatus: (text) => { statusEl.textContent = text; },
    setStartLabel: (text) => { startBtn.textContent = text; },
    playSound: (color) => beep(FREQUENCIES[color], 'sine', 0.4),
    playError: () => beep(100, 'sawtooth', 0.6),
    onStart: (handler) => startBtn.addEventListener('click', handler),
    onPad: (handler) => {
      pads.forEach((pad) => {
        pad.addEventListener('click', () => handler(pad.dataset.color));
      });
    },
  };
}

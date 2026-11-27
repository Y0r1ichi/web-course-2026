

export const COLORS = ['green', 'red', 'yellow', 'blue'];

export function createModel() {
  const state = {
    sequence: [],     // последовательность компьютера
    input: [],        // ввод игрока в текущем раунде
    phase: 'idle',    // 'idle' | 'showing' | 'input' | 'over'
  };

  function reset() {
    state.sequence = [];
    state.input = [];
    state.phase = 'idle';
  }

  
  function addStep() {
    const index = Math.floor(Math.random() * COLORS.length);
    state.sequence.push(COLORS[index]);
    state.input = [];
  }

  // 'wrong' | 'next' (верно, ждём дальше) | 'complete' (раунд пройден)
  function checkInput(color) {
    const position = state.input.length;
    if (state.sequence[position] !== color) return 'wrong';
    state.input.push(color);
    return state.input.length === state.sequence.length ? 'complete' : 'next';
  }

  return {
    reset,
    addStep,
    checkInput,
    getSequence: () => state.sequence.slice(),
    getLevel: () => state.sequence.length,
    getPhase: () => state.phase,
    setPhase: (phase) => { state.phase = phase; },
  };
}

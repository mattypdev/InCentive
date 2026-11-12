let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playCorrect() {
  try {
    const ac = getCtx()
    // Two-tone ascending chime: C5 → E5
    const notes = [523.25, 659.25]
    notes.forEach((freq, i) => {
      const osc  = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ac.currentTime + i * 0.12
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
      osc.start(start)
      osc.stop(start + 0.36)
    })
  } catch {
    // AudioContext blocked (e.g. autoplay policy) — silently skip
  }
}

export function playWrong() {
  try {
    const ac = getCtx()
    const osc  = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ac.currentTime)
    osc.frequency.linearRampToValueAtTime(220, ac.currentTime + 0.18)
    gain.gain.setValueAtTime(0.14, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.28)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + 0.29)
  } catch {
    // silently skip
  }
}

'use client'
import './questions.css'

const LABELS = ['A', 'B', 'C', 'D', 'E']

export default function McQuestion({ config, response, onChange, phase }) {
  const { options, correct } = config
  const checked = phase !== 'idle'

  function optionClass(id) {
    let cls = 'mc-option'
    if (checked) {
      if (id === correct) cls += ' mc-option--correct'
      else if (id === response) cls += ' mc-option--wrong'
      else cls += ' mc-option--dim'
    } else {
      if (id === response) cls += ' mc-option--selected'
    }
    return cls
  }

  return (
    <div className="mc-options" role="radiogroup">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          className={optionClass(opt.id)}
          role="radio"
          aria-checked={response === opt.id}
          disabled={checked}
          onClick={() => !checked && onChange(opt.id)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              const next = options[(i + 1) % options.length]
              if (!checked) onChange(next.id)
            }
            if (e.key === 'ArrowUp') {
              const prev = options[(i - 1 + options.length) % options.length]
              if (!checked) onChange(prev.id)
            }
          }}
        >
          <span className="mc-option__num" aria-hidden="true">{LABELS[i] ?? i + 1}</span>
          {opt.text}
        </button>
      ))}
    </div>
  )
}

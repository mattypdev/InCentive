'use client'
import './questions.css'

const LABELS = ['A', 'B', 'C', 'D']

export default function ScenarioQuestion({ config, response, onChange, phase }) {
  const { options, correct, outcomes = {} } = config
  const checked = phase !== 'idle'
  const showOutcome = checked && response && outcomes[response]

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
    <div className="scenario-wrap">
      <div className="mc-options" role="radiogroup">
        {options.map((opt, i) => (
          <button
            key={opt.id}
            className={optionClass(opt.id)}
            role="radio"
            aria-checked={response === opt.id}
            disabled={checked}
            onClick={() => !checked && onChange(opt.id)}
          >
            <span className="mc-option__num" aria-hidden="true">{LABELS[i] ?? i + 1}</span>
            {opt.text}
          </button>
        ))}
      </div>

      {showOutcome && (
        <div className="scenario-outcomes">
          <div className="scenario-outcomes-label">What happens next</div>
          <div className="scenario-outcomes-grid">
            {outcomes[response].map((line, i) => {
              const [when, ...rest] = line.split(': ')
              return rest.length > 0
                ? [<b key={`k${i}`}>{when}:</b>, <span key={`v${i}`}>{rest.join(': ')}</span>]
                : [<b key={`k${i}`}>—</b>, <span key={`v${i}`}>{line}</span>]
            })}
          </div>
        </div>
      )}

      {!checked && <p className="question-hint">Each choice shows its own outcome</p>}
    </div>
  )
}

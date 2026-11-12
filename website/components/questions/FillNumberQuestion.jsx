'use client'
import './questions.css'

export default function FillNumberQuestion({ config, response, onChange, phase }) {
  const { unit = '', prefix = '' } = config
  const checked = phase !== 'idle'

  return (
    <div className="fill-number-wrap">
      <div className="fill-number-input-wrap">
        {prefix && <span className="fill-number-unit">{prefix}</span>}
        <input
          type="number"
          className="fill-number-input"
          value={response ?? ''}
          disabled={checked}
          onChange={e => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) onChange(v)
            else if (e.target.value === '') onChange(null)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && response != null) {
              // parent handles Check via the button, but allow Enter shortcut
              e.currentTarget.blur()
            }
          }}
          autoFocus
          aria-label={`Enter a number${unit ? ` in ${unit}` : ''}`}
        />
        {unit && <span className="fill-number-unit">{unit}</span>}
      </div>
      {!checked && <p className="question-hint">Type your best estimate</p>}
    </div>
  )
}

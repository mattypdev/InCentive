'use client'
import './questions.css'

export default function SpotMistakeQuestion({ config, response, onChange, phase }) {
  const { rows, correct, title = 'DOCUMENT' } = config
  const checked = phase !== 'idle'

  function rowClass(row) {
    let cls = 'spot-row'
    if (checked) {
      if (row.id === correct) cls += ' spot-row--correct-reveal'
      else if (row.id === response && row.id !== correct) cls += ' spot-row--selected'
    } else {
      if (row.id === response) cls += ' spot-row--selected'
    }
    return cls
  }

  return (
    <div className="spot-doc">
      <p className="spot-doc-title">{title}</p>
      {rows.map(row => (
        <div
          key={row.id}
          className={rowClass(row)}
          role="button"
          tabIndex={0}
          aria-pressed={response === row.id}
          onClick={() => !checked && onChange(row.id)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') !checked && onChange(row.id) }}
        >
          <span>{row.label}</span>
          <b>{row.value}</b>
        </div>
      ))}
    </div>
  )
}

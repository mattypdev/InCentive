'use client'
import './questions.css'

export default function WordbankQuestion({ config, response, onChange, phase }) {
  const { template, blanks, bank, correct } = config
  const checked = phase !== 'idle'
  const filled = response || {}

  function handleBlankClick(blankId) {
    if (checked) return
    const next = { ...filled }
    delete next[blankId]
    onChange(next)
  }

  function handleWordClick(wordId) {
    if (checked) return
    const emptyBlank = blanks.find(b => !filled[b.id])
    if (!emptyBlank) return
    onChange({ ...filled, [emptyBlank.id]: wordId })
  }

  function blankClass(blankId) {
    let cls = 'wordbank-blank'
    if (filled[blankId]) {
      cls += ' wordbank-blank--filled'
      if (checked && correct) {
        cls += filled[blankId] === correct[blankId] ? ' wordbank-blank--correct' : ' wordbank-blank--wrong'
      }
    }
    return cls
  }

  function renderTemplate() {
    const parts = template.split(/({{blank:[^}]+}})/)
    return parts.map((part, i) => {
      const m = part.match(/{{blank:([^}]+)}}/)
      if (m) {
        const bid = m[1]
        const word = bank.find(w => w.id === filled[bid])
        return (
          <span
            key={i}
            className={blankClass(bid)}
            role="button"
            tabIndex={0}
            onClick={() => handleBlankClick(bid)}
            aria-label={word ? `${word.text}, click to remove` : 'blank'}
          >
            {word ? word.text : '    '}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="wordbank-wrap">
      <div className="wordbank-text">{renderTemplate()}</div>
      <div>
        <div className="sort-pool__label">Word bank</div>
        <div className="wordbank-pool">
          {bank.map(w => {
            const isUsed = Object.values(filled).includes(w.id)
            return (
              <button
                key={w.id}
                className={`wordbank-chip${isUsed ? ' wordbank-chip--used' : ''}`}
                disabled={checked || isUsed}
                onClick={() => handleWordClick(w.id)}
              >
                {w.text}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

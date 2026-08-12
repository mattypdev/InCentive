export default function FAQ({ items, heading = 'Frequently asked questions' }) {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <section className="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <h2 className="faq-heading">{heading}</h2>
      <div className="faq-list">
        {items.map(({ question, answer }) => (
          <details key={question} className="faq-item">
            <summary className="faq-question">
              <h3>{question}</h3>
              <svg className="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

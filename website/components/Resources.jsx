import { FileText, Download } from 'lucide-react'
import Button from '@/components/Button'
import './Resources.css'

export default function Resources() {
  return (
    <section className="resources section" id="resources">
      <div className="resources-inner container">
        <div className="resources-header">
          <div className="resources-icon-badge">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <h2 className="resources-title">Resources</h2>
          <p className="resources-subtitle">
            Explore our latest presentation on building financial confidence.
          </p>
        </div>

        <div className="resources-embed-wrapper">
          <iframe
            src="/financial-literacy-presentation.pdf"
            className="resources-embed"
            title="Financial Literacy Presentation"
          />
        </div>

        <div className="resources-download-bar">
          <Button
            variant="secondary"
            icon={Download}
            href="/financial-literacy-presentation.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { FAQ_GROUPS } from '../lib/content.js';

export default function HelpScreen() {
  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="mb-8">
        <div className="eyebrow mb-3">— Help centre</div>
        <h1 className="h-1" style={{ maxWidth: 720 }}>How can we help?</h1>
        <p className="section-sub mt-3" style={{ maxWidth: 560, fontSize: 16 }}>
          Answers to the questions we get most often. Can't find what you need? <Link to="/contact" style={{ borderBottom: '1px solid var(--line-strong)' }}>Get in touch</Link> — we reply within a day.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48 }} className="list-shell">
        {/* Section nav */}
        <aside className="filters" style={{ alignSelf: 'start', position: 'sticky', top: 96 }}>
          <div className="filter-block" style={{ paddingTop: 0 }}>
            <div className="filter-title">Browse by topic</div>
            <div className="stack" style={{ '--gap': '8px' }}>
              {FAQ_GROUPS.map((g) => (
                <a key={g.title} href={`#${g.title.toLowerCase()}`} className="text-muted" style={{ fontSize: 14, padding: '6px 0', display: 'block' }}>
                  {g.title}
                </a>
              ))}
            </div>
          </div>
          <div className="filter-block" style={{ borderBottom: 0 }}>
            <div className="filter-title">Still stuck?</div>
            <Link to="/contact" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <Icon name="mail" size={14} /> Contact us
            </Link>
          </div>
        </aside>

        {/* FAQ groups */}
        <div className="stack" style={{ '--gap': '48px' }}>
          {FAQ_GROUPS.map((g) => (
            <section key={g.title} id={g.title.toLowerCase()}>
              <div className="eyebrow mb-3">— {g.title}</div>
              <h2 className="h-2 mb-6">{g.title} questions</h2>
              <div className="stack" style={{ '--gap': '12px' }}>
                {g.items.map((item) => (
                  <details key={item.q} className="card-flat" style={{ padding: '18px 22px' }}>
                    <summary style={{
                      cursor: 'pointer', fontSize: 16, fontWeight: 500,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                      listStyle: 'none',
                    }}>
                      <span>{item.q}</span>
                      <Icon name="plus" size={16} />
                    </summary>
                    <p className="text-muted mt-3" style={{ fontSize: 15, lineHeight: 1.65 }}>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

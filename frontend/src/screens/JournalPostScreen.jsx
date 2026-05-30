import { Link, useParams, useNavigate } from 'react-router-dom';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { JOURNAL_POSTS } from '../lib/content.js';

// Tiny markdown helper: handle **bold** and *italic* inline. Paragraph-level only.
function renderInline(text) {
  const parts = [];
  let i = 0;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let m, last = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) parts.push(<strong key={i++}>{t.slice(2, -2)}</strong>);
    else parts.push(<em key={i++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function JournalPostScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = JOURNAL_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <div className="eyebrow mb-3">— Not found</div>
        <h1 className="h-display"><em>404</em></h1>
        <p className="text-muted mt-4">That post hasn't been written yet.</p>
        <button className="btn btn-primary mt-6" onClick={() => navigate('/journal')}>Back to journal</button>
      </div>
    );
  }

  const related = JOURNAL_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      {/* HERO BAND */}
      <div style={{ position: 'relative', aspectRatio: '21/9', maxHeight: 540, overflow: 'hidden', background: 'var(--bg-inset)' }}>
        <Photo hue={post.hue} src={post.src} alt={post.title} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }} />
        <div className="container-wide" style={{ position: 'absolute', inset: 'auto 0 36px 0' }}>
          <div className="dest-meta" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 12 }}>
            {post.dest.toUpperCase()} · {post.read.toUpperCase()} READ · BY {post.author.toUpperCase()} · {post.date.toUpperCase()}
          </div>
          <h1 className="h-display" style={{ color: 'white', maxWidth: 920 }}>{post.title}</h1>
        </div>
      </div>

      {/* BODY */}
      <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 720 }}>
        <Link to="/journal" className="text-muted" style={{ fontSize: 13 }}>← Back to journal</Link>

        <p style={{ fontSize: 20, lineHeight: 1.6, color: 'var(--ink-2)', marginTop: 32, fontStyle: 'italic' }}>
          {post.excerpt}
        </p>

        <hr className="divider mt-6 mb-6" />

        <div className="stack" style={{ '--gap': '24px' }}>
          {post.body.map((para, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink)' }}>
              {i === 0 ? (
                <>
                  <span className="serif" style={{ float: 'left', fontSize: 64, lineHeight: 0.85, paddingRight: 12, paddingTop: 6, color: 'var(--accent)' }}>
                    {String(para)[0]}
                  </span>
                  {renderInline(String(para).slice(1))}
                </>
              ) : renderInline(para)}
            </p>
          ))}
        </div>

        <hr className="divider mt-8 mb-6" />

        <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div className="eyebrow mb-2">— Written by</div>
            <div className="serif" style={{ fontSize: 22 }}>{post.author}</div>
            <span className="text-muted" style={{ fontSize: 13 }}>{post.date}</span>
          </div>
          <Link to="/journal" className="btn btn-ghost">All posts →</Link>
        </div>
      </div>

      {/* RELATED */}
      <section className="section" style={{ background: 'var(--bg-inset)', borderTop: '1px solid var(--line)' }}>
        <div className="container-wide">
          <div className="section-head">
            <div className="section-title">
              <div className="eyebrow mb-3">— Keep reading</div>
              <h2 className="h-2">Three more from the journal.</h2>
            </div>
          </div>
          <div className="grid-features-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/journal/${p.slug}`} className="hcard" style={{ cursor: 'pointer' }}>
                <div className="hcard-img" style={{ aspectRatio: '4/3' }}>
                  <Photo hue={p.hue} src={p.src} alt={p.title} />
                </div>
                <div className="hcard-body">
                  <div className="dest-meta">{p.dest.toUpperCase()} · {p.read.toUpperCase()} READ</div>
                  <h3 className="hcard-name" style={{ fontSize: 20, marginTop: 6 }}>{p.title}</h3>
                  <span className="hcard-link mt-3">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

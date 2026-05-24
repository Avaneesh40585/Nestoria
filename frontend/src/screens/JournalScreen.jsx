import { Link } from 'react-router-dom';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { JOURNAL_POSTS } from '../lib/content.js';

export default function JournalScreen() {
  const [featured, ...rest] = JOURNAL_POSTS;
  return (
    <div className="container-wide" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="mb-8">
        <div className="eyebrow mb-3">— The Journal</div>
        <h1 className="h-1" style={{ maxWidth: 720 }}>Field notes from the road.</h1>
        <p className="section-sub mt-3" style={{ maxWidth: 540, fontSize: 16 }}>
          Long-form writing about the regions Nestoria covers — what makes a stay worth flying for, what makes a season worth waiting for.
        </p>
      </div>

      {/* Featured */}
      <Link to={`/journal/${featured.slug}`} className="dest-card fade-up" style={{
        display: 'block', position: 'relative', borderRadius: 18, overflow: 'hidden',
        aspectRatio: '21 / 9', marginBottom: 32, cursor: 'pointer', border: '1px solid var(--line)',
      }}>
        <Photo hue={featured.hue} />
        <div className="dest-card-info" style={{ inset: 'auto 32px 32px 32px' }}>
          <div style={{ maxWidth: '70%' }}>
            <div className="dest-meta mb-2">{featured.dest.toUpperCase()} · {featured.read.toUpperCase()} READ · BY {featured.author.toUpperCase()}</div>
            <div className="serif" style={{ fontSize: 38, lineHeight: 1.1, color: 'white' }}>{featured.title}</div>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 560 }}>{featured.excerpt}</p>
          </div>
          <Icon name="arrow-up-right" size={24} />
        </div>
      </Link>

      {/* Rest */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
        {rest.map((p, i) => (
          <Link key={p.slug} to={`/journal/${p.slug}`} className="hcard fade-up" style={{ animationDelay: `${i * 0.05}s`, cursor: 'pointer' }}>
            <div className="hcard-img" style={{ aspectRatio: '4/3' }}>
              <Photo hue={p.hue} />
            </div>
            <div className="hcard-body">
              <div className="hcard-head">
                <span className="dest-meta">{p.dest.toUpperCase()} · {p.read.toUpperCase()} READ</span>
              </div>
              <h3 className="hcard-name" style={{ fontSize: 22, marginTop: 4 }}>{p.title}</h3>
              <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.55, marginTop: 4 }}>{p.excerpt}</p>
              <div className="hcard-foot">
                <span className="text-muted" style={{ fontSize: 12 }}>By {p.author}</span>
                <span className="hcard-link">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

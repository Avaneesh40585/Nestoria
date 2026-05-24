import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import Photo from './Photo.jsx';

function Rating({ value }) {
  return (
    <span className="hcard-rating">
      <Icon name="star" size={12} style={{ color: 'var(--accent)' }} />
      <span>{Number(value).toFixed(1)}</span>
    </span>
  );
}

export default function HotelCard({ hotel, onSave, saved }) {
  const navigate = useNavigate();
  return (
    <article className="hcard" onClick={() => navigate(`/hotel/${hotel.slug}`)}>
      <div className="hcard-img">
        <Photo hue={hotel.hue} src={hotel.hero_image_url} alt={hotel.name} />
        {hotel.badge && <span className="badge">{hotel.badge}</span>}
        {onSave && (
          <button className={`save ${saved ? 'is-saved' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onSave(hotel.id); }}
                  aria-label="Save">
            <Icon name={saved ? 'heart-fill' : 'heart'} size={16} />
          </button>
        )}
      </div>
      <div className="hcard-body">
        <div className="hcard-head">
          <h3 className="hcard-name">{hotel.name}</h3>
          {hotel.rating_avg > 0 && <Rating value={hotel.rating_avg} />}
        </div>
        <span className="hcard-loc">{[hotel.city, hotel.region].filter(Boolean).join(', ')}</span>
        <div className="hcard-foot">
          <div className="hcard-price">
            <span className="hcard-price-amount">₹{Number(hotel.price_from || 0).toLocaleString('en-IN')}</span>
            <span className="hcard-price-unit">/night</span>
          </div>
          <span className="hcard-link">View suite →</span>
        </div>
      </div>
    </article>
  );
}

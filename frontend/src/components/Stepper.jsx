import Icon from './Icon.jsx';

export default function Stepper({ value, min = 0, max = 10, onChange, label }) {
  return (
    <div className="guest-stepper">
      <div><div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div></div>
      <div className="stepper-controls">
        <button type="button" className="stepper-btn" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Icon name="minus" size={14} />
        </button>
        <span className="text-mono" style={{ minWidth: 18, textAlign: 'center', fontSize: 14 }}>{value}</span>
        <button type="button" className="stepper-btn" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}

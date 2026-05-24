export default function Photo({ hue = 'warm', label, style, src, alt = '' }) {
  return (
    <>
      {src
        ? <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }} />
        : <div className="photo-bg" data-hue={hue} style={style} />}
      {label && <div className="photo-label">{label}</div>}
    </>
  );
}

import { useNavigate } from 'react-router-dom';

export default function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
      <h1 className="h-display"><em>404</em></h1>
      <p className="text-muted mt-4">That page hasn't been written yet.</p>
      <button className="btn btn-primary mt-6" onClick={() => navigate('/')}>Back home</button>
    </div>
  );
}

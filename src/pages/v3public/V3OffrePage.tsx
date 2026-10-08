import { Navigate, useLocation } from 'react-router-dom';

export default function V3OffrePage() {
  const location = useLocation();
  return <Navigate to={`/v3/forfaits${location.search}`} replace />;
}

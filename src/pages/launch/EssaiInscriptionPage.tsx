import { Navigate, useLocation } from 'react-router-dom';

/** Legacy recurring-signup page now points to existing one-time checkout. */
export default function EssaiInscriptionPage() {
  const location = useLocation();
  return <Navigate to={`/commander${location.search}`} replace />;
}

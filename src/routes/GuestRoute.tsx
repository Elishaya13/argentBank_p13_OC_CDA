import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  return token ? <Navigate to="/" replace state={{ from: location }} /> : <>{children}</>;
};

export default GuestRoute;
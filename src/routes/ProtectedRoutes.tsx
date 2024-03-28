import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import NotFound from '../pages/notFound/NotFound';
import Profile from '../pages/profile/Profile';

export const ProtectedRoutes = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? (
        <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    ) : <Navigate to='/login' replace  />;
}

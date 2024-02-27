import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/HomePage';
import Login from '../pages/login/Login';
import Profile from '../pages/profile/Profile';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'login', element: <Login/> },
    ],
  },
]);

export default Router;

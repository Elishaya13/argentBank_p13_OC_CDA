import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/HomePage';
import Login from '../pages/login/Login';
import { ProtectedRoutes } from './ProtectedRoutes';
import NotFound from '../pages/notFound/NotFound';
import GuestRoute from './GuestRoute';


const Router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: 'login', element: <GuestRoute><Login /></GuestRoute> },
        {  
          path: 'profile/*',
          element: <ProtectedRoutes />,         
        },      
      ]
    },
    {
      path: '/*',
      element: <NotFound />
    },
    
  ],
);

export default Router;

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/HomePage';
import Login from '../pages/login/Login';
import { ProtectedRoutes } from './ProtectedRoutes';
import NotFound from '../pages/notFound/NotFound';


const Router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: 'login', element: <Login /> },
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

// const Router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       { path: '/', element: <Home /> },
//       { path: 'profile', element: <ProtectedRoute><Profile token={''}/></ProtectedRoute> },
//       { path: 'login', element: <Login /> },
//       {path: '/*', element: <Home />}
//     ],
//   },
// ]);

// const Router = createBrowserRouter(
//   [
//     {
//       path: '/',
//       element: <Layout />,
//     },
//     {
//       path: 'login',
//       element: <Login />
//     },
//     {
//       path: '/*',
//       element: <Home />
//     },  
//     {
//         element: <ProtectedRoutes />,
//         children: [
//           {
//             path: '/profile',
//             element: <Profile />
//           },
//         ]
//     },     
//     ],
//  );

// export default Router;

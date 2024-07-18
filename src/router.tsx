import {createBrowserRouter, Navigate} from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import BookPage from './pages/BookPage';
import AuthLayout from './layouts/AuthLayout';

export const router = createBrowserRouter([
  {
    path:'/',
    element:<Navigate to={'/dashboard/home'}/>
  },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children:[
      {
        path:"home",
        element:<HomePage/>
      },
      {
        path:"books",
        element:<BookPage/>
      }
      ],
      
    },
    {
      path:"/auth",
      element:<AuthLayout/>,
      children:[
        {
          path:"login",
          element: <LoginPage />
        },
        {
        path:"register",
        element: <Register />
        }
      ]
    }

  ]);
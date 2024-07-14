import {createBrowserRouter} from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import BookPage from './pages/BookPage';

export const router = createBrowserRouter([
    {
      path: "dashboard",
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
        path:"/login",
        element: <LoginPage />
    },
    {
      path:"/register",
      element: <Register />
  }

  ]);
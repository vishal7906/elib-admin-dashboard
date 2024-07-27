import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import BookPage from './pages/BookPage';
import AuthLayout from './layouts/AuthLayout';
import CreateBook from './pages/CreateBook';
import EditBookPage from './pages/EditBookPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/dashboard/home'} />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'books',
        element: <BookPage />
      },
      {
        path: 'books/create',
        element: <CreateBook />
      },
      {
        path: 'books/edit/:id',
        element: <EditBookPage />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]);

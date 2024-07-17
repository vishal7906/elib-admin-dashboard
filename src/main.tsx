import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryclient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryclient}>
    <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>,
)

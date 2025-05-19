import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DomainPage from './pages/DomainPage';
import KeywordPage from './pages/KeywordPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import ContentPage from './pages/ContentPage';
import WordCountPage from './pages/WordCountPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/domain',
    element: <DomainPage />,
  },
  {
    path: '/keyword',
    element: <KeywordPage />,
  },
  {
    path: '/image-generator',
    element: <ImageGeneratorPage />,
  },
  {
    path: '/pinterest',
    element: <PinterestPage />,
  },
  {
    path: '/signature',
    element: <SignaturePage />,
  },
  {
    path: '/content',
    element: <ContentPage />,
  },
  {
    path: '/word-count',
    element: <WordCountPage />,
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;

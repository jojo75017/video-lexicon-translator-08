
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KeywordPage from './pages/KeywordPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import WordCountPage from './pages/WordCountPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
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
    path: '/pinterest-generator',
    element: <PinterestPage />,
  },
  {
    path: '/signature-generator',
    element: <SignaturePage />,
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

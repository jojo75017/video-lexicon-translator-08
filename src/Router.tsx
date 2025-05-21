
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KeywordPage from './pages/KeywordPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import WordCountPage from './pages/WordCountPage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import InternalLinkingPage from './pages/InternalLinkingPage';
import TrackingPage from './pages/TrackingPage';
import QuoraPage from './pages/QuoraPage'; 
import StructurePage from './pages/StructurePage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import ContentPage from './pages/ContentPage';

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
    path: '/keyword-meta',
    element: <KeywordMetaPage />,
  },
  {
    path: '/keyword-generator',
    element: <KeywordGeneratorPage />,
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
    path: '/pinterest',
    element: <PinterestPage />,
  },
  {
    path: '/signature-generator',
    element: <SignaturePage />,
  },
  {
    path: '/signature',
    element: <SignaturePage />,
  },
  {
    path: '/word-count',
    element: <WordCountPage />,
  },
  {
    path: '/internal-linking',
    element: <InternalLinkingPage />,
  },
  {
    path: '/tracking',
    element: <TrackingPage />,
  },
  {
    path: '/quora',
    element: <QuoraPage />,
  },
  {
    path: '/structure',
    element: <StructurePage />,
  },
  {
    path: '/content',
    element: <ContentPage />,
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;

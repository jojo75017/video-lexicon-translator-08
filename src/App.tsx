
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import InternalLinkingPage from './pages/InternalLinkingPage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import './App.css';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/internal-linking" element={<InternalLinkingPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
      </Routes>
    </Router>
  );
};

export default App;

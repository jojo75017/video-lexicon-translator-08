
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import InternalLinkingPage from './pages/InternalLinkingPage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
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
      </Routes>
    </Router>
  );
};

export default App;

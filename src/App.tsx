
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import InternalLinkingPage from './pages/InternalLinkingPage';
import TrackingPage from './pages/TrackingPage';
import { Toaster } from 'sonner';
import './App.css';

const App = () => {
  console.log('App rendering with simplified routes');
  
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
        <Route path="/internal-linking" element={<InternalLinkingPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
      </Routes>
    </Router>
  );
};

export default App;

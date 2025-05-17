
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import InternalLinkingPage from './pages/InternalLinkingPage';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import SeoPage from './pages/SeoPage';
import OutilsSeo from './pages/OutilsSeo';
import PerformancePage from './pages/PerformancePage';
import WordCountPage from './pages/WordCountPage';
import BacklinksPage from './pages/BacklinksPage';
import MetricsPage from './pages/MetricsPage';
import QuoraPage from './pages/QuoraPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StructurePage from './pages/StructurePage';
import SuggestionsPage from './pages/SuggestionsPage';
import TrackingPage from './pages/TrackingPage';
import './App.css';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<Index />} />
        <Route path="/hierarchy" element={<Index />} />
        <Route path="/wordcount" element={<WordCountPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/backlinks" element={<BacklinksPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/quora" element={<QuoraPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/internal-linking" element={<InternalLinkingPage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/outils-seo" element={<OutilsSeo />} />
        <Route path="/tracking" element={<TrackingPage />} />
        
        {/* Routes équivalentes localisées */}
        <Route path="/hierarchie" element={<Index />} />
        <Route path="/nombre-mots" element={<WordCountPage />} />
        <Route path="/liens-internes" element={<InternalLinkingPage />} />
        <Route path="/metriques" element={<MetricsPage />} />
        <Route path="/analyse-seo" element={<SeoPage />} />
        <Route path="/mots-cles" element={<KeywordGeneratorPage />} />
        <Route path="/performances" element={<PerformancePage />} />
        <Route path="/structure-site" element={<StructurePage />} />
        <Route path="/outils" element={<OutilsSeo />} />
        <Route path="/suivi-positions" element={<TrackingPage />} />
      </Routes>
    </Router>
  );
};

export default App;

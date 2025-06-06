import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import SeoAnalysisPage from '@/pages/SeoAnalysisPage';
import KeywordPage from '@/pages/KeywordPage';
import KeywordGeneratorPage from '@/pages/KeywordGeneratorPage';
import ContentWriterPage from '@/pages/ContentWriterPage';
import ImageAnalysisPage from '@/pages/ImageAnalysisPage';
import SERPAnalysisPage from '@/pages/SERPAnalysisPage';
import AccessibilityAnalysisPage from '@/pages/AccessibilityAnalysisPage';
import SchemaMarkupGeneratorPage from '@/pages/SchemaMarkupGeneratorPage';
import RobotsTxtGeneratorPage from '@/pages/RobotsTxtGeneratorPage';
import SitemapGeneratorPage from '@/pages/SitemapGeneratorPage';
import PrivacyPolicyGeneratorPage from '@/pages/PrivacyPolicyGeneratorPage';
import TermsConditionsGeneratorPage from '@/pages/TermsConditionsGeneratorPage';
import AboutUsGeneratorPage from '@/pages/AboutUsGeneratorPage';
import ContactUsGeneratorPage from '@/pages/ContactUsGeneratorPage';
import FaqGeneratorPage from '@/pages/FaqGeneratorPage';
import PricingPage from '@/pages/PricingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import UnderMaintenancePage from '@/pages/UnderMaintenancePage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import CategoryPage from '@/pages/CategoryPage';
import TagPage from '@/pages/TagPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import SecuritySettingsPage from '@/pages/SecuritySettingsPage';
import NotificationsSettingsPage from '@/pages/NotificationsSettingsPage';
import SubscriptionSettingsPage from '@/pages/SubscriptionSettingsPage';
import SupportPage from '@/pages/SupportPage';
import DocumentationPage from '@/pages/DocumentationPage';
import ChangelogPage from '@/pages/ChangelogPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import ApiReferencePage from '@/pages/ApiReferencePage';
import StatusPage from '@/pages/StatusPage';
import TeamPage from '@/pages/TeamPage';
import CareersPage from '@/pages/CareersPage';
import PressPage from '@/pages/PressPage';
import LegalPage from '@/pages/LegalPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import DMARCRecordGeneratorPage from '@/pages/DMARCRecordGeneratorPage';
import SPFRecordGeneratorPage from '@/pages/SPFRecordGeneratorPage';
import PWAInstallPage from '@/pages/PWAInstallPage';
import SpeedTestPage from '@/pages/SpeedTestPage';
import PasswordGeneratorPage from '@/pages/PasswordGeneratorPage';
import ColorPaletteGeneratorPage from '@/pages/ColorPaletteGeneratorPage';
import LoremIpsumGeneratorPage from '@/pages/LoremIpsumGeneratorPage';
import FaviconGeneratorPage from '@/pages/FaviconGeneratorPage';
import QRGeneratorPage from '@/pages/QRGeneratorPage';
import CSSMinifierPage from '@/pages/CSSMinifierPage';
import HTMLFormatterPage from '@/pages/HTMLFormatterPage';
import JSONFormatterPage from '@/pages/JSONFormatterPage';
import UglifyJSPage from '@/pages/UglifyJSPage';
import HTMLEncodeDecodePage from '@/pages/HTMLEncodeDecodePage';
import Base64EncodeDecodePage from '@/pages/Base64EncodeDecodePage';
import URLEncodeDecodePage from '@/pages/URLEncodeDecodePage';
import GUIDGeneratorPage from '@/pages/GUIDGeneratorPage';
import TextDiffCheckerPage from '@/pages/TextDiffCheckerPage';
import WordCounterPage from '@/pages/WordCounterPage';
import CaseConverterPage from '@/pages/CaseConverterPage';
import TextToSpeechPage from '@/pages/TextToSpeechPage';
import SpeechToTextPage from '@/pages/SpeechToTextPage';
import ImageToTextPage from '@/pages/ImageToTextPage';
import TextTranslatorPage from '@/pages/TextTranslatorPage';
import TextSummarizerPage from '@/pages/TextSummarizerPage';
import GrammarCheckerPage from '@/pages/GrammarCheckerPage';
import PlagiarismCheckerPage from '@/pages/PlagiarismCheckerPage';
import EmailValidatorPage from '@/pages/EmailValidatorPage';
import IPAddressLookupPage from '@/pages/IPAddressLookupPage';
import UserAgentParserPage from '@/pages/UserAgentParserPage';
import HTTPStatusCheckerPage from '@/pages/HTTPStatusCheckerPage';
import DNSLookupPage from '@/pages/DNSLookupPage';
import PingToolPage from '@/pages/PingToolPage';
import TracerouteToolPage from '@/pages/TracerouteToolPage';
import GeoIPLookupPage from '@/pages/GeoIPLookupPage';
import PortScannerPage from '@/pages/PortScannerPage';
import ReverseIPLookupPage from '@/pages/ReverseIPLookupPage';
import SharedHostingCheckerPage from '@/pages/SharedHostingCheckerPage';
import BlacklistLookupPage from '@/pages/BlacklistLookupPage';
import HeaderAnalyzerPage from '@/pages/HeaderAnalyzerPage';
import SSLCheckerPage from '@/pages/SSLCheckerPage';
import CSSBeautifierPage from '@/pages/CSSBeautifierPage';
import XMLFormatterPage from '@/pages/XMLFormatterPage';
import MarkdownFormatterPage from '@/pages/MarkdownFormatterPage';
import CSVFormatterPage from '@/pages/CSVFormatterPage';
import YAMLFormatterPage from '@/pages/YAMLFormatterPage';
import SQLFormatterPage from '@/pages/SQLFormatterPage';
import RobotsTxtValidatorPage from '@/pages/RobotsTxtValidatorPage';
import SitemapValidatorPage from '@/pages/SitemapValidatorPage';
import StructuredDataValidatorPage from '@/pages/StructuredDataValidatorPage';
import MobileFriendlyTestPage from '@/pages/MobileFriendlyTestPage';
import PageSpeedInsightsPage from '@/pages/PageSpeedInsightsPage';
import WebpageSchemaGeneratorPage from '@/pages/WebpageSchemaGeneratorPage';
import ArticleSchemaGeneratorPage from '@/pages/ArticleSchemaGeneratorPage';
import BreadcrumbSchemaGeneratorPage from '@/pages/BreadcrumbSchemaGeneratorPage';
import EventSchemaGeneratorPage from '@/pages/EventSchemaGeneratorPage';
import OrganizationSchemaGeneratorPage from '@/pages/OrganizationSchemaGeneratorPage';
import PersonSchemaGeneratorPage from '@/pages/PersonSchemaGeneratorPage';
import ProductSchemaGeneratorPage from '@/pages/ProductSchemaGeneratorPage';
import RecipeSchemaGeneratorPage from '@/pages/RecipeSchemaGeneratorPage';
import ReviewSchemaGeneratorPage from '@/pages/ReviewSchemaGeneratorPage';
import ServiceSchemaGeneratorPage from '@/pages/ServiceSchemaGeneratorPage';
import VideoSchemaGeneratorPage from '@/pages/VideoSchemaGeneratorPage';
import LocalBusinessSchemaGeneratorPage from '@/pages/LocalBusinessSchemaGeneratorPage';
import BookSchemaGeneratorPage from '@/pages/BookSchemaGeneratorPage';
import CourseSchemaGeneratorPage from '@/pages/CourseSchemaGeneratorPage';
import DatasetSchemaGeneratorPage from '@/pages/DatasetSchemaGeneratorPage';
import JobPostingSchemaGeneratorPage from '@/pages/JobPostingSchemaGeneratorPage';
import SoftwareAppSchemaGeneratorPage from '@/pages/SoftwareAppSchemaGeneratorPage';
import SpeakableSchemaGeneratorPage from '@/pages/SpeakableSchemaGeneratorPage';
import HowToSchemaGeneratorPage from '@/pages/HowToSchemaGeneratorPage';
import QAPageSchemaGeneratorPage from '@/pages/QAPageSchemaGeneratorPage';
import CollectionPageSchemaGeneratorPage from '@/pages/CollectionPageSchemaGeneratorPage';
import ProfilePageSchemaGeneratorPage from '@/pages/ProfilePageSchemaGeneratorPage';
import SocialProfileSchemaGeneratorPage from '@/pages/SocialProfileSchemaGeneratorPage';
import FactCheckSchemaGeneratorPage from '@/pages/FactCheckSchemaGeneratorPage';
import LiveBlogPostingSchemaGeneratorPage from '@/pages/LiveBlogPostingSchemaGeneratorPage';
import NewsArticleSchemaGeneratorPage from '@/pages/NewsArticleSchemaGeneratorPage';
import ReportSchemaGeneratorPage from '@/pages/ReportSchemaGeneratorPage';
import AdvertiserContentArticleSchemaGeneratorPage from '@/pages/AdvertiserContentArticleSchemaGeneratorPage';
import AnalysisNewsArticleSchemaGeneratorPage from '@/pages/AnalysisNewsArticleSchemaGeneratorPage';
import AskPublicNewsArticleSchemaGeneratorPage from '@/pages/AskPublicNewsArticleSchemaGeneratorPage';
import BackgroundNewsArticleSchemaGeneratorPage from '@/pages/BackgroundNewsArticleSchemaGeneratorPage';
import BroadcastNewsArticleSchemaGeneratorPage from '@/pages/BroadcastNewsArticleSchemaGeneratorPage';
import OpinionNewsArticleSchemaGeneratorPage from '@/pages/OpinionNewsArticleSchemaGeneratorPage';
import ReviewNewsArticleSchemaGeneratorPage from '@/pages/ReviewNewsArticleSchemaGeneratorPage';
import SatiricalNewsArticleSchemaGeneratorPage from '@/pages/SatiricalNewsArticleSchemaGeneratorPage';
import UserComments from '@/components/dashboard/UserComments';
import KeywordGuideComplete from '@/pages/KeywordGuideComplete';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/seo-analysis" element={<SeoAnalysisPage />} />
        <Route path="/keyword-analysis" element={<KeywordPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/content-writer" element={<ContentWriterPage />} />
        <Route path="/image-analysis" element={<ImageAnalysisPage />} />
        <Route path="/serp-analysis" element={<SERPAnalysisPage />} />
        <Route path="/accessibility-analysis" element={<AccessibilityAnalysisPage />} />
        <Route path="/schema-generator" element={<SchemaMarkupGeneratorPage />} />
        <Route path="/robots-txt-generator" element={<RobotsTxtGeneratorPage />} />
        <Route path="/sitemap-generator" element={<SitemapGeneratorPage />} />
        <Route path="/privacy-policy-generator" element={<PrivacyPolicyGeneratorPage />} />
        <Route path="/terms-conditions-generator" element={<TermsConditionsGeneratorPage />} />
        <Route path="/about-us-generator" element={<AboutUsGeneratorPage />} />
        <Route path="/contact-us-generator" element={<ContactUsGeneratorPage />} />
        <Route path="/faq-generator" element={<FaqGeneratorPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/security-settings" element={<SecuritySettingsPage />} />
        <Route path="/notifications-settings" element={<NotificationsSettingsPage />} />
        <Route path="/subscription-settings" element={<SubscriptionSettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/api-reference" element={<ApiReferencePage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/dmarc-record-generator" element={<DMARCRecordGeneratorPage />} />
        <Route path="/spf-record-generator" element={<SPFRecordGeneratorPage />} />
        <Route path="/pwa-install" element={<PWAInstallPage />} />
        <Route path="/speed-test" element={<SpeedTestPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
        <Route path="/color-palette-generator" element={<ColorPaletteGeneratorPage />} />
        <Route path="/lorem-ipsum-generator" element={<LoremIpsumGeneratorPage />} />
        <Route path="/favicon-generator" element={<FaviconGeneratorPage />} />
        <Route path="/qr-generator" element={<QRGeneratorPage />} />
        <Route path="/css-minifier" element={<CSSMinifierPage />} />
        <Route path="/html-formatter" element={<HTMLFormatterPage />} />
        <Route path="/json-formatter" element={<JSONFormatterPage />} />
        <Route path="/uglify-js" element={<UglifyJSPage />} />
        <Route path="/html-encode-decode" element={<HTMLEncodeDecodePage />} />
        <Route path="/base64-encode-decode" element={<Base64EncodeDecodePage />} />
        <Route path="/url-encode-decode" element={<URLEncodeDecodePage />} />
        <Route path="/guid-generator" element={<GUIDGeneratorPage />} />
        <Route path="/text-diff-checker" element={<TextDiffCheckerPage />} />
        <Route path="/word-counter" element={<WordCounterPage />} />
        <Route path="/case-converter" element={<CaseConverterPage />} />
        <Route path="/text-to-speech" element={<TextToSpeechPage />} />
        <Route path="/speech-to-text" element={<SpeechToTextPage />} />
        <Route path="/image-to-text" element={<ImageToTextPage />} />
        <Route path="/text-translator" element={<TextTranslatorPage />} />
        <Route path="/text-summarizer" element={<TextSummarizerPage />} />
        <Route path="/grammar-checker" element={<GrammarCheckerPage />} />
        <Route path="/plagiarism-checker" element={<PlagiarismCheckerPage />} />
        <Route path="/email-validator" element={<EmailValidatorPage />} />
        <Route path="/ip-address-lookup" element={<IPAddressLookupPage />} />
        <Route path="/user-agent-parser" element={<UserAgentParserPage />} />
        <Route path="/http-status-checker" element={<HTTPStatusCheckerPage />} />
        <Route path="/dns-lookup" element={<DNSLookupPage />} />
        <Route path="/ping-tool" element={<PingToolPage />} />
        <Route path="/traceroute-tool" element={<TracerouteToolPage />} />
        <Route path="/geoip-lookup" element={<GeoIPLookupPage />} />
        <Route path="/port-scanner" element={<PortScannerPage />} />
        <Route path="/reverse-ip-lookup" element={<ReverseIPLookupPage />} />
        <Route path="/shared-hosting-checker" element={<SharedHostingCheckerPage />} />
        <Route path="/blacklist-lookup" element={<BlacklistLookupPage />} />
        <Route path="/header-analyzer" element={<HeaderAnalyzerPage />} />
        <Route path="/ssl-checker" element={<SSLCheckerPage />} />
        <Route path="/css-beautifier" element={<CSSBeautifierPage />} />
        <Route path="/xml-formatter" element={<XMLFormatterPage />} />
        <Route path="/markdown-formatter" element={<MarkdownFormatterPage />} />
        <Route path="/csv-formatter" element={<CSVFormatterPage />} />
        <Route path="/yaml-formatter" element={<YAMLFormatterPage />} />
        <Route path="/sql-formatter" element={<SQLFormatterPage />} />
        <Route path="/robots-txt-validator" element={<RobotsTxtValidatorPage />} />
        <Route path="/sitemap-validator" element={<SitemapValidatorPage />} />
        <Route path="/structured-data-validator" element={<StructuredDataValidatorPage />} />
        <Route path="/mobile-friendly-test" element={<MobileFriendlyTestPage />} />
        <Route path="/page-speed-insights" element={<PageSpeedInsightsPage />} />
        <Route path="/webpage-schema-generator" element={<WebpageSchemaGeneratorPage />} />
        <Route path="/article-schema-generator" element={<ArticleSchemaGeneratorPage />} />
        <Route path="/breadcrumb-schema-generator" element={<BreadcrumbSchemaGeneratorPage />} />
        <Route path="/event-schema-generator" element={<EventSchemaGeneratorPage />} />
        <Route path="/organization-schema-generator" element={<OrganizationSchemaGeneratorPage />} />
        <Route path="/person-schema-generator" element={<PersonSchemaGeneratorPage />} />
        <Route path="/product-schema-generator" element={<ProductSchemaGeneratorPage />} />
        <Route path="/recipe-schema-generator" element={<RecipeSchemaGeneratorPage />} />
        <Route path="/review-schema-generator" element={<ReviewSchemaGeneratorPage />} />
        <Route path="/service-schema-generator" element={<ServiceSchemaGeneratorPage />} />
        <Route path="/video-schema-generator" element={<VideoSchemaGeneratorPage />} />
        <Route path="/local-business-schema-generator" element={<LocalBusinessSchemaGeneratorPage />} />
        <Route path="/book-schema-generator" element={<BookSchemaGeneratorPage />} />
        <Route path="/course-schema-generator" element={<CourseSchemaGeneratorPage />} />
        <Route path="/dataset-schema-generator" element={<DatasetSchemaGeneratorPage />} />
        <Route path="/job-posting-schema-generator" element={<JobPostingSchemaGeneratorPage />} />
        <Route path="/software-app-schema-generator" element={<SoftwareAppSchemaGeneratorPage />} />
        <Route path="/speakable-schema-generator" element={<SpeakableSchemaGeneratorPage />} />
        <Route path="/how-to-schema-generator" element={<HowToSchemaGeneratorPage />} />
        <Route path="/qa-page-schema-generator" element={<QAPageSchemaGeneratorPage />} />
        <Route path="/collection-page-schema-generator" element={<CollectionPageSchemaGeneratorPage />} />
        <Route path="/profile-page-schema-generator" element={<ProfilePageSchemaGeneratorPage />} />
        <Route path="/social-profile-schema-generator" element={<SocialProfileSchemaGeneratorPage />} />
        <Route path="/fact-check-schema-generator" element={<FactCheckSchemaGeneratorPage />} />
        <Route path="/live-blog-posting-schema-generator" element={<LiveBlogPostingSchemaGeneratorPage />} />
        <Route path="/news-article-schema-generator" element={<NewsArticleSchemaGeneratorPage />} />
        <Route path="/report-schema-generator" element={<ReportSchemaGeneratorPage />} />
        <Route path="/advertiser-content-article-schema-generator" element={<AdvertiserContentArticleSchemaGeneratorPage />} />
        <Route path="/analysis-news-article-schema-generator" element={<AnalysisNewsArticleSchemaGeneratorPage />} />
        <Route path="/ask-public-news-article-schema-generator" element={<AskPublicNewsArticleSchemaGeneratorPage />} />
        <Route path="/background-news-article-schema-generator" element={<BackgroundNewsArticleSchemaGeneratorPage />} />
        <Route path="/broadcast-news-article-schema-generator" element={<BroadcastNewsArticleSchemaGeneratorPage />} />
        <Route path="/opinion-news-article-schema-generator" element={<OpinionNewsArticleSchemaGeneratorPage />} />
        <Route path="/review-news-article-schema-generator" element={<ReviewNewsArticleSchemaGeneratorPage />} />
        <Route path="/satirical-news-article-schema-generator" element={<SatiricalNewsArticleSchemaGeneratorPage />} />
         <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/tag/:id" element={<TagPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/401" element={<UnauthorizedPage />} />
         <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/maintenance" element={<UnderMaintenancePage />} />
        <Route path="/comments" element={<UserComments />} />
        <Route path="/keyword-guide-complete" element={<KeywordGuideComplete />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

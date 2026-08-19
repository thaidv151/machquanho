import React, { useState, useEffect } from 'react';
import { ViewState, Article, ResearchEntry, AdminUser, CategoryInfo, SiteConfig, ExploreTopic } from './types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_RESEARCH_ENTRIES, 
  EXPLORE_TOPICS, 
  CATEGORIES_LIST, 
  INITIAL_ADMIN_USERS, 
  DEFAULT_SITE_CONFIG 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { ExploreTopicModal } from './components/ExploreTopicModal';
import { LoginModal } from './components/LoginModal';
import { HomePage } from './views/HomePage';
import { NewsListPage } from './views/NewsListPage';
import { ArticleDetailPage } from './views/ArticleDetailPage';
import { AboutPage } from './views/AboutPage';
import { ResearchDiaryPage } from './views/ResearchDiaryPage';
import { AdminPortal } from './views/AdminPortal';
import { audioPlayer } from './utils/audioSynth';
import { apiService } from './services/apiService';

// Helper to convert URL location into ViewState
function getViewFromPath(path: string): ViewState {
  const [pathname, search] = path.split('?');
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const queryParams = new URLSearchParams(search || '');

  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/home') {
    return { type: 'home' };
  }
  if (cleanPath.startsWith('/admin')) {
    const parts = cleanPath.split('/');
    const sec = parts[2] || 'dashboard';
    const validSections = ['dashboard', 'articles', 'users', 'categories', 'banner', 'header', 'menus', 'research', 'explore', 'team', 'footer', 'seo', 'scripts'];
    const section = (validSections.includes(sec) ? sec : 'dashboard') as any;
    return { type: 'admin', section };
  }
  if (cleanPath.startsWith('/news')) {
    const category = queryParams.get('category') || undefined;
    const searchQuery = queryParams.get('q') || undefined;
    return { type: 'news', category, searchQuery };
  }
  if (cleanPath.startsWith('/article/')) {
    const articleId = decodeURIComponent(cleanPath.replace('/article/', ''));
    return { type: 'article-detail', articleId };
  }
  if (cleanPath === '/research-diary') {
    const selectedId = queryParams.get('id') || undefined;
    return { type: 'research-diary', selectedId };
  }
  if (cleanPath === '/about') {
    return { type: 'about' };
  }
  return { type: 'home' };
}

// Helper to convert ViewState into URL path string
function getPathFromView(view: ViewState): string {
  switch (view.type) {
    case 'home':
      return '/';
    case 'admin':
      return `/admin/${view.section || 'dashboard'}`;
    case 'news':
      if (view.category && view.searchQuery) return `/news?category=${encodeURIComponent(view.category)}&q=${encodeURIComponent(view.searchQuery)}`;
      if (view.category) return `/news?category=${encodeURIComponent(view.category)}`;
      if (view.searchQuery) return `/news?q=${encodeURIComponent(view.searchQuery)}`;
      return '/news';
    case 'article-detail':
      return `/article/${view.articleId}`;
    case 'research-diary':
      return view.selectedId ? `/research-diary?id=${encodeURIComponent(view.selectedId)}` : '/research-diary';
    case 'about':
      return '/about';
    default:
      return '/';
  }
}

export default function App() {
  // Global View Navigation State initialized from URL Path
  const [currentView, setCurrentView] = useState<ViewState>(() => 
    getViewFromPath(window.location.pathname + window.location.search)
  );

  // Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Main Persistent App Data
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [researchEntries, setResearchEntries] = useState<ResearchEntry[]>(INITIAL_RESEARCH_ENTRIES);
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES_LIST);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [exploreTopics, setExploreTopics] = useState<ExploreTopic[]>(EXPLORE_TOPICS);

  // 1. Sync URL path on initial load & popstate (Browser Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const newView = getViewFromPath(window.location.pathname + window.location.search);
      setCurrentView(newView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Verify Auth session on mount and handle protected path refresh
  useEffect(() => {
    async function checkAuth() {
      const user = await apiService.getMe();
      if (user) {
        setCurrentUser(user);
      } else {
        const initialView = getViewFromPath(window.location.pathname + window.location.search);
        if (initialView.type === 'admin') {
          setIsLoginModalOpen(true);
        }
      }
    }
    checkAuth();
  }, []);

  // 3. Lazy Data Fetching: Fetch site config on mount, and lazy-load view-specific data on view change
  useEffect(() => {
    async function loadSiteConfig() {
      try {
        const config = await apiService.getSiteConfig();
        if (config && config.siteName) setSiteConfig((prev) => ({ ...prev, ...config }));
      } catch (err) {
        console.warn('Load site config error:', err);
      }
    }
    loadSiteConfig();
  }, []);

  // 4. Dynamic Favicon Sync based on uploaded logo image
  useEffect(() => {
    const iconUrl = siteConfig.logoType === 'image' && siteConfig.logoImageUrl 
      ? siteConfig.logoImageUrl 
      : undefined;

    if (iconUrl) {
      let linkElement = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(linkElement);
      }
      linkElement.href = iconUrl;
    }
  }, [siteConfig.logoType, siteConfig.logoImageUrl]);

  useEffect(() => {
    async function loadViewData() {
      try {
        if (currentView.type === 'home') {
          const [arts, resEntries, expTopics] = await Promise.all([
            apiService.getArticles(),
            apiService.getResearchEntries(),
            apiService.getExploreTopics(),
          ]);
          if (arts && arts.length > 0) setArticles(arts);
          if (resEntries && resEntries.length > 0) setResearchEntries(resEntries);
          if (expTopics && expTopics.length > 0) setExploreTopics(expTopics);
        } else if (currentView.type === 'news' || currentView.type === 'article-detail') {
          const [arts, cats] = await Promise.all([
            apiService.getArticles(),
            apiService.getCategories(),
          ]);
          if (arts && arts.length > 0) setArticles(arts);
          if (cats && cats.length > 0) setCategories(cats);
        } else if (currentView.type === 'research-diary') {
          const resEntries = await apiService.getResearchEntries();
          if (resEntries && resEntries.length > 0) setResearchEntries(resEntries);
        } else if (currentView.type === 'admin') {
          const [arts, cats, resEntries, expTopics, adminUsers] = await Promise.all([
            apiService.getArticles(),
            apiService.getCategories(),
            apiService.getResearchEntries(),
            apiService.getExploreTopics(),
            apiService.adminGetUsers().catch(() => null),
          ]);
          if (arts && arts.length > 0) setArticles(arts);
          if (cats && cats.length > 0) setCategories(cats);
          if (resEntries && resEntries.length > 0) setResearchEntries(resEntries);
          if (expTopics && expTopics.length > 0) setExploreTopics(expTopics);
          if (adminUsers && adminUsers.length > 0) setUsers(adminUsers);
        }
      } catch (err) {
        console.warn('Lazy data loading error:', err);
      }
    }
    loadViewData();
  }, [currentView.type]);

  // 6. Dynamic Meta Tags & SEO Script Injector Effect
  useEffect(() => {
    const seo = siteConfig.seo;
    if (!seo) return;

    // Set Document Title
    if (currentView.type === 'home') {
      document.title = seo.homeMetaTitle || seo.defaultMetaTitle || 'MẠCH QUAN HỌ - Kinh Bắc Di Sản';
    } else if (currentView.type === 'news') {
      document.title = `Tin tức & Hoạt động di sản - ${siteConfig.siteName || 'MẠCH QUAN HỌ'}`;
    } else if (currentView.type === 'research-diary') {
      document.title = `Nhật ký điền dã & nghiên cứu - ${siteConfig.siteName || 'MẠCH QUAN HỌ'}`;
    } else if (currentView.type === 'about') {
      document.title = `Về chúng tôi & Nghệ nhân - ${siteConfig.siteName || 'MẠCH QUAN HỌ'}`;
    } else if (currentView.type === 'admin') {
      document.title = `Cổng quản trị nội dung (CMS) - ${siteConfig.siteName || 'MẠCH QUAN HỌ'}`;
    }

    const updateMetaTag = (nameAttr: string, keyVal: string, contentVal?: string) => {
      if (!contentVal) return;
      let element = document.querySelector(`meta[${nameAttr}="${keyVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, keyVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    updateMetaTag('name', 'description', currentView.type === 'home' ? seo.homeMetaDescription : seo.defaultMetaDescription);
    updateMetaTag('name', 'keywords', currentView.type === 'home' ? seo.homeMetaKeywords : seo.defaultMetaKeywords);
    updateMetaTag('property', 'og:title', currentView.type === 'home' ? seo.homeMetaTitle : seo.defaultMetaTitle);
    updateMetaTag('property', 'og:description', currentView.type === 'home' ? seo.homeMetaDescription : seo.defaultMetaDescription);
    if (seo.homeOgImage) updateMetaTag('property', 'og:image', seo.homeOgImage);

    // Google Search Console verification meta tag
    if (seo.googleSiteVerification) {
      const gscCode = seo.googleSiteVerification.includes('content="')
        ? seo.googleSiteVerification.split('content="')[1]?.split('"')[0]
        : seo.googleSiteVerification.replace('google-site-verification=', '');
      if (gscCode) updateMetaTag('name', 'google-site-verification', gscCode);
    }
  }, [currentView, siteConfig.seo]);

  // 4. Increment View Count & Fetch Fresh Article Detail on Navigation
  useEffect(() => {
    if (currentView.type === 'article-detail' && currentView.articleId) {
      const targetIdOrSlug = currentView.articleId;
      async function fetchAndIncrementArticleView() {
        try {
          const updatedArticle = await apiService.getArticleBySlugOrId(targetIdOrSlug);
          if (updatedArticle) {
            setArticles((prevArts) => {
              const exists = prevArts.some(a => a.slug === updatedArticle.slug || String(a.id) === String(updatedArticle.id));
              if (exists) {
                return prevArts.map(a => 
                  (a.slug === updatedArticle.slug || String(a.id) === String(updatedArticle.id))
                    ? updatedArticle
                    : a
                );
              } else {
                return [updatedArticle, ...prevArts];
              }
            });
          }
        } catch (err) {
          console.warn('Error incrementing article view, applying local increment:', err);
          setArticles((prevArts) =>
            prevArts.map((a) => {
              if (a.slug === targetIdOrSlug || String(a.id) === String(targetIdOrSlug)) {
                return { ...a, views: (a.views || 0) + 1 };
              }
              return a;
            })
          );
        }
      }
      fetchAndIncrementArticleView();
    }
  }, [currentView.type, currentView.type === 'article-detail' ? currentView.articleId : null]);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);

  // Selected Explore Topic for Modal
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Audio Listener Setup
  useEffect(() => {
    audioPlayer.setListener((playing, trackName, progress) => {
      setIsPlayingAudio(playing);
      setCurrentAudioTrack(trackName);
      setAudioProgress(progress);
    });
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Auth Guard & URL Synchronization Navigation Handler
  const handleNavigate = (view: ViewState, pushHistory = true) => {
    if (view.type === 'admin' && !currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentView(view);
    if (pushHistory) {
      const newPath = getPathFromView(view);
      if (window.location.pathname + window.location.search !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    setCurrentUser(null);
    handleNavigate({ type: 'home' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    const targetView: ViewState = currentView.type === 'admin' ? currentView : { type: 'admin', section: 'dashboard' };
    handleNavigate(targetView);
  };

  const activeTopic = exploreTopics.find(t => t.id === selectedTopicId) || null;

  return (
    <div id="mach-quan-ho-app" className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D241E]">
      
      {/* 1. If not in Admin Portal, render Client Header & Navbar */}
      {currentView.type !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          siteConfig={siteConfig}
          isPlayingAudio={isPlayingAudio}
          currentAudioTrack={currentAudioTrack}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 2. Main View Router */}
      <div className="flex-1">
        {currentView.type === 'home' && (
          <HomePage
            articles={articles}
            researchEntries={researchEntries}
            exploreTopics={exploreTopics}
            siteConfig={siteConfig}
            onNavigate={handleNavigate}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'news' && (
          <NewsListPage
            articles={articles}
            initialCategory={currentView.category}
            initialSearchQuery={currentView.searchQuery}
            onNavigate={handleNavigate}
          />
        )}

        {currentView.type === 'article-detail' && (
          (() => {
            const currentArticle = articles.find(a => a.slug === currentView.articleId || String(a.id) === String(currentView.articleId)) || articles[0];
            const related = articles.filter(a => (a.slug !== currentArticle?.slug && String(a.id) !== String(currentArticle?.id)) && a.category === currentArticle?.category);
            return (
              <ArticleDetailPage
                article={currentArticle}
                relatedArticles={related}
                onNavigate={handleNavigate}
                isPlayingAudio={isPlayingAudio}
              />
            );
          })()
        )}

        {currentView.type === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'research-diary' && (
          <ResearchDiaryPage
            entries={researchEntries}
            selectedId={currentView.selectedId}
            onNavigate={handleNavigate}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'admin' && currentUser && (
          <AdminPortal
            section={currentView.section}
            articles={articles}
            users={users}
            categories={categories}
            researchEntries={researchEntries}
            exploreTopics={exploreTopics}
            siteConfig={siteConfig}
            currentUser={currentUser}
            onUpdateArticles={setArticles}
            onUpdateUsers={setUsers}
            onUpdateCategories={setCategories}
            onUpdateResearchEntries={setResearchEntries}
            onUpdateExploreTopics={setExploreTopics}
            onUpdateSiteConfig={setSiteConfig}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* 3. Client Footer (Hidden in Admin Portal) */}
      {currentView.type !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          siteConfig={siteConfig}
        />
      )}

      {/* 4. Global Floating Audio Bar */}
      <GlobalAudioPlayer
        isPlaying={isPlayingAudio}
        trackName={currentAudioTrack}
        progress={audioProgress}
      />

      {/* 5. Explore Topic Modal */}
      {selectedTopicId && (
        <ExploreTopicModal
          topic={activeTopic}
          onClose={() => setSelectedTopicId(null)}
          isPlayingAudio={isPlayingAudio}
        />
      )}

      {/* 6. Admin Login Modal Auth Guard */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          // If user closes modal without logging in while on admin route, redirect to /home
          if (!currentUser && currentView.type === 'admin') {
            handleNavigate({ type: 'home' });
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

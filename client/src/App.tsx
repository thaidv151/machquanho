import React, { useState, useEffect } from 'react';
import { ViewState, Article, ResearchEntry, AdminUser, CategoryInfo, SiteConfig, ExploreTopic } from './types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_RESEARCH_ENTRIES, 
  ARTISANS_DATA, 
  EXPLORE_TOPICS, 
  CATEGORIES_LIST, 
  INITIAL_ADMIN_USERS, 
  DEFAULT_SITE_CONFIG 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { ExploreTopicModal } from './components/ExploreTopicModal';
import { HomePage } from './views/HomePage';
import { NewsListPage } from './views/NewsListPage';
import { ArticleDetailPage } from './views/ArticleDetailPage';
import { AboutPage } from './views/AboutPage';
import { ResearchDiaryPage } from './views/ResearchDiaryPage';
import { AdminPortal } from './views/AdminPortal';
import { audioPlayer } from './utils/audioSynth';

export default function App() {
  // Global View Navigation State
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });

  // Main Persistent App Data
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('mqh_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [researchEntries, setResearchEntries] = useState<ResearchEntry[]>(() => {
    const saved = localStorage.getItem('mqh_research');
    return saved ? JSON.parse(saved) : INITIAL_RESEARCH_ENTRIES;
  });

  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('mqh_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem('mqh_categories');
    return saved ? JSON.parse(saved) : CATEGORIES_LIST;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('mqh_siteconfig');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  });

  const [exploreTopics] = useState<ExploreTopic[]>(EXPLORE_TOPICS);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);

  // Selected Explore Topic for Modal
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mqh_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('mqh_research', JSON.stringify(researchEntries));
  }, [researchEntries]);

  useEffect(() => {
    localStorage.setItem('mqh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mqh_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mqh_siteconfig', JSON.stringify(siteConfig));
  }, [siteConfig]);

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

  const activeTopic = exploreTopics.find(t => t.id === selectedTopicId) || null;

  return (
    <div id="mach-quan-ho-app" className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D241E]">
      
      {/* 1. If not in Admin Portal, render Client Header & Navbar */}
      {currentView.type !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
          siteConfig={siteConfig}
          isPlayingAudio={isPlayingAudio}
          currentAudioTrack={currentAudioTrack}
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
            onNavigate={setCurrentView}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'news' && (
          <NewsListPage
            articles={articles}
            initialCategory={currentView.category}
            initialSearchQuery={currentView.searchQuery}
            onNavigate={setCurrentView}
          />
        )}

        {currentView.type === 'article-detail' && (
          (() => {
            const currentArticle = articles.find(a => a.id === currentView.articleId) || articles[0];
            const related = articles.filter(a => a.id !== currentArticle.id && a.category === currentArticle.category);
            return (
              <ArticleDetailPage
                article={currentArticle}
                relatedArticles={related}
                onNavigate={setCurrentView}
                isPlayingAudio={isPlayingAudio}
              />
            );
          })()
        )}

        {currentView.type === 'about' && (
          <AboutPage
            onNavigate={setCurrentView}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'research-diary' && (
          <ResearchDiaryPage
            entries={researchEntries}
            selectedId={currentView.selectedId}
            onNavigate={setCurrentView}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {currentView.type === 'admin' && (
          <AdminPortal
            section={currentView.section}
            articles={articles}
            users={users}
            categories={categories}
            siteConfig={siteConfig}
            onUpdateArticles={setArticles}
            onUpdateUsers={setUsers}
            onUpdateCategories={setCategories}
            onUpdateSiteConfig={setSiteConfig}
            onNavigate={setCurrentView}
          />
        )}
      </div>

      {/* 3. Client Footer (Hidden in Admin Portal) */}
      {currentView.type !== 'admin' && (
        <Footer
          onNavigate={setCurrentView}
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

    </div>
  );
}

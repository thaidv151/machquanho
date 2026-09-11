import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Volume2, ArrowRight, Loader2, Video, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';
import { MediaCategory, MediaPost } from '../types';
import { apiService } from '../services/apiService';
import { audioPlayer } from '../utils/audioSynth';

interface NgheQuanHoSectionProps {
  onNavigateAll?: () => void;
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
  }
  return null;
}

export const NgheQuanHoSection: React.FC<NgheQuanHoSectionProps> = ({ onNavigateAll }) => {
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [featuredToday, setFeaturedToday] = useState<MediaPost | null>(null);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [playingPostId, setPlayingPostId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedVideoModal, setSelectedVideoModal] = useState<MediaPost | null>(null);

  // 1. Fetch Categories & Featured Today
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const cats = await apiService.getMediaCategories();
        if (isMounted && cats.length > 0) {
          setCategories(cats);
          setSelectedCategorySlug(cats[0].slug);
        }

        const featured = await apiService.getFeaturedTodayMedia();
        if (isMounted && featured) {
          setFeaturedToday(featured);
        }
      } catch (err) {
        console.error('Error loading media initial data:', err);
      }
    }

    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Posts when Category Slug Changes
  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      if (!selectedCategorySlug) return;
      setLoadingPosts(true);
      setShowAll(false);
      try {
        const items = await apiService.getMediaPosts(selectedCategorySlug);
        if (isMounted) {
          setPosts(items);
        }
      } catch (err) {
        console.error('Error loading media posts:', err);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    }

    loadPosts();
    return () => { isMounted = false; };
  }, [selectedCategorySlug]);

  // 3. Play Media Handler
  const handlePlayMedia = (post: MediaPost) => {
    const isVideo = post.mediaType === 'video' || (post.mediaUrl && getYouTubeEmbedUrl(post.mediaUrl));

    if (isVideo) {
      // Open Video Modal if it's a Video post or YouTube link
      audioPlayer.stop();
      setPlayingPostId(null);
      setSelectedVideoModal(post);
      apiService.incrementMediaPlay(post.id);
      return;
    }

    if (playingPostId === post.id) {
      audioPlayer.stop();
      setPlayingPostId(null);
      return;
    }

    setPlayingPostId(post.id);
    apiService.incrementMediaPlay(post.id);

    // Play REAL uploaded audio file URL or synth fallback
    const trackTitle = post.subTitle ? `${post.title} (${post.subTitle})` : post.title;
    audioPlayer.playTrack(trackTitle, post.mediaUrl);
  };

  const visiblePosts = showAll ? posts : posts.slice(0, 4);

  return (
    <section id="nghe-quan-ho-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FBF8F2] border-t border-b border-[#EFE8DC] font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="font-serif-culture text-3xl sm:text-4xl font-bold tracking-wide text-[#3A1E16] uppercase">
            NGHE QUAN HỌ
          </h2>
          <div className="w-16 h-0.5 bg-[#6B3C18] mx-auto rounded-full opacity-60" />
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex p-1.5 rounded-xl bg-white border border-[#EFE8DC] shadow-2xs space-x-1.5 sm:space-x-2">
              {categories.map((cat) => {
                const isActive = selectedCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#6B3C18] text-white shadow-xs'
                        : 'bg-transparent text-[#4A3B30] hover:bg-[#F5EFE6] hover:text-[#6B3C18]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main 2-Column Grid with Equal Height Symmetrical Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column: Playlist (~58% - 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EFE8DC] p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {loadingPosts ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 my-auto">
                  <Loader2 className="w-8 h-8 text-[#6B3C18] animate-spin" />
                  <p className="text-[#736B63] text-sm font-medium">Đang nạp danh sách bài hát...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-[#736B63] my-auto">
                  <Music className="w-10 h-10 mx-auto mb-2 text-[#C8B097]" />
                  <p className="text-sm font-medium">Chưa có bài hát/âm thanh nào trong danh mục này.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5EFE6]">
                  {visiblePosts.map((post) => {
                    const isPlaying = playingPostId === post.id;
                    const isVideo = post.mediaType === 'video' || (post.mediaUrl && getYouTubeEmbedUrl(post.mediaUrl));
                    return (
                      <div
                        key={post.id}
                        className="py-3.5 sm:py-4 flex items-center justify-between gap-4 group hover:bg-[#FDFBF7] px-2 sm:px-3 rounded-xl transition-colors cursor-pointer"
                        onClick={() => handlePlayMedia(post)}
                      >
                        {/* Play Button & Info */}
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayMedia(post);
                            }}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 cursor-pointer shadow-xs ${
                              isPlaying
                                ? 'bg-[#6B3C18] text-white ring-4 ring-[#6B3C18]/20 scale-105'
                                : 'bg-[#8C2320] text-white hover:bg-[#731D1B] hover:scale-105'
                            }`}
                            title={isPlaying ? 'Dừng phát' : isVideo ? 'Xem video' : 'Nghe ngay'}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white fill-white" />
                            ) : isVideo ? (
                              <Video className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm sm:text-base text-[#2D241E] group-hover:text-[#6B3C18] transition-colors truncate">
                              {post.title}
                            </h4>
                            {post.subTitle && (
                              <p className="text-xs text-[#736B63] truncate mt-0.5">
                                ({post.subTitle})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Duration & Playing indicator */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {isPlaying && (
                            <span className="flex items-center space-x-1 text-xs text-[#6B3C18] font-bold animate-pulse">
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Đang phát</span>
                            </span>
                          )}
                          <span className="text-xs sm:text-sm font-semibold text-[#8C6B50]">
                            {post.duration || '04:00'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Xem tất cả / Expand Action Button */}
            <div className="pt-4 border-t border-[#F5EFE6] text-center mt-auto">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateAll) {
                    onNavigateAll();
                  } else {
                    setShowAll(prev => !prev);
                  }
                }}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#6B3C18] hover:text-[#4A2910] transition-colors cursor-pointer group px-4 py-2 rounded-full hover:bg-[#F5EFE6]"
              >
                <span>
                  {showAll
                    ? 'Thu gọn danh sách bài hát'
                    : posts.length > 4
                      ? `Xem tất cả (${posts.length} bài)`
                      : 'Xem tất cả bài hát'}
                </span>
                {showAll ? (
                  <ChevronUp className="w-4 h-4 text-[#6B3C18]" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B3C18] group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Box "NỔI BẬT HÔM NAY" (~42% - 5 Cols) Symmetrical Equal Height Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EFE8DC] p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              {/* Card Header Title */}
              <h3 className="font-serif-culture font-bold text-xs sm:text-sm tracking-widest text-[#736B63] text-center uppercase mb-2">
                NỔI BẬT HÔM NAY
              </h3>

              {/* Featured Thumbnail */}
              {featuredToday ? (
                <div 
                  onClick={() => handlePlayMedia(featuredToday)}
                  className="aspect-[16/10] rounded-xl overflow-hidden relative group cursor-pointer border border-[#EFE8DC] shadow-2xs"
                >
                  <img
                    src={featuredToday.thumbnailUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'}
                    alt={featuredToday.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#6B3C18] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-xl bg-[#F5EFE6] flex items-center justify-center text-[#8C6B50]">
                  <Video className="w-8 h-8" />
                </div>
              )}

              {/* Title & Excerpt Description */}
              {featuredToday && (
                <h4 className="font-bold text-base text-[#2D241E] text-center">
                  {featuredToday.title}
                </h4>
              )}
              <p className="text-xs sm:text-sm text-[#4A3B30] leading-relaxed text-center font-sans">
                {featuredToday?.description || 'Điệu ca da diết thể hiện nỗi niềm thương nhớ đồng điệu giữa hai bọn Quan họ kết nghĩa.'}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-transparent text-center mt-auto">
              <button
                type="button"
                onClick={() => featuredToday && handlePlayMedia(featuredToday)}
                className="px-8 py-2.5 rounded-full bg-[#6B3C18] hover:bg-[#522D12] text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center space-x-2"
              >
                <span>{featuredToday?.mediaType === 'video' ? 'Xem video' : 'Nghe ngay'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* --- VIDEO POPUP MODAL --- */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1412] text-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-[#382B26]">
            <div className="p-4 bg-[#2A1E1A] border-b border-[#382B26] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-[#E5B567]" />
                <h3 className="font-bold text-sm text-white truncate max-w-lg">
                  {selectedVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideoModal(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-[#382B26]">
                {getYouTubeEmbedUrl(selectedVideoModal.mediaUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideoModal.mediaUrl)!}
                    title={selectedVideoModal.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideoModal.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {selectedVideoModal.description && (
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedVideoModal.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NgheQuanHoSection;

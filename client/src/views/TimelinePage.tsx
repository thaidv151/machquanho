import React, { useState, useEffect } from 'react';
import { Landmark, Scroll, Award, Sparkles, BookOpen, Globe, Medal, Calendar, ChevronRight, Clock, ShieldCheck, FileText } from 'lucide-react';
import { TimelineEntry } from '../types';
import apiService from '../services/apiService';

interface TimelinePageProps {
  onNavigate?: (view: any) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'heritage' | 'policy'>('heritage');
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTimelineData();
  }, [activeTab]);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTimelineEntries(activeTab);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'scroll':
        return <Scroll className="w-6 h-6 text-emerald-800" />;
      case 'award':
        return <Award className="w-6 h-6 text-amber-700" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-amber-600" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-emerald-800" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-800" />;
      case 'medal':
        return <Medal className="w-6 h-6 text-yellow-700" />;
      case 'policy':
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-red-800" />;
      case 'document':
        return <FileText className="w-6 h-6 text-indigo-800" />;
      default:
        return <Landmark className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Banner / Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-emerald-100/80 text-emerald-900 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 border border-emerald-200">
          <Clock className="w-4 h-4 text-emerald-800" />
          <span>Hành Trình Di Sản Quan Họ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2D241E] mb-4 tracking-tight">
          DÒNG CHẢY QUAN HỌ
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {activeTab === 'heritage'
            ? 'Hành trình hình thành, nuôi dưỡng và bảo tồn di sản văn hóa phi vật thể đại diện của nhân loại qua các thời kỳ lịch sử.'
            : 'Những mốc chính sách, nghị quyết và chủ trương trọng tâm nhằm bảo tồn, phát huy giá trị Dân ca Quan họ Bắc Ninh.'}
        </p>

        {/* Tab Selection Switcher */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-stone-200/80 backdrop-blur border border-stone-300 shadow-inner">
          <button
            onClick={() => setActiveTab('heritage')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === 'heritage'
                ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-md'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
              }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Dòng chảy di sản</span>
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === 'policy'
                ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-md'
                : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Dòng chảy chính sách</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream Content */}
      <div className="max-w-5xl mx-auto relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-600 font-medium">Đang tải dòng chảy lịch sử...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-stone-200 shadow-sm">
            <Clock className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-600 text-lg font-medium">Chưa có mốc sự kiện nào trong thư mục này.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Center / Left Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-700 via-amber-600 to-emerald-800 rounded-full opacity-30 transform -translate-x-1/2" />

            <div className="space-y-12">
              {entries.map((item, index) => {
                const isEven = index % 2 === 0;
                const numberBadge = String(index + 1);

                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''
                      } group`}
                  >
                    {/* Numbered Center Badge / Node */}
                    <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 text-white font-serif font-bold text-lg border-4 border-[#FAF8F5] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {numberBadge}
                      </div>
                    </div>

                    {/* Content Card (Left or Right) */}
                    <div className="w-full md:w-[calc(50%-2.5rem)] pl-16 md:pl-0">
                      <div className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group-hover:border-emerald-300">
                        {/* Cultural Icon Watermark */}
                        <div className="absolute top-4 right-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 opacity-90">
                          {getIconComponent(item.icon)}
                        </div>

                        {/* Era Time Period Title */}
                        <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs sm:text-sm tracking-wide mb-3 border border-emerald-200">
                          {item.period}
                        </div>

                        {/* Event Title */}
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D241E] mb-3 leading-snug">
                          {item.title}
                        </h3>

                        {/* Event Description */}
                        <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4">
                          {item.description}
                        </p>

                        {/* Image Preview (if provided) */}
                        {item.image && (
                          <div className="mt-4 rounded-2xl overflow-hidden shadow-sm border border-stone-200 max-h-64 relative group/img">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Empty Space for 2-column layout balancing */}
                    <div className="hidden md:block w-[calc(50%-2.5rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default TimelinePage;

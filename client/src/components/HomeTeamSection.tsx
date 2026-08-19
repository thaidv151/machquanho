import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { apiService } from '../services/apiService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeTeamSectionProps {
  initialMembers?: TeamMember[];
}

export const HomeTeamSection: React.FC<HomeTeamSectionProps> = ({ initialMembers }) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers || []);
  const [loading, setLoading] = useState(!initialMembers || initialMembers.length === 0);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      try {
        const data = await apiService.getTeamMembers();
        if (isMounted && data && data.length > 0) {
          setMembers(data);
        }
      } catch (err) {
        console.error('Failed to load team members for Homepage:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!initialMembers || initialMembers.length === 0) {
      loadMembers();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialMembers]);

  const displayMembers: TeamMember[] = members;

  if (!loading && displayMembers.length === 0) {
    return null;
  }

  const totalMembers = displayMembers.length;
  const visibleCount = Math.min(5, totalMembers);

  // Shift 1 item at a time circularly
  const visibleMembers: TeamMember[] = [];
  if (totalMembers > 0) {
    for (let i = 0; i < visibleCount; i++) {
      const idx = (startIndex + i) % totalMembers;
      visibleMembers.push(displayMembers[idx]);
    }
  }

  const handleNext = () => {
    if (totalMembers === 0) return;
    setStartIndex((prev) => (prev + 1) % totalMembers);
  };

  const handlePrev = () => {
    if (totalMembers === 0) return;
    setStartIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
  };

  const showNavigation = totalMembers > 5;

  return (
    <section className="py-8 md:py-10 bg-[#FAF6F0] border-t border-[#E3D5C3] overflow-hidden">
      <div className="max-w-[1480px]  mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header Title */}
        <div className="mb-10 text-left">
          <h2 className="font-serif-culture text-3xl sm:text-4xl md:text-4xl font-bold text-[#1C2A20] tracking-tight">
            Về nhóm nghiên cứu
          </h2>
          <div className="w-16 h-[3px] bg-[#007f32] mt-3 rounded-full" />
        </div>

        {/* Carousel / Grid Wrapper */}
        <div className="relative">
          {showNavigation && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#EAE3D9] flex items-center justify-center text-[#2D241E] hover:bg-[#007f32] hover:text-white transition-all cursor-pointer"
                title="Lùi 1 thành viên"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#EAE3D9] flex items-center justify-center text-[#2D241E] hover:bg-[#007f32] hover:text-white transition-all cursor-pointer"
                title="Tiến 1 thành viên"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Member Circular Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-start justify-items-center transition-all duration-300">
            {visibleMembers.map((member, i) => (
              <div
                key={`${member.id}-${i}`}
                className="flex flex-col items-center text-center group cursor-pointer w-full transition-all duration-300 transform"
              >
                {/* Circular Avatar Container */}
                <div className="relative mb-4">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-stone-200 group-hover:scale-105 group-hover:border-[#007f32] transition-all duration-300">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Role Label */}
                <p className="font-sans text-sm sm:text-base font-semibold text-[#2D241E] group-hover:text-[#007f32] transition-colors leading-tight">
                  {member.role || 'Thành viên'}
                </p>

                {/* Name */}
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                  {member.name}
                </p>

                {/* Bio optional description */}
                {member.bio && (
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 px-2 max-w-[180px]">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Dots Indicator for Step Shift */}
          {showNavigation && (
            <div className="flex items-center justify-center space-x-2.5 mt-10">
              {displayMembers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStartIndex(idx)}
                  className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${startIndex === idx
                    ? 'w-8 bg-[#007f32]'
                    : 'w-3 bg-[#D6CBBC] hover:bg-[#A39684]'
                    }`}
                  aria-label={`Vị trí ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { ViewState, SiteConfig } from '../types';
import { Compass, Users, BookOpen, Megaphone, Sparkles, Flower2 } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
  isPlayingAudio?: boolean;
  siteConfig?: SiteConfig;
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  const bgImage = '/images/quan_ho_thuyen_rong.jpg';

  return (
    <div id="about-us-page" className="min-h-screen bg-[#FAF8F5]">

      {/* 1. Hero Banner */}
      <div className="bg-[#1F0C0A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={getOptimizedImageUrl(bgImage, 1400, 80)}
            alt="Về dự án Mạch Quan Họ"
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F0C0A] via-[#1F0C0A]/75 to-black/60" />
        </div>

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8C2320]/80 border border-[#E5B567]/50 text-[#F5E6D3] text-xs uppercase font-bold tracking-widest mb-4 shadow-sm">
            <span> KẾT NỐI QUÁ KHỨ – NỐI MẠCH TƯƠNG LAI</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif-culture text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Về dự án Mạch Quan Họ
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#E6DAD0] max-w-3xl mx-auto mt-4 leading-relaxed font-sans font-normal opacity-90">
            Một không gian khám phá, kết nối và lan tỏa thông tin về Quan họ Bắc Ninh – di sản của cộng đồng, niềm tự hào của di sản.
          </p>
        </div>
      </div>

      {/* 2. Main Section: "Về dự án Mạch Quan Họ" + 4 Feature Cards */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif-culture text-2xl sm:text-3xl lg:text-4xl font-bold text-[#007f32] leading-tight">
              Về dự án Mạch Quan Họ
            </h2>

            {/* Lotus divider */}
            <div className="flex items-center space-x-3 my-3 w-full">
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
              <Sparkles className="w-3.5 h-3.5 text-[#8C2320] shrink-0 opacity-80" />
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
            </div>

            <p className="text-base sm:text-lg text-[#3A2D25] font-medium leading-relaxed">
              Mạch Quan Họ là không gian số dành cho tất cả những ai yêu mến Quan họ Bắc Ninh. Chúng tôi kết nối quá khứ với hiện tại, gắn kết cộng đồng và lan tỏa giá trị di sản bằng tri thức, công nghệ và những câu chuyện truyền cảm hứng.
            </p>
          </div>

          {/* Right 4 Feature Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">

            {/* Card 1: Khám phá */}
            <div className="bg-[#FAF7F0] p-6 rounded-lg border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#EAE2D0]/70 text-[#006633] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Compass className="w-9 h-9 sm:w-9 sm:h-9 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                Khám phá
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-medium">
                Khám phá di sản Quan họ qua tư liệu, câu chuyện và không gian văn hóa.
              </p>
            </div>

            {/* Card 2: Kết nối */}
            <div className="bg-[#FAF7F0] p-6 rounded-lg border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#EAE2D0]/70 text-[#8C2320] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Users className="w-9 h-9 sm:w-9 sm:h-9 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                Kết nối
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-medium">
                Kết nối cộng đồng yêu Quan họ, nghệ nhân, câu lạc bộ và những người thực hành.
              </p>
            </div>

            {/* Card 3: Nghiên cứu */}
            <div className="bg-[#FAF7F0] p-6 rounded-lg border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#EAE2D0]/70 text-[#B45309] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <BookOpen className="w-9 h-9 sm:w-9 sm:h-9 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                Nghiên cứu
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-medium">
                Nghiên cứu, lưu trữ và chia sẻ tri thức khoa học về Quan họ Bắc Ninh.
              </p>
            </div>

            {/* Card 4: Lan tỏa */}
            <div className="bg-[#FAF7F0] p-6 rounded-lg border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#EAE2D0]/70 text-[#006633] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Megaphone className="w-9 h-9 sm:w-9 sm:h-9 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                Lan tỏa
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-medium">
                Lan tỏa giá trị Quan họ tới thế hệ trẻ và cộng đồng trong nước, quốc tế.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Section 2: "Những người đi tìm mạch" */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Team Image */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E8DFC8]">
              <img
                src="/images/about_team_photo.jpg"
                alt="Những người đi tìm mạch"
                className="w-full h-[320px] sm:h-[380px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Text Block */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif-culture text-2xl sm:text-3xl lg:text-4xl font-bold text-[#007f32] leading-tight">
              Những người đi tìm mạch
            </h2>

            {/* Lotus divider */}
            <div className="flex items-center space-x-3 my-3 w-full">
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
              <Sparkles className="w-3.5 h-3.5 text-[#8C2320] shrink-0 opacity-80" />
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
            </div>

            <p className="text-base sm:text-lg text-[#3A2D25] font-medium leading-relaxed">
              Chúng tôi là một nhóm bạn trẻ – những người nghiên cứu, sinh viên và người yêu di sản, cùng chung niềm đam mê với Quan họ Bắc Ninh. Chúng tôi mong muốn học hỏi, ghi lại, chia sẻ và lan tỏa những giá trị tốt đẹp của di sản – để mạch nguồn Quan họ tiếp tục chảy trong đời sống hôm nay và mai sau.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Banner Ribbon above Footer */}
      <div className="bg-[#8C2320] text-[#F9E8D0] py-4 px-4 text-center font-serif-culture font-bold text-base sm:text-lg tracking-wider border-t border-b border-[#E5B567]/30 shadow-inner">
        Giữ mạch di sản – Nối mạch tương lai
      </div>

    </div>
  );
};

import React from 'react';
import { ViewState, SiteConfig } from '../types';
import { Compass, Users, BookOpen, Megaphone, Sparkles, Image as ImageIcon } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
  isPlayingAudio?: boolean;
  siteConfig?: SiteConfig;
}

export const AboutPage: React.FC<AboutPageProps> = ({ siteConfig }) => {
  const aboutBanner = siteConfig?.banner?.pageBanners?.about;

  const bgImage = aboutBanner?.bgImage || '/images/quan_ho_thuyen_rong.jpg';
  const tagline = aboutBanner?.tagline || 'VỀ CHÚNG TÔI';
  const title = aboutBanner?.title || 'Về dự án Mạch Quan họ';
  const subtitle = aboutBanner?.description || 'Theo Mạch Quan họ, tìm về cội nguồn, lắng nghe sức sống hôm nay, mở ra những kết nối mới và hướng tới tương lai của Dân ca Quan họ Bắc Ninh.';

  return (
    <div id="about-us-page" className="min-h-screen bg-[#FAF8F5]">

      {/* 1. Hero Banner */}
      <div className="bg-[#1F0C0A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={getOptimizedImageUrl(bgImage, 1400, 80)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F0C0A] via-[#1F0C0A]/75 to-black/60" />
        </div>

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8C2320]/80 border border-[#E5B567]/50 text-[#F5E6D3] text-xs uppercase font-bold tracking-widest mb-4 shadow-sm">
            <span>{tagline}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif-culture text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#E6DAD0] max-w-3xl mx-auto mt-4 leading-relaxed font-sans font-normal opacity-90">
            {subtitle}
          </p>
        </div>
      </div>

      {/* 2. Main Section: "Về dự án Mạch Quan họ" + 4 Feature Cards */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[4.5fr_7.5fr] gap-8 lg:gap-12 items-start">

          {/* Left Text Block */}
          <div className="space-y-4">
            <h2 className="font-serif-culture text-2xl sm:text-3xl lg:text-4xl font-bold text-[#114D3A] leading-tight">
              Về dự án Mạch Quan họ
            </h2>

            {/* Lotus divider */}
            <div className="flex items-center space-x-3 my-3 w-full">
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
              <Sparkles className="w-3.5 h-3.5 text-[#8C2320] shrink-0 opacity-80" />
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
            </div>

            <p className="text-sm sm:text-base text-[#3A2D25] font-normal leading-relaxed text-justify">
              Mạch Quan họ là không gian truyền thông số được hình thành trong quá trình nghiên cứu đề tài “Thực hiện chính sách bảo tồn và phát huy giá trị di sản Dân ca Quan họ phục vụ phát triển công nghiệp văn hóa trên địa bàn thành phố Bắc Ninh”. Website triển khai nội dung theo năm “Mạch”: Mạch nguồn của di sản, Mạch sống trong cộng đồng, Mạch nối với đời sống hiện đại, Mạch mới của sáng tạo và Mạch chính sách trong hành trình gìn giữ, phát huy Quan họ. Qua đó, Mạch Quan họ mong muốn đưa những giá trị của di sản đến gần hơn với công chúng theo cách trực quan, gần gũi và có chiều sâu.
            </p>
          </div>

          {/* Right 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">

            {/* Card 1: Khám phá */}
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 h-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EAE2D0]/70 text-[#006633] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Compass className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
                Khám phá
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-normal">
                Khám phá Quan họ qua những câu chuyện, con người, điểm đến và không gian văn hóa Kinh Bắc.
              </p>
            </div>

            {/* Card 2: Kết nối */}
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 h-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EAE2D0]/70 text-[#8C2320] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Users className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
                Kết nối
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-normal">
                Kết nối Quan họ với công chúng, du khách và đời sống hiện đại thông qua bản đồ số, hành trình trải nghiệm và các nội dung truyền thông.
              </p>
            </div>

            {/* Card 3: Nghiên cứu */}
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 h-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EAE2D0]/70 text-[#B45309] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <BookOpen className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
                Nghiên cứu
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-normal">
                Tìm hiểu Quan họ một cách hệ thống, từ đó mở rộng những góc nhìn về di sản trong thời đại mới.
              </p>
            </div>

            {/* Card 4: Lan tỏa */}
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E8DFC8] flex flex-col items-center text-center space-y-4 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 h-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#EAE2D0]/70 text-[#006633] flex items-center justify-center border border-[#D9CEBA] shrink-0">
                <Megaphone className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
                Lan tỏa
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3A2F] leading-relaxed font-normal">
                Lan tỏa giá trị Quan họ bằng nội dung số, hình ảnh, âm thanh và những trải nghiệm giúp di sản đến gần hơn với công chúng.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Section 2: "Những người đi tìm “Mạch”" */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Team Image Placeholder */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-[#E8DFC8] bg-white h-[320px] sm:h-[380px] flex flex-col items-center justify-center text-[#A09385] space-y-3 p-6 group hover:border-[#114D3A]/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center text-[#8C2320]">
                <ImageIcon className="w-8 h-8 opacity-75" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-[#5A4A3E]">Hình ảnh nhóm</p>
                <p className="text-xs text-[#8C7A6B] font-normal">Sẽ được cập nhật sau</p>
              </div>
            </div>
          </div>

          {/* Right Text Block */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif-culture text-2xl sm:text-3xl lg:text-4xl font-bold text-[#114D3A] leading-tight">
              Những người đi tìm “Mạch”
            </h2>

            {/* Lotus divider */}
            <div className="flex items-center space-x-3 my-3 w-full">
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
              <Sparkles className="w-3.5 h-3.5 text-[#8C2320] shrink-0 opacity-80" />
              <div className="flex-1 h-[1px] bg-[#8C2320]/30" />
            </div>

            <p className="text-sm sm:text-base text-[#3A2D25] font-normal leading-relaxed text-justify">
              Chúng tôi là một nhóm sinh viên cùng chung sự quan tâm đến Quan họ và những giá trị văn hóa đang được gìn giữ, trao truyền trong đời sống hôm nay. Trên hành trình “đi tìm Mạch”, chúng tôi tiếp cận di sản từ thực tiễn cộng đồng, qua con người, không gian văn hóa, hoạt động bảo tồn và những cách Quan họ đang được phát huy trong bối cảnh mới. Những quan sát, trải nghiệm và tư liệu thu nhận được không chỉ giúp chúng tôi hiểu sâu hơn về sức sống của di sản mà còn góp phần làm rõ các vấn đề đặt ra trong quá trình nghiên cứu và hoàn thiện đề tài.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Banner Ribbon above Footer */}
      <div className="bg-[#8C2320] text-[#F9E8D0] py-2.5 sm:py-3 px-4 text-center font-serif-culture italic text-sm sm:text-base tracking-wide border-t border-b border-[#E5B567]/30 shadow-inner">
        Để Mạch Quan họ tiếp tục chảy...
      </div>

    </div>
  );
};


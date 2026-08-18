import React from 'react';
import { ViewState } from '../types';
import { Sparkles, Heart, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div id="about-us-page" className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* 1. Hero Banner */}
      <div className="bg-[#2D1614] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/images/quan_ho_thuyen_rong.jpg"
            alt="Hát Quan họ trên thuyền rồng"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1614] via-[#2D1614]/70 to-black/50" />
        </div>
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#8C2320]/80 border border-[#E5B567]/40 text-[#E5B567] text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Giữ mạch di sản – Khơi mạch tương lai</span>
          </div>
          <h1 className="font-serif-culture text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Về dự án Mạch Quan Họ
          </h1>
          <p className="text-sm sm:text-lg text-[#E0D5CE] max-w-3xl mx-auto mt-3 leading-relaxed font-serif-culture italic">
            "Quan họ là câu ca kết nối cội nguồn quá khứ, nhịp thở hiện tại và mạch nguồn tương lai của vùng đất di sản Kinh Bắc."
          </p>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* 2. Story: Khởi nguồn di sản */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#8C2320]/10 text-[#8C2320] text-xs font-bold uppercase tracking-wider">
              <span>Đề tài nghiên cứu khoa học & di sản</span>
            </div>
            <h2 className="font-serif-culture text-2xl sm:text-4xl font-bold text-[#2D241E] leading-snug">
              Khai thác & phát huy giá trị di sản Quan họ Bắc Ninh
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#5C4D44] leading-relaxed">
              <p>
                Dân ca Quan họ Bắc Ninh là hình thái sinh hoạt văn hóa dân gian độc đáo của người dân vùng châu thổ sông Cầu (Bắc Ninh & Bắc Giang). Với hệ thống làn điệu lề lối phong phú, lời ca tinh tế cùng triết lý ứng xử trọng tình trọng nghĩa, Quan họ đã được UNESCO chính thức ghi danh là <strong>Di sản Văn hóa Phi vật thể đại diện của Nhân loại</strong> vào năm 2009.
              </p>
              <p>
                Dự án <strong>Mạch Quan Họ</strong> được xây dựng trong khuôn khổ đề tài nghiên cứu <em>"Chính sách khai thác và phát huy giá trị di sản dân ca Quan họ phục vụ phát triển công nghiệp văn hóa trên địa bàn tỉnh Bắc Ninh"</em>. Website đóng vai trò như một kho tư liệu mở trực tuyến, lưu giữ canh hát cổ, bản đồ 49 làng Quan họ gốc, tư liệu điền dã và tôn vinh những giá trị nghệ thuật truyền thống của quê hương.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center shadow-xs">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">2009</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">UNESCO ghi danh</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center shadow-xs">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">49</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">Làng Quan họ gốc</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center shadow-xs">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">200+</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">Làn điệu cổ truyền</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-[#E8DFC8] bg-[#2D1614]">
              <img
                src="/images/quan_ho_thuyen_rong.jpg"
                alt="Sinh hoạt Hát Quan họ trên thuyền rồng tại sông Cầu - Bắc Ninh"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FAF8F5] p-4 rounded-2xl shadow-lg border border-[#E8DFC8] hidden sm:flex items-center space-x-3 max-w-sm">
              <div className="w-10 h-10 rounded-full bg-[#8C2320] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#E5B567]" />
              </div>
              <p className="text-xs text-[#2D241E] font-medium">
                Hình ảnh sinh hoạt hát Quan họ giao duyên trên thuyền rồng đậm đà bản sắc Kinh Bắc
              </p>
            </div>
          </div>
        </section>

        {/* 3. Sứ mệnh & Trụ cột */}
        <section className="bg-[#FAF6F0] p-8 sm:p-12 rounded-3xl border border-[#E8DFC8] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
              Ba trụ cột bảo tồn & lan tỏa
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6B60]">
              Hành động thực chất vì sự trường tồn của văn hóa Kinh Bắc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EDE5D8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#8C2320]/10 text-[#8C2320] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif-culture font-bold text-lg text-[#2D241E]">1. Số hóa điền dã</h3>
              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                Thu âm chất lượng cao các canh hát lề lối, phỏng vấn sâu các nghệ nhân cao niên và lập bản đồ các nhà chứa Quan họ cổ.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EDE5D8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#8C2320]/10 text-[#8C2320] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif-culture font-bold text-lg text-[#2D241E]">2. Tri ân Nghệ nhân</h3>
              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                Tôn vinh và hỗ trợ các bậc tiền bối, ghi nhận công lao truyền dạy không ngừng nghỉ của những "báu vật nhân văn sống".
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EDE5D8] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#8C2320]/10 text-[#8C2320] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-culture font-bold text-lg text-[#2D241E]">3. Kết nối thế hệ trẻ</h3>
              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                Ứng dụng công nghệ web hiện đại, âm thanh tương tác và trải nghiệm trực quan để đưa Quan họ đến gần hơn với giới trẻ toàn cầu.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

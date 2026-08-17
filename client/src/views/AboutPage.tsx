import React, { useState } from 'react';
import { Artisan, ViewState } from '../types';
import { ARTISANS_DATA } from '../data/mockData';
import { Sparkles, Award, Music, MapPin, Heart, BookOpen, Send, CheckCircle2, X, Play } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, isPlayingAudio }) => {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [submittedContribution, setSubmittedContribution] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    village: '',
    message: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedContribution(true);
  };

  return (
    <div id="about-us-page" className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* 1. Hero Banner */}
      <div className="bg-[#2D1614] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80"
            alt="Về Mạch Quan Họ"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#E5B567] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Giữ mạch di sản – Khơi mạch tương lai</span>
          </div>
          <h1 className="font-serif-culture text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Về chúng tôi
          </h1>
          <p className="text-sm sm:text-lg text-[#E0D5CE] max-w-3xl mx-auto mt-3 leading-relaxed font-serif-culture italic">
            "Quan họ là câu ca kết nối cội nguồn quá khứ, nhịp thở hiện tại và mạch nguồn tương lai xứ Kinh Bắc."
          </p>
        </div>
      </div>

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* 2. Story: Khởi nguồn di sản */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#8C2320]/10 text-[#8C2320] text-xs font-bold uppercase tracking-wider">
              <span>Khởi nguồn di sản</span>
            </div>
            <h2 className="font-serif-culture text-2xl sm:text-4xl font-bold text-[#2D241E] leading-snug">
              Mạch nguồn Quan họ ngàn năm lắng đọng
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#5C4D44] leading-relaxed">
              <p>
                Dân ca Quan họ Bắc Ninh là hình thái sinh hoạt văn hóa dân gian độc đáo của người dân châu thổ sông Cầu, nơi hội tụ đầy đủ tinh hoa thi ca, âm nhạc và triết lý ứng xử lịch thiệp, trọng tình trọng nghĩa.
              </p>
              <p>
                Dự án <strong>Mạch Quan Họ</strong> ra đời với tâm nguyện phụng sự cộng đồng, đóng vai trò như một kho tư liệu mở trực tuyến nhằm số hóa các canh hát cổ, lưu giữ những thước phim tư liệu điền dã tại 49 làng Quan họ cổ truyền và kể lại câu chuyện về những nghệ nhân đang ngày đêm gìn giữ báu vật phi vật thể này.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">2009</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">UNESCO ghi danh</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">49</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">Làng Quan họ gốc</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] text-center">
                <p className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#8C2320]">200+</p>
                <p className="text-[11px] text-[#8C6B50] font-medium mt-1">Làn điệu cổ truyền</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-[#E8DFC8] bg-[#2D1614]">
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80"
                alt="Không gian Quan họ Làng Diềm"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FAF8F5] p-4 rounded-2xl shadow-lg border border-[#E8DFC8] hidden sm:flex items-center space-x-3 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-[#8C2320] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#E5B567]" />
              </div>
              <p className="text-xs text-[#2D241E] font-medium">
                Đền Vua Bà (Thôn Viêm Xá) - Nơi thờ Đức Thủy Tổ Quan họ
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

        {/* 4. Những người giữ lửa (Artisans section) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#8C2320]/10 text-[#8C2320] text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Những người giữ lửa</span>
              </div>
              <h2 className="font-serif-culture text-2xl sm:text-4xl font-bold text-[#2D241E]">
                Nghệ nhân tiêu biểu
              </h2>
              <p className="text-sm text-[#7A6B60] mt-1">
                Các bậc tiền bối lưu giữ hồn cốt và ngọn lửa câu ca Quan họ xứ Bắc
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTISANS_DATA.map((artisan) => (
              <div
                key={artisan.id}
                id={`artisan-card-${artisan.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#8C2320] hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-[#2D1614]">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold bg-[#8C2320] text-white shadow-xs">
                      {artisan.honorific}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif-culture text-xl font-bold">
                        {artisan.name}
                      </h3>
                      <p className="text-xs text-[#E5B567] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{artisan.village}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-[#5C4D44] leading-relaxed line-clamp-3">
                      {artisan.bio}
                    </p>

                    <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EDE5D8] text-xs italic text-[#4A3B32]">
                      “{artisan.quote}”
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                    <button
                      onClick={() => audioPlayer.toggle(`Hát đối: ${artisan.songs[0]} - ${artisan.name}`)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-[#8C2320] hover:text-[#5E1412] cursor-pointer"
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>Nghe điệu hát cổ</span>
                    </button>

                    <button
                      onClick={() => setSelectedArtisan(artisan)}
                      className="px-3 py-1.5 rounded-full bg-[#F4EFE6] hover:bg-[#8C2320] hover:text-white text-xs font-semibold text-[#5C4D44] transition-colors cursor-pointer"
                    >
                      Xem hồ sơ &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Gửi tư liệu đóng góp */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFC8] shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
              Đóng góp tư liệu & Kết nối điền dã
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6B60]">
              Bạn có băng đĩa thu âm cổ, câu chuyện về nghệ nhân làng mình hoặc muốn mời nhóm nghiên cứu điền dã? Hãy gửi thông tin tới ban biên tập.
            </p>
          </div>

          {submittedContribution ? (
            <div className="p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-center space-y-2 max-w-lg mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <h4 className="font-bold text-green-900 text-base">Gửi thông tin thành công!</h4>
              <p className="text-xs text-green-700">
                Ban biên tập Mạch Quan Họ trân trọng cảm ơn tấm lòng đóng góp di sản của bạn. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
              </p>
              <button
                onClick={() => setSubmittedContribution(false)}
                className="mt-3 px-4 py-1.5 bg-green-700 text-white rounded-full text-xs font-semibold"
              >
                Gửi thêm thông tin khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Làng Quan họ / Địa danh</label>
                  <input
                    type="text"
                    placeholder="Làng Diềm, Làng Lim, v.v."
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung tư liệu đóng góp *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mô tả thông tin băng thu âm, bài hát cổ, lời truyền miệng hoặc kỷ vật bạn muốn chia sẻ..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
                />
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#8C2320] hover:bg-[#6E1B19] text-white rounded-full text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-2 mx-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi thông tin đóng góp di sản</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </div>

      {/* Artisan Detail Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp">
            <button
              onClick={() => setSelectedArtisan(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF8F5] hover:bg-[#EAE1D2] text-[#4A3B32] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
              <img
                src={selectedArtisan.avatar}
                alt={selectedArtisan.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-[#8C2320]"
              />
              <div className="text-center sm:text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#8C2320] text-white">
                  {selectedArtisan.honorific}
                </span>
                <h3 className="font-serif-culture text-2xl font-bold text-[#2D241E]">
                  {selectedArtisan.name}
                </h3>
                <p className="text-xs text-[#8C6B50]">Năm sinh: {selectedArtisan.birthYear} • {selectedArtisan.village}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#4A3B32] leading-relaxed">
              <h4 className="font-bold text-[#2D241E] text-xs uppercase tracking-wider text-[#8C2320]">Tiểu sử & Cống hiến</h4>
              <p>{selectedArtisan.bio}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#2D241E] text-xs uppercase tracking-wider text-[#8C2320]">Sở trường diễn xướng</h4>
              <div className="flex flex-wrap gap-2">
                {selectedArtisan.specialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E8DFC8] text-xs text-[#5C4D44]">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#2D241E] text-xs uppercase tracking-wider text-[#8C2320]">Các điệu hát tiêu biểu</h4>
              <div className="space-y-1.5">
                {selectedArtisan.songs.map((song, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EDE5D8] text-xs">
                    <span className="font-semibold text-[#2D241E]">{song}</span>
                    <button
                      onClick={() => audioPlayer.toggle(`Hát mẫu: ${song} - ${selectedArtisan.name}`)}
                      className="px-3 py-1 rounded-full bg-[#8C2320] text-white font-bold text-[11px] flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Nghe</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8] flex justify-end">
              <button
                onClick={() => setSelectedArtisan(null)}
                className="px-5 py-2 bg-[#FAF8F5] hover:bg-[#EAE1D2] text-[#4A3B32] rounded-full text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

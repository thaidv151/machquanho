import React, { useState } from 'react';
import { ExploreTopic } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import Editor from '../../../components/Editor/Editor';
import { Plus, Search, Edit2, Trash2, Compass, Tag, Layers, X, Save, Sparkles } from 'lucide-react';

interface AdminExploreTabProps {
  exploreTopics: ExploreTopic[];
  isSubmitting: boolean;
  onCreateTopic: (topic: Partial<ExploreTopic>) => Promise<void>;
  onUpdateTopic: (id: string, topic: Partial<ExploreTopic>) => Promise<void>;
  onDeleteTopic: (id: string) => void;
}

export const AdminExploreTab: React.FC<AdminExploreTabProps> = ({
  exploreTopics,
  isSubmitting,
  onCreateTopic,
  onUpdateTopic,
  onDeleteTopic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ExploreTopic | null>(null);

  const [formData, setFormData] = useState<Partial<ExploreTopic>>({
    title: '',
    subtitle: '',
    badge: 'Chuyên đề văn hóa',
    image: '',
    description: '',
    details: [],
    highlights: [],
  });

  const filteredTopics = exploreTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.badge && t.badge.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingTopic(null);
    setFormData({
      title: '',
      subtitle: '',
      badge: 'Phong tục Kinh Bắc',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      description: '',
      details: ['Ý nghĩa văn hóa đặc sắc', 'Không gian diễn xướng lề lối'],
      highlights: ['Trang phục truyền thống', 'Làn điệu giao duyên'],
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (topic: ExploreTopic) => {
    setEditingTopic(topic);
    setFormData({
      ...topic,
      details: topic.details || [],
      highlights: topic.highlights || [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    if (editingTopic) {
      await onUpdateTopic(editingTopic.id, formData);
    } else {
      await onCreateTopic(formData);
    }
    setModalOpen(false);
  };

  return (
    <div id="admin-explore-tab" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs">
        <div>
          <h2 className="font-serif-culture text-xl font-bold text-[#2D241E] flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#8C2320]" />
            <span>Quản lý Chuyên đề Khám phá di sản</span>
          </h2>
          <p className="text-xs text-[#7A6B60] mt-0.5">
            Quản lý các thẻ chuyên đề văn hóa Quan họ hiển thị trên trang chủ (Slide Carousel)
          </p>
        </div>

        <button
          id="add-explore-topic-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chuyên đề mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C6B50] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, thẻ badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs text-[#2D241E] focus:outline-none focus:border-[#8C2320]"
          />
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-[#2D1614]">
                <img src={topic.image} alt={topic.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {topic.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#8C2320] text-white">
                    {topic.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] text-[#E5B567] font-semibold">{topic.subtitle}</p>
                  <h3 className="font-serif-culture text-base font-bold line-clamp-1">{topic.title}</h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-[#5C4D44] line-clamp-2 leading-relaxed">
                  {topic.description || 'Chưa có thông tin mô tả chi tiết.'}
                </p>
                {topic.highlights && topic.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {topic.highlights.map((h, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#E8DFC8] text-[10px] text-[#7A6B60]">
                        #{h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#F0EBE1] mt-2 flex items-center justify-end space-x-2 pt-3">
              <button
                onClick={() => handleOpenEditModal(topic)}
                className="px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#8C2320] hover:text-white text-xs font-semibold text-[#4A3B32] transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => onDeleteTopic(topic.id)}
                className="p-1.5 rounded-lg text-[#8C2F2F] hover:bg-[#8C2F2F]/10 transition-colors cursor-pointer"
                title="Xóa chuyên đề"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-5 animate-scaleUp border border-[#E8DFC8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E] flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#8C2320]" />
                <span>{editingTopic ? 'Chỉnh sửa chuyên đề khám phá' : 'Thêm chuyên đề mới'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A6B60] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề chuyên đề *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Trang phục Quan họ truyền thống"
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#8C2320]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên phụ / Chú thích ảnh</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Nón ba tầm - Áo tứ thân..."
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#8C2320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thẻ nhãn (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Trang phục di sản, Phong tục Kinh Bắc..."
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#8C2320]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Hình ảnh bìa chuyên đề *</label>
                <ImageUploader
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="Chọn hình ảnh chất lượng cho chuyên đề..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Mô tả ngắn gọn</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập nội dung tóm tắt giới thiệu chuyên đề..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#8C2320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung chi tiết chuyên đề (Rich Text)</label>
                <Editor
                  value={formData.content || ''}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Từ khóa nổi bật (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={(formData.highlights || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Nón ba tầm, Áo tứ thân, Dải yếm đào..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs focus:outline-none focus:border-[#8C2320]"
                />
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-[#FAF8F5] hover:bg-[#EAE1D2] text-[#4A3B32] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTopic ? 'Lưu thay đổi' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

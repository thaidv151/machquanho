import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Clock, Landmark, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { TimelineEntry } from '../../../types';
import { apiService } from '../../../services/apiService';
import { TimelineFormModal } from '../modals/TimelineFormModal';

interface AdminTimelineTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onRequestConfirm: (opts: { title?: string; message: string; onConfirm: () => Promise<void> | void }) => void;
}

export const AdminTimelineTab: React.FC<AdminTimelineTabProps> = ({
  showToast,
  onRequestConfirm,
}) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineEntry>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedType]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.adminGetTimelineEntries({
        type: selectedType === 'all' ? undefined : selectedType,
        searchQuery: searchQuery.trim() || undefined,
        pageSize: 100,
      });
      setEntries(result.data);
    } catch (err: any) {
      console.error('Error loading timeline entries:', err);
      showToast('Lỗi khi nạp danh sách Dòng chảy Quan Họ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      type: selectedType === 'policy' ? 'policy' : 'heritage',
      period: '',
      title: '',
      description: '',
      icon: 'landmark',
      sortOrder: 0,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setFormData({ ...entry });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.period || !formData.description) {
      showToast('Vui lòng điền đầy đủ tiêu đề, giai đoạn và nội dung!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEntry) {
        await apiService.adminUpdateTimelineEntry(editingEntry.id, formData);
        showToast('Cập nhật mốc timeline thành công!', 'success');
      } else {
        await apiService.adminCreateTimelineEntry(formData);
        showToast('Thêm mới mốc timeline thành công!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Error saving timeline entry:', err);
      showToast(err?.response?.data?.message || 'Lỗi khi lưu mốc timeline!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (entry: TimelineEntry) => {
    onRequestConfirm({
      title: 'Xác nhận xóa mốc lịch sử',
      message: `Bạn có chắc chắn muốn xóa mốc Dòng chảy Quan Họ "${entry.title}"?`,
      onConfirm: async () => {
        try {
          await apiService.adminDeleteTimelineEntry(entry.id);
          showToast('Đã xóa mốc timeline thành công!', 'success');
          loadData();
        } catch (err: any) {
          showToast(err?.response?.data?.message || 'Lỗi khi xóa mốc timeline!', 'error');
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
        <div>
          <h2 className="font-serif-culture text-2xl font-bold text-[#2D241E] flex items-center space-x-2">
            <Clock className="w-6 h-6 text-[#007f32]" />
            <span>Quản lý Dòng chảy Quan Họ</span>
          </h2>
          <p className="text-sm text-[#7A6B60] mt-1">
            Quản lý các mốc di sản văn hóa và các mốc chính sách bảo tồn
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#007f32] hover:bg-[#006628] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mốc mới</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8DFC8]">
        {/* Type Selector Tabs */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-[#2D241E] text-white'
                : 'bg-[#FAF8F5] text-[#7A6B60] hover:bg-stone-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedType('heritage')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'heritage'
                ? 'bg-[#007f32] text-white'
                : 'bg-[#FAF8F5] text-[#7A6B60] hover:bg-stone-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Dòng chảy di sản</span>
          </button>
          <button
            onClick={() => setSelectedType('policy')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'policy'
                ? 'bg-amber-700 text-white'
                : 'bg-[#FAF8F5] text-[#7A6B60] hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dòng chảy chính sách</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B60]" />
          <input
            type="text"
            placeholder="Tìm kiếm mốc lịch sử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#007f32]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-[#7A6B60]">
            <div className="w-8 h-8 border-3 border-[#007f32] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Đang nạp danh sách timeline...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-[#7A6B60]">
            <Clock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="font-medium text-base">Chưa tìm thấy mốc lịch sử nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DFC8] text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center">STT</th>
                  <th className="py-3.5 px-4">Ảnh</th>
                  <th className="py-3.5 px-4">Thời gian / Giai đoạn</th>
                  <th className="py-3.5 px-4">Tiêu đề mốc lịch sử</th>
                  <th className="py-3.5 px-4">Phân loại</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8] text-sm text-[#2D241E]">
                {entries.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-4 text-center font-mono font-bold text-stone-500">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8DFC8]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-[#E8DFC8] flex items-center justify-center text-stone-400">
                          <Clock className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#007f32]">
                      {item.period}
                    </td>
                    <td className="py-4 px-4 font-bold max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-4 px-4">
                      {item.type === 'heritage' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <Landmark className="w-3 h-3" />
                          <span>Di sản</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Chính sách</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.isPublished !== false ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <Eye className="w-3 h-3" />
                          <span>Đã đăng</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold border border-stone-200">
                          <EyeOff className="w-3 h-3" />
                          <span>Ẩn</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 text-[#007f32] hover:bg-emerald-50 rounded-xl transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Timeline Form Modal */}
      <TimelineFormModal
        isOpen={isModalOpen}
        editingEntry={editingEntry}
        formData={formData}
        isSubmitting={isSubmitting}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default AdminTimelineTab;

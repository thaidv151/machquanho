import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, BookOpen, Calendar, MapPin, Tag } from 'lucide-react';
import { ResearchEntry } from '../../../types';
import { apiService } from '../../../services/apiService';
import { ResearchFormModal } from '../modals/ResearchFormModal';

interface AdminResearchTabProps {
  researchEntries: ResearchEntry[];
  onUpdateResearchEntries: (entries: ResearchEntry[]) => void;
  onOpenNewResearch: () => void;
  onOpenEditResearch: (entry: ResearchEntry) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onRequestConfirm: (opts: { title?: string; message: string; onConfirm: () => Promise<void> | void }) => void;
}

export const AdminResearchTab: React.FC<AdminResearchTabProps> = ({
  researchEntries,
  onUpdateResearchEntries,
  onOpenNewResearch,
  onOpenEditResearch,
  showToast,
  onRequestConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load entries from backend on tab mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await apiService.adminGetResearchEntries(searchQuery ? { keyword: searchQuery } : undefined);
        if (data) {
          onUpdateResearchEntries(data);
        }
      } catch (err) {
        console.warn('Error loading research entries:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [searchQuery]);

  const handleDelete = (entry: ResearchEntry) => {
    onRequestConfirm({
      title: 'Xác nhận xóa ghi chép',
      message: `Bạn có chắc chắn muốn xóa ghi chép nghiên cứu "${entry.title}"?`,
      onConfirm: async () => {
        try {
          await apiService.adminDeleteResearchEntry(entry.id);
          showToast('Đã xóa ghi chép nghiên cứu!', 'success');
          onUpdateResearchEntries(researchEntries.filter((item) => item.id !== entry.id));
        } catch (err: any) {
          showToast(err?.response?.data?.message || 'Lỗi khi xóa ghi chép!', 'error');
        }
      },
    });
  };

  const filteredEntries = researchEntries.filter((e) =>
    searchQuery
      ? e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFC8]">
        <div>
          <h2 className="font-serif-culture text-xl font-bold text-[#2D241E] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#114D3A]" />
            <span>Quản lý Nhật ký nghiên cứu điền dã</span>
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Quản lý các đợt nghiên cứu, ghi chép khảo sát thực địa và tư liệu thu âm di sản Quan họ.
          </p>
        </div>

        <button
          onClick={onOpenNewResearch}
          className="px-4 py-2.5 rounded-xl bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm ghi chép mới</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề hoặc tóm tắt..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8DFC8] bg-white text-xs text-[#2D241E] focus:outline-none focus:border-[#114D3A]"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D241E]">
            <thead className="bg-[#FAF8F5] border-b border-[#E8DFC8] text-[11px] font-bold text-[#7A6B60] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center whitespace-nowrap">STT</th>
                <th className="py-3.5 px-4 min-w-[280px]">Tiêu đề & Tóm tắt</th>
                <th className="py-3.5 px-4 min-w-[140px] whitespace-nowrap">Ngày & Địa điểm</th>
                <th className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">Giai đoạn</th>
                <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Người nghiên cứu</th>
                <th className="py-3.5 px-4 w-24 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#7A6B60]">
                    Đang tải danh sách ghi chép...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#7A6B60]">
                    Chưa có ghi chép nghiên cứu nào. Nhấn "Thêm ghi chép mới" để bắt đầu.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8DFC8] text-[#114D3A] font-bold text-[11px]">
                        #{entry.sortOrder ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 min-w-[280px]">
                      <div className="flex items-start space-x-3">
                        {entry.images && entry.images.length > 0 ? (
                          <img
                            src={entry.images[0]}
                            alt={entry.title}
                            className="w-11 h-11 rounded-xl object-cover border border-[#E8DFC8] shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-[#114D3A]/10 text-[#114D3A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#114D3A]/20">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#2D241E] text-xs line-clamp-1 hover:text-[#114D3A] transition-colors">
                            {entry.title}
                          </h4>
                          <p className="text-[11px] text-[#7A6B60] line-clamp-2 mt-0.5 leading-relaxed">
                            {entry.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B5A4E] whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="flex items-center space-x-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#D4A25A] shrink-0" />
                          <span>{entry.date}</span>
                        </span>
                        <span className="flex items-center space-x-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-[#8C2F2F] shrink-0" />
                          <span className="truncate max-w-[120px]">{entry.location}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#114D3A]/10 text-[#114D3A] border border-[#114D3A]/20 shadow-2xs">
                        {entry.phase}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B5A4E] whitespace-nowrap">
                      <span className="font-medium text-xs text-[#2D241E]">
                        {entry.researcher || 'Mạch Quan Họ'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onOpenEditResearch(entry)}
                          className="p-1.5 rounded-lg text-[#114D3A] hover:bg-[#114D3A]/10 transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry)}
                          className="p-1.5 rounded-lg text-[#8C2F2F] hover:bg-[#8C2F2F]/10 transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

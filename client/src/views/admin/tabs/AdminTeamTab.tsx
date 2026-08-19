import React, { useState } from 'react';
import { TeamMember } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import { Toast, ToastType } from '../../../components/Toast';
import { Plus, Search, Edit2, Trash2, UserCheck, X, Save, ArrowUpDown, Shield, Info } from 'lucide-react';

interface AdminTeamTabProps {
  teamMembers: TeamMember[];
  isSubmitting: boolean;
  onCreateMember: (member: Partial<TeamMember>) => Promise<void>;
  onUpdateMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export const AdminTeamTab: React.FC<AdminTeamTabProps> = ({
  teamMembers,
  isSubmitting,
  onCreateMember,
  onUpdateMember,
  onDeleteMember,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: 'Thành viên',
    avatar: '',
    bio: '',
    sortOrder: 0,
    isActive: true,
  });

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: 'Thành viên',
      avatar: '',
      bio: '',
      sortOrder: teamMembers.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      bio: member.bio || '',
      sortOrder: member.sortOrder ?? 0,
      isActive: member.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setToast({ message: 'Vui lòng nhập họ và tên thành viên', type: 'error' });
      return;
    }

    try {
      if (editingMember) {
        await onUpdateMember(editingMember.id, formData);
        setToast({ message: 'Cập nhật thành viên thành công!', type: 'success' });
      } else {
        await onCreateMember(formData);
        setToast({ message: 'Thêm mới thành viên thành công!', type: 'success' });
      }
      setModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setToast({ message: 'Đã xảy ra lỗi khi lưu thông tin thành viên!', type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}" khỏi danh sách?`)) {
      try {
        await onDeleteMember(id);
        setToast({ message: `Đã xóa thành viên "${name}"`, type: 'success' });
        if (onRefresh) onRefresh();
      } catch (err) {
        setToast({ message: 'Lỗi khi xóa thành viên', type: 'error' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#261C18] p-5 rounded-2xl border border-[#382B26]">
        <div>
          <div className="flex items-center space-x-2 text-[#E5B567]">
            <UserCheck className="w-5 h-5" />
            <h2 className="font-serif-culture text-xl font-bold text-white">Quản lý Nhóm nghiên cứu</h2>
          </div>
          <p className="text-xs text-[#A8988B] mt-1">
            Danh sách thành viên dự án sẽ được hiển thị trên Trang chủ phần "Về nhóm nghiên cứu".
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8C2320] to-[#A32A26] hover:from-[#A32A26] hover:to-[#B83E3E] text-white font-semibold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thành viên mới</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc vai trò..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1C1412] text-white placeholder-[#A8988B]/60 text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567] transition-colors"
        />
      </div>

      {/* Team Members List Table */}
      <div className="bg-[#261C18] rounded-2xl border border-[#382B26] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1C1412] text-[#A8988B] text-[11px] font-bold uppercase tracking-wider border-b border-[#382B26]">
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4">Ảnh & Thành viên</th>
                <th className="py-3.5 px-4">Vai trò / Chức danh</th>
                <th className="py-3.5 px-4">Mô tả ngắn</th>
                <th className="py-3.5 px-4 text-center">Thứ tự</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#382B26] text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#A8988B]">
                    Chưa có thành viên nào trong nhóm nghiên cứu. Bấm "Thêm thành viên mới" để khởi tạo.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-[#2F221E] transition-colors">
                    <td className="py-3.5 px-4 text-center text-[#A8988B] font-mono">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#4A3832] shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${member.role === 'Trưởng nhóm'
                          ? 'bg-[#8C2320]/20 text-[#E5B567] border border-[#8C2320]/40'
                          : 'bg-[#382B26] text-[#E0D5CE]'
                        }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#C4B7AC] max-w-xs truncate">
                      {member.bio || 'Chưa có thông tin'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#E5B567]">
                      {member.sortOrder ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${member.isActive !== false
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                      >
                        {member.isActive !== false ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-1.5 rounded-lg bg-[#382B26] hover:bg-[#4A3832] text-[#E5B567] transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 rounded-lg bg-[#382B26] hover:bg-red-900/50 text-red-400 transition-colors"
                          title="Xóa thành viên"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#261C18] w-full max-w-lg rounded-2xl border border-[#4A3832] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#382B26] flex items-center justify-between bg-[#1C1412]">
              <div className="flex items-center space-x-2 text-[#E5B567]">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-serif-culture text-lg font-bold text-white">
                  {editingMember ? 'Sửa thông tin Thành viên' : 'Thêm Thành viên mới'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#A8988B] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#E0D5CE] mb-1.5">
                  Họ và tên thành viên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  className="w-full px-3.5 py-2 bg-[#1C1412] text-white text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E0D5CE] mb-1.5">
                  Vai trò / Chức danh <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Trưởng nhóm / Thành viên / Cố vấn chuyên môn"
                  className="w-full px-3.5 py-2 bg-[#1C1412] text-white text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567]"
                />
                <p className="text-[10.5px] text-[#A8988B] mt-1">
                  Được hiển thị ngay bên dưới ảnh chân dung (VD: "Trưởng nhóm", "Thành viên").
                </p>
              </div>

              {/* Avatar Field using ImageUploader standard */}
              <div>
                <ImageUploader
                  label="Ảnh chân dung đại diện"
                  value={formData.avatar || ''}
                  onChange={(url) => setFormData({ ...formData, avatar: url })}
                  placeholder="Tải ảnh chân dung hoặc dán URL..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E0D5CE] mb-1.5">
                  Tiểu sử / Ghi chú ngắn
                </label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Giới thiệu đôi nét về thành viên..."
                  className="w-full px-3.5 py-2 bg-[#1C1412] text-white text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#E0D5CE] mb-1.5">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-[#1C1412] text-white text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#E0D5CE] mb-1.5">Trạng thái</label>
                  <select
                    value={formData.isActive !== false ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full px-3.5 py-2 bg-[#1C1412] text-white text-xs rounded-xl border border-[#382B26] focus:outline-none focus:border-[#E5B567]"
                  >
                    <option value="active">Hiển thị trên Trang chủ</option>
                    <option value="inactive">Tạm ẩn</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#382B26] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1C1412] hover:bg-[#2A1C18] text-[#A8988B] text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#8C2320] to-[#A32A26] hover:from-[#A32A26] text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

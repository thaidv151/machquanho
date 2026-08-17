import React from 'react';
import { Plus, Search, Edit, Trash2, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { AdminUser } from '../../../types';

interface AdminUsersTabProps {
  users: AdminUser[];
  filteredUsers: AdminUser[];
  userSearch: string;
  userRoleFilter: string;
  setUserSearch: (val: string) => void;
  setUserRoleFilter: (val: string) => void;
  onOpenNewUser: () => void;
  onOpenEditUser: (usr: AdminUser) => void;
  onDeleteUser: (id: string) => void;
  onToggleUserStatus: (usr: AdminUser) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  filteredUsers,
  userSearch,
  userRoleFilter,
  setUserSearch,
  setUserRoleFilter,
  onOpenNewUser,
  onOpenEditUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl font-bold text-[#2D241E]">
            Quản lý Tài khoản Ban quản trị
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Tổng số <span className="font-bold text-[#8C2320]">{users.length}</span> người dùng có quyền quản trị CMS
          </p>
        </div>
        <button
          onClick={onOpenNewUser}
          className="px-5 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm người dùng mới</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
          <input
            type="text"
            placeholder="Tìm người dùng theo tên hoặc email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8C2320]"
          />
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBA] rounded-full font-medium text-[#4A3B32] w-full md:w-auto"
        >
          <option value="Tất cả">Tất cả vai trò</option>
          <option value="Quản trị viên">Quản trị viên</option>
          <option value="Biên tập viên">Biên tập viên</option>
          <option value="Cộng tác viên">Cộng tác viên</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8DFC8] text-[#8C6B50] uppercase tracking-wider font-semibold">
                <th className="p-4">Thành viên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]/60 text-[#3A1E16]">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={usr.avatar} 
                        alt={usr.name} 
                        className="w-10 h-10 rounded-full object-cover border border-[#E8DFC8]"
                      />
                      <div>
                        <p className="font-bold text-[#2D241E]">{usr.name}</p>
                        {usr.phone && <p className="text-[11px] text-[#8C6B50]">{usr.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#4A3B32]">{usr.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      usr.role === 'Quản trị viên' 
                        ? 'bg-purple-100 text-purple-800' 
                        : usr.role === 'Biên tập viên' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{usr.role}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => onToggleUserStatus(usr)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        usr.status === 'Hoạt động' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {usr.status === 'Hoạt động' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{usr.status}</span>
                    </button>
                  </td>
                  <td className="p-4 text-[#8C6B50]">{usr.createdDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onOpenEditUser(usr)}
                        className="p-1.5 text-gray-600 hover:text-[#8C2320] hover:bg-red-50 rounded-lg transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(usr.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa người dùng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

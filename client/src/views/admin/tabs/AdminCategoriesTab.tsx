import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CategoryInfo } from '../../../types';

interface AdminCategoriesTabProps {
  categories: CategoryInfo[];
  onOpenAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onOpenAddCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl font-bold text-[#2D241E]">
            Quản lý Chuyên mục Di sản
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Phân loại danh mục bài viết và làn điệu trên Mạch Quan Họ
          </p>
        </div>
        <button
          onClick={onOpenAddCategory}
          className="px-5 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chuyên mục</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs relative flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="w-4 h-4 rounded-full inline-block border border-black/10" 
                  style={{ backgroundColor: cat.color || '#8C2320' }} 
                />
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Xóa chuyên mục"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">{cat.name}</h3>
              <p className="text-xs text-[#7A6B60] mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-[#8C6B50]">
              <span>Slug: <code className="text-[#8C2320] font-mono">{cat.slug}</code></span>
              <span>{cat.count} bài viết</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

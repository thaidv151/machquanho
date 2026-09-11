import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Search, Edit2, Trash2, Globe, Settings, Save, 
  Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Layers, Compass, ArrowUp, ArrowDown, Tag 
} from 'lucide-react';
import { MapLocation, MapConfig, MapCategoryConfig } from '../../../types';
import { apiService } from '../../../services/apiService';
import { MapLocationFormModal } from '../modals/MapLocationFormModal';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Toast } from '../../../components/Toast';

export const AdminMapTab: React.FC = () => {
  // Config state
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    title: 'BẢN ĐỒ MẠCH QUAN HỌ',
    subtitle: 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa',
    height: '600px',
    width: '100%',
    defaultLat: 21.1861,
    defaultLng: 106.0763,
    defaultZoom: 12,
    categories: [],
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // New category creation form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📍');
  const [newCatColor, setNewCatColor] = useState('#8B263E');

  // Map Locations table state
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Modals & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category deletion state & confirm modal
  const [deleteCatIndex, setDeleteCatIndex] = useState<number | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const dynamicCategories = ['Tất cả', ...(mapConfig.categories || []).map((c) => c.name)];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchMapConfig = async () => {
    try {
      const cfg = await apiService.getMapConfig();
      setMapConfig(cfg);
    } catch (err) {
      console.error('Fetch map config error:', err);
    }
  };

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await apiService.adminGetMapLocations({
        keyword: keyword.trim(),
        category: selectedCategory,
      });
      setLocations(res.data);
    } catch (err) {
      console.error('Fetch map locations error:', err);
      showToast('Lỗi khi tải danh sách điểm bản đồ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapConfig();
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [keyword, selectedCategory]);

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    try {
      await apiService.updateMapConfig(mapConfig);
      showToast('Cập nhật cấu hình tổng quan & danh mục bản đồ thành công!', 'success');
    } catch (err) {
      console.error('Save map config error:', err);
      showToast('Lỗi khi lưu cấu hình bản đồ', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Category Management Handlers with Immediate DB Persistence
  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      showToast('Vui lòng nhập tên phân loại danh mục mới', 'error');
      return;
    }
    const currentCats = mapConfig.categories || [];
    if (currentCats.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      showToast('Tên phân loại này đã tồn tại', 'error');
      return;
    }
    const newCatItem: MapCategoryConfig = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      icon: newCatIcon || '📍',
      color: newCatColor || '#8B263E',
      sort_order: currentCats.length + 1,
    };
    const updatedCats = [...currentCats, newCatItem];
    const newConfig = { ...mapConfig, categories: updatedCats };
    setMapConfig(newConfig);
    setNewCatName('');
    try {
      await apiService.updateMapConfig(newConfig);
      showToast(`Đã thêm phân loại "${newCatItem.name}" thành công!`, 'success');
    } catch (err) {
      console.error('Save category add error:', err);
      showToast('Lỗi khi lưu phân loại mới vào CSDL', 'error');
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const currentCats = [...(mapConfig.categories || [])];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentCats.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = currentCats[index];
    currentCats[index] = currentCats[targetIndex];
    currentCats[targetIndex] = temp;

    // Recalculate sort order numbers
    const reordered = currentCats.map((c, i) => ({ ...c, sort_order: i + 1 }));
    const newConfig = { ...mapConfig, categories: reordered };
    setMapConfig(newConfig);
    try {
      await apiService.updateMapConfig(newConfig);
      showToast('Đã cập nhật thứ tự danh mục thành công!', 'success');
    } catch (err) {
      console.error('Save category order error:', err);
      showToast('Lỗi khi lưu thứ tự danh mục vào CSDL', 'error');
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (deleteCatIndex === null) return;
    setIsDeletingCat(true);
    try {
      const currentCats = mapConfig.categories || [];
      const removedName = currentCats[deleteCatIndex]?.name || 'Danh mục';
      const updatedCats = currentCats.filter((_, i) => i !== deleteCatIndex).map((c, i) => ({ ...c, sort_order: i + 1 }));
      const newConfig = { ...mapConfig, categories: updatedCats };
      setMapConfig(newConfig);
      await apiService.updateMapConfig(newConfig);
      showToast(`Đã xóa phân loại "${removedName}" thành công!`, 'success');
      setDeleteCatIndex(null);
    } catch (err) {
      console.error('Delete category error:', err);
      showToast('Lỗi khi xóa phân loại danh mục', 'error');
    } finally {
      setIsDeletingCat(false);
    }
  };

  const handleSaveLocation = async (data: Partial<MapLocation>) => {
    try {
      if (editingLocation) {
        const updated = await apiService.updateMapLocation(editingLocation.id, data);
        showToast('Cập nhật điểm bản đồ thành công!', 'success');
        setLocations((prev) => prev.map((item) => (String(item.id) === String(updated.id) ? updated : item)));
      } else {
        const created = await apiService.createMapLocation(data);
        showToast('Thêm điểm bản đồ di sản mới thành công!', 'success');
        setLocations((prev) => [created, ...prev.filter((item) => String(item.id) !== String(created.id))]);
      }
      fetchLocations();
    } catch (err: any) {
      console.error('Save location error:', err);
      showToast(err.message || 'Lỗi khi lưu điểm bản đồ', 'error');
      throw err;
    }
  };

  const handleDeleteLocation = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiService.deleteMapLocation(deleteId);
      showToast('Đã xóa điểm bản đồ thành công', 'success');
      setDeleteId(null);
      fetchLocations();
    } catch (err) {
      console.error('Delete location error:', err);
      showToast('Lỗi khi xóa điểm bản đồ', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#382B26]">
        <div>
          <h1 className="text-xl font-serif-culture font-bold text-white flex items-center space-x-2.5">
            <MapPin className="w-6 h-6 text-[#E5B567]" />
            <span>Quản lý Bản đồ & Điểm Di sản</span>
          </h1>
          <p className="text-xs text-[#A8988B] mt-1">
            Cấu hình tham số hiển thị bản đồ, chọn tọa độ trực tiếp và quản lý các điểm di sản Quan họ Kinh Bắc
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLocation(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-[#8B263E] to-[#A8324E] hover:from-[#751F33] hover:to-[#8B263E] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm điểm di sản mới</span>
        </button>
      </div>

      {/* 1. Global Map Configuration Section */}
      <div className="bg-[#1C1412] rounded-2xl border border-[#382B26] p-6 text-[#E0D5CE] shadow-lg">
        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-[#382B26]">
          <div className="w-8 h-8 rounded-lg bg-[#8B263E]/30 border border-[#8B263E] flex items-center justify-center text-[#E5B567]">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Cấu hình tổng quan Bản đồ (General Map Settings)
            </h2>
            <p className="text-[11px] text-[#A8988B]">Cấu hình tiêu đề, khung hiển thị và tọa độ trung tâm khi render bản đồ</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          {/* Title */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
              Tiêu đề Bản đồ
            </label>
            <input
              type="text"
              required
              value={mapConfig.title}
              onChange={(e) => setMapConfig({ ...mapConfig, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white focus:outline-none focus:border-[#E5B567]"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
              Phụ đề / Mô tả bản đồ
            </label>
            <input
              type="text"
              value={mapConfig.subtitle}
              onChange={(e) => setMapConfig({ ...mapConfig, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white focus:outline-none focus:border-[#E5B567]"
            />
          </div>

          {/* Map Dimensions */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
                Chiều cao (Height)
              </label>
              <input
                type="text"
                required
                value={mapConfig.height}
                onChange={(e) => setMapConfig({ ...mapConfig, height: e.target.value })}
                placeholder="600px"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white focus:outline-none focus:border-[#E5B567]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
                Chiều rộng (Width)
              </label>
              <input
                type="text"
                required
                value={mapConfig.width}
                onChange={(e) => setMapConfig({ ...mapConfig, width: e.target.value })}
                placeholder="100%"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white focus:outline-none focus:border-[#E5B567]"
              />
            </div>
          </div>

          {/* Initial Center Lat/Lng & Zoom */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
              Vĩ độ trung tâm (Center Lat)
            </label>
            <input
              type="number"
              step="any"
              required
              value={mapConfig.defaultLat}
              onChange={(e) => setMapConfig({ ...mapConfig, defaultLat: parseFloat(e.target.value) || 21.1861 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white font-mono focus:outline-none focus:border-[#E5B567]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
              Kinh độ trung tâm (Center Lng)
            </label>
            <input
              type="number"
              step="any"
              required
              value={mapConfig.defaultLng}
              onChange={(e) => setMapConfig({ ...mapConfig, defaultLng: parseFloat(e.target.value) || 106.0763 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white font-mono focus:outline-none focus:border-[#E5B567]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8988B] mb-1">
              Mức Zoom ban đầu (Zoom Level)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                max={20}
                required
                value={mapConfig.defaultZoom}
                onChange={(e) => setMapConfig({ ...mapConfig, defaultZoom: parseInt(e.target.value) || 12 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white focus:outline-none focus:border-[#E5B567]"
              />
              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-4 py-2.5 rounded-xl bg-[#E5B567] hover:bg-[#D4A355] text-[#1C1412] font-bold shadow-md flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Lưu cấu hình</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Map Category Customization & Re-ordering Section */}
      <div className="bg-[#1C1412] rounded-2xl border border-[#382B26] p-6 text-[#E0D5CE] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#382B26] gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B263E]/30 border border-[#8B263E] flex items-center justify-center text-[#E5B567]">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Cấu hình Phân loại & Thứ tự hiển thị Danh mục
              </h2>
              <p className="text-[11px] text-[#A8988B]">
                Tùy chỉnh danh sách phân loại điểm di sản, thay đổi thứ tự sắp xếp và icon/màu sắc pin bản đồ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveConfig()}
            disabled={isSavingConfig}
            className="px-3.5 py-1.5 bg-[#8B263E] hover:bg-[#751F33] text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 self-start sm:self-auto transition-all cursor-pointer disabled:opacity-50"
          >
            {isSavingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Lưu thứ tự danh mục</span>
          </button>
        </div>

        {/* Existing Categories List Table with Re-order buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-x-auto rounded-xl border border-[#382B26]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#2A1C18] text-[#A8988B] uppercase tracking-wider font-bold border-b border-[#382B26]">
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3">Icon & Tên danh mục</th>
                  <th className="py-2.5 px-3">Mã màu Pin</th>
                  <th className="py-2.5 px-3 text-center">Thứ tự</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#382B26]">
                {(mapConfig.categories || []).map((cat, idx) => (
                  <tr key={cat.id || idx} className="hover:bg-[#2A1C18]/60 transition-colors">
                    <td className="py-2.5 px-3 text-center text-[#A8988B] font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center space-x-2">
                      <span className="text-base">{cat.icon || '📍'}</span>
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: cat.color || '#8B263E' }}
                        />
                        <span className="font-mono text-[11px] text-[#A8988B]">{cat.color || '#8B263E'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center space-x-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCategory(idx, 'up')}
                        className="p-1 rounded bg-[#2A1C18] hover:bg-[#382520] text-[#E5B567] disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (mapConfig.categories?.length || 0) - 1}
                        onClick={() => handleMoveCategory(idx, 'down')}
                        className="p-1 rounded bg-[#2A1C18] hover:bg-[#382520] text-[#E5B567] disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteCatIndex(idx)}
                        className="p-1 rounded bg-[#2A1C18] hover:bg-red-900/40 text-red-400 cursor-pointer"
                        title="Xóa danh mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Quick Add New Category */}
          <div className="bg-[#2A1C18] rounded-xl p-4 border border-[#382B26] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-[#E5B567]" />
              <span>Thêm danh mục phân loại mới</span>
            </h3>

            <div>
              <label className="block text-[11px] text-[#A8988B] uppercase tracking-wider mb-1">
                Tên danh mục phân loại
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                placeholder="VD: Di tích lịch sử, Lễ hội..."
                className="w-full px-3 py-2 rounded-xl border border-[#382B26] bg-[#1C1412] text-white text-xs focus:outline-none focus:border-[#E5B567]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-[#A8988B] uppercase tracking-wider mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="📍, 🌸, 🏛️..."
                  className="w-full px-3 py-2 rounded-xl border border-[#382B26] bg-[#1C1412] text-white text-xs focus:outline-none focus:border-[#E5B567]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#A8988B] uppercase tracking-wider mb-1">
                  Màu sắc Pin
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-[#382B26] bg-[#1C1412] text-white font-mono text-xs focus:outline-none focus:border-[#E5B567]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCategory}
              className="w-full py-2.5 rounded-xl bg-[#E5B567] hover:bg-[#D4A355] text-[#1C1412] font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm danh mục vào danh sách</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Map Locations Table & Management Section */}
      <div className="bg-[#1C1412] rounded-2xl border border-[#382B26] p-6 text-[#E0D5CE] shadow-lg space-y-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#8B263E] text-white shadow-md'
                    : 'bg-[#2A1C18] text-[#C4B7AC] hover:bg-[#382520] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8988B]" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm điểm bản đồ..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#382B26] bg-[#2A1C18] text-white text-xs focus:outline-none focus:border-[#E5B567]"
            />
          </div>
        </div>

        {/* Locations Table */}
        <div className="overflow-x-auto rounded-xl border border-[#382B26]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#2A1C18] text-[#A8988B] uppercase tracking-wider font-bold border-b border-[#382B26]">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Ảnh</th>
                <th className="py-3 px-4">Tên điểm di sản</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4">Địa chỉ / Khu vực</th>
                <th className="py-3 px-4 font-mono">Tọa độ (Lat, Lng)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#382B26]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A8988B]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E5B567]" />
                    <span>Đang tải danh sách điểm di sản...</span>
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A8988B]">
                    Chưa có điểm di sản bản đồ nào. Nhấn "Thêm điểm di sản mới" để tạo.
                  </td>
                </tr>
              ) : (
                locations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#2A1C18]/60 transition-colors">
                    <td className="py-3 px-4 text-center text-[#A8988B] font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-12 h-10 object-cover rounded-lg border border-[#382B26]"
                        />
                      ) : (
                        <div className="w-12 h-10 bg-[#2A1C18] rounded-lg border border-[#382B26] flex items-center justify-center text-[#A8988B]">
                          <MapPin className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{item.title}</div>
                      {item.summary && (
                        <div className="text-[11px] text-[#A8988B] font-normal truncate max-w-xs mt-0.5">
                          {item.summary}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#8B263E]/30 text-[#E5B567] border border-[#8B263E]/50">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#C4B7AC]">{item.address || '—'}</td>
                    <td className="py-3 px-4 font-mono text-[#E5B567] text-[11px]">
                      {item.latitude}, {item.longitude}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.status ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          <Eye className="w-3 h-3" />
                          <span>Hiển thị</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          <EyeOff className="w-3 h-3" />
                          <span>Ẩn</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingLocation(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#2A1C18] hover:bg-[#382520] text-[#E5B567] transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded-lg bg-[#2A1C18] hover:bg-red-900/40 text-red-400 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal for Add/Edit Location */}
      <MapLocationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLocation}
        location={editingLocation}
        categories={mapConfig.categories}
      />

      {/* Confirm Delete Location Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDeleteLocation}
        title="Xác nhận xóa điểm di sản bản đồ"
        message="Bạn có chắc chắn muốn xóa điểm bản đồ này không? Hành động này không thể hoàn tác."
        confirmText="Xóa dữ liệu"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Confirm Delete Category Modal */}
      <ConfirmModal
        isOpen={deleteCatIndex !== null}
        onCancel={() => setDeleteCatIndex(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="Xác nhận xóa phân loại danh mục bản đồ"
        message={`Bạn có chắc chắn muốn xóa phân loại danh mục "${deleteCatIndex !== null && mapConfig.categories ? mapConfig.categories[deleteCatIndex]?.name : ''}" này không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa danh mục"
        variant="danger"
        isLoading={isDeletingCat}
      />
    </div>
  );
};

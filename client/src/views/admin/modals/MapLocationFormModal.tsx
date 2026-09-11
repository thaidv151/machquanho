import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Save, Loader2, Sparkles, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, MapCategoryConfig } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import { Editor } from '../../../components/Editor';

interface MapLocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MapLocation>) => Promise<void>;
  location?: MapLocation | null;
  categories?: MapCategoryConfig[];
}

const CATEGORY_OPTIONS = [
  'Làng Quan họ',
  'Địa điểm di sản',
  'Không gian diễn xướng',
  'Nhà hát',
  'Hoạt động di sản',
  'Di tích lịch sử',
];

export const MapLocationFormModal: React.FC<MapLocationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  location,
  categories = [],
}) => {
  const categoryNames = categories.length > 0 ? categories.map((c) => c.name) : CATEGORY_OPTIONS;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categoryNames[0] || 'Địa điểm di sản');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(21.1861);
  const [longitude, setLongitude] = useState<number>(106.0763);
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leaflet map reference for picker
  const pickerMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const defaultCat = categoryNames[0] || 'Địa điểm di sản';
    if (location) {
      setTitle(location.title || '');
      const catVal = location.category || defaultCat;
      if (categoryNames.includes(catVal)) {
        setCategory(catVal);
        setIsCustomCat(false);
      } else {
        setIsCustomCat(true);
        setCustomCategory(catVal);
      }
      setAddress(location.address || '');
      setLatitude(Number(location.latitude || 21.1861));
      setLongitude(Number(location.longitude || 106.0763));
      setImageUrl(location.image_url || '');
      setSummary(location.summary || '');
      setContent(location.content || '');
      setStatus(location.status !== undefined ? location.status : true);
      setSortOrder(location.sort_order ?? 0);
    } else {
      setTitle('');
      setCategory(defaultCat);
      setIsCustomCat(false);
      setCustomCategory('');
      setAddress('');
      setLatitude(21.1861);
      setLongitude(106.0763);
      setImageUrl('');
      setSummary('');
      setContent('');
      setStatus(true);
      setSortOrder(0);
    }
  }, [location, isOpen, categories]);

  // Initialize interactive Leaflet Picker Map inside modal
  useEffect(() => {
    if (!isOpen || !pickerMapRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const currentLat = Number(latitude) || 21.1861;
    const currentLng = Number(longitude) || 106.0763;

    // Create map
    const map = L.map(pickerMapRef.current, {
      center: [currentLat, currentLng],
      zoom: 13,
      scrollWheelZoom: true,
    });

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Icon Pin
    const customIcon = L.divIcon({
      className: 'custom-picker-pin',
      html: `<div style="background-color: #8B263E; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; items-center; justify-content: center; color: white;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 21.7C17.3 17 20 13 20 9a8 8 0 1 0-16 0c0 4 2.7 8 8 12.7z"/></svg>
             </div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
    });

    // Add Draggable Marker
    const marker = L.marker([currentLat, currentLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setLatitude(Number(pos.lat.toFixed(6)));
      setLongitude(Number(pos.lng.toFixed(6)));
    });

    // Map click handler to select coordinates directly on click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));
      setLatitude(lat);
      setLongitude(lng);
      marker.setLatLng([lat, lng]);
      map.panTo([lat, lng]);
    });

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;

    // Invalidate size after modal animation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update map marker when latitude/longitude change manually
  const updateMapPosition = (newLat: number, newLng: number) => {
    if (mapInstanceRef.current && markerInstanceRef.current) {
      if (!isNaN(newLat) && !isNaN(newLng)) {
        markerInstanceRef.current.setLatLng([newLat, newLng]);
        mapInstanceRef.current.panTo([newLat, newLng]);
      }
    }
  };

  const handleLatChange = (val: string) => {
    const num = parseFloat(val);
    setLatitude(num);
    updateMapPosition(num, longitude);
  };

  const handleLngChange = (val: string) => {
    const num = parseFloat(val);
    setLongitude(num);
    updateMapPosition(latitude, num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCat ? customCategory.trim() : category;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        category: finalCategory || 'Địa điểm di sản',
        address: address.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        image_url: imageUrl,
        summary: summary.trim(),
        content: content,
        status: status,
        sort_order: Number(sortOrder) || 0,
      });
      onClose();
    } catch (err) {
      console.error('Submit map location error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8DCC4] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1C1412] to-[#2D241E] text-white flex items-center justify-between border-b border-[#382B26] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B263E] flex items-center justify-center text-white font-bold shadow-md">
              <MapPin className="w-5 h-5 text-[#E5B567]" />
            </div>
            <div>
              <h2 className="text-base font-serif-culture font-bold text-[#FAF8F5]">
                {location ? 'Chỉnh sửa điểm di sản bản đồ' : 'Thêm mới điểm di sản trên bản đồ'}
              </h2>
              <p className="text-xs text-[#C4B7AC]">Cấu hình vị trí, thông tin chi tiết & chọn tọa độ tương tác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#C4B7AC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#2D241E]">
          {/* Main Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
                Tên điểm di sản / Tọa độ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Làng Diềm (Viêm Xá), Đền Cùng Giếng Ngọc..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] focus:ring-2 focus:ring-[#8B263E]/20 font-medium transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
                Phân loại điểm di sản <span className="text-red-500">*</span>
              </label>
              {!isCustomCat ? (
                <div className="flex space-x-2">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomCat(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] focus:ring-2 focus:ring-[#8B263E]/20 font-medium transition-all"
                  >
                    {categoryNames.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Thêm phân loại mới...</option>
                  </select>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Nhập tên phân loại mới..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCat(false)}
                    className="px-3 py-2 text-xs bg-[#E8DCC4] text-[#4A3B32] rounded-xl hover:bg-[#D5C7B5] font-semibold transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Address & Status/Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
                Địa chỉ / Khu vực
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: Thôn Viêm Xá, Xã Hòa Long, TP. Bắc Ninh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
                  Thứ tự
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
                  Trạng thái
                </label>
                <select
                  value={status ? 'active' : 'inactive'}
                  onChange={(e) => setStatus(e.target.value === 'active')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] font-medium"
                >
                  <option value="active">Hiển thị</option>
                  <option value="inactive">Ẩn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coordinates & Interactive Map Location Picker */}
          <div className="p-4 bg-white rounded-2xl border border-[#E8DCC4] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-[#8B263E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D241E]">
                  Tọa độ địa lý (Latitude & Longitude)
                </span>
              </div>
              <span className="text-[11px] text-[#8B263E] font-medium bg-[#8B263E]/10 px-2.5 py-1 rounded-full">
                💡 Bấm hoặc kéo điểm pin trên bản đồ bên dưới để lấy tọa độ tự động
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B5A4E] mb-1">
                  Vĩ độ (Latitude - N/S) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={(e) => handleLatChange(e.target.value)}
                  placeholder="21.186100"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#8B263E] font-mono text-sm font-semibold text-[#8B263E]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6B5A4E] mb-1">
                  Kinh độ (Longitude - E/W) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={(e) => handleLngChange(e.target.value)}
                  placeholder="106.076300"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#8B263E] font-mono text-sm font-semibold text-[#8B263E]"
                />
              </div>
            </div>

            {/* Embedded Interactive Map Picker */}
            <div className="relative rounded-xl overflow-hidden border border-[#D5C7B5] shadow-inner">
              <div ref={pickerMapRef} className="w-full h-56 z-0" />
              <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10.5px] font-semibold text-[#2D241E] shadow-sm border border-[#E8DCC4]">
                📍 Nhấp vào bản đồ để chọn tọa độ
              </div>
            </div>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
              Ảnh đại diện điểm di sản
            </label>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              placeholder="Chọn hoặc kéo thả hình ảnh đại diện điểm di sản..."
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E] mb-1">
              Mô tả ngắn (Hiển thị nhanh tại Popup khi người dùng bấm vào pin bản đồ)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Nhập đoạn tóm tắt ngắn mộc mạc về điểm di sản này..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white focus:outline-none focus:border-[#8B263E] font-medium"
            />
          </div>

          {/* Rich Text Editor for Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A4E]">
                Nội dung chi tiết điểm di sản (Rich Text Editor)
              </label>
              <span className="text-[11px] text-[#A8988B] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#E5B567]" />
                <span>Định dạng HTML, chèn ảnh, video, văn bản phong phú</span>
              </span>
            </div>
            <div className="border border-[#D5C7B5] rounded-xl overflow-hidden bg-white">
              <Editor
                value={content}
                onChange={(html) => setContent(html)}
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 border-t border-[#E8DCC4] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D5C7B5] text-[#6B5A4E] hover:bg-[#E8DCC4]/50 font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B263E] to-[#A8324E] hover:from-[#751F33] hover:to-[#8B263E] text-white font-bold shadow-md flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu dữ liệu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{location ? 'Lưu thay đổi' : 'Tạo điểm di sản mới'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { BannerButtonItem } from '../../../types';

interface BannerButtonsEditorProps {
  buttons?: BannerButtonItem[];
  onChange: (buttons: BannerButtonItem[]) => void;
}

const PRESET_BUTTON_ICONS = [
  'ChevronRight', 'Play', 'Sparkles', 'Music', 'BookOpen', 'Users', 'Globe', 'ArrowRight', 'ExternalLink'
];

const PRESET_BG_COLORS = [
  { label: 'Son Đỏ', hex: '#8C2320' },
  { label: 'Xanh Di Sản', hex: '#007F32' },
  { label: 'Kem Vàng', hex: '#F2EDE4' },
  { label: 'Tối Slate', hex: '#1E293B' },
  { label: 'Trắng', hex: '#FFFFFF' },
];

const PRESET_TEXT_COLORS = [
  { label: 'Trắng', hex: '#FFFFFF' },
  { label: 'Son Đỏ', hex: '#8C2320' },
  { label: 'Đỏ Nâu', hex: '#6B201D' },
  { label: 'Chữ Tối', hex: '#2D241E' },
];

export const BannerButtonsEditor: React.FC<BannerButtonsEditorProps> = ({
  buttons = [],
  onChange,
}) => {
  const handleAddButton = () => {
    const newBtn: BannerButtonItem = {
      id: `btn-${Date.now()}`,
      text: 'Nút bấm mới',
      icon: 'ChevronRight',
      link: 'news',
      bgColor: '#8C2320',
      textColor: '#FFFFFF',
    };
    onChange([...buttons, newBtn]);
  };

  const handleUpdateButton = (id: string, updatedFields: Partial<BannerButtonItem>) => {
    onChange(buttons.map(btn => btn.id === id ? { ...btn, ...updatedFields } : btn));
  };

  const handleDeleteButton = (id: string) => {
    onChange(buttons.filter(btn => btn.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const list = [...buttons];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    onChange(list);
  };

  const handleMoveDown = (index: number) => {
    if (index >= buttons.length - 1) return;
    const list = [...buttons];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    onChange(list);
  };

  return (
    <div className="space-y-4 bg-[#FAF8F5] p-4 sm:p-5 border border-[#E8DFC8] rounded-2xl">
      <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]">
        <div>
          <label className="block text-xs font-bold text-[#8C2320]">
            Danh sách Nút bấm trên Banner ({buttons.length})
          </label>
          <p className="text-[11px] text-[#7A6B60]">Tùy chỉnh nhiều nút bấm, icon, link và màu sắc nền/chữ linh hoạt</p>
        </div>
        <button
          type="button"
          onClick={handleAddButton}
          className="px-3.5 py-1.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm nút mới</span>
        </button>
      </div>

      {buttons.length === 0 ? (
        <p className="text-xs text-[#7A6B60] italic text-center py-3">
          Chưa có nút bấm nào. Bấm "Thêm nút mới" để tạo nút bấm đầu tiên.
        </p>
      ) : (
        <div className="space-y-4">
          {buttons.map((btn, idx) => {
            const currentBg = btn.bgColor || '#8C2320';
            const currentText = btn.textColor || '#FFFFFF';

            return (
              <div 
                key={btn.id} 
                className="bg-white p-4 rounded-xl border border-[#D9CEBA] space-y-3 shadow-xs relative"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#8C2320]">Nút #{idx + 1}</span>
                    {/* Live Button Preview */}
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-bold shadow-xs inline-flex items-center space-x-1.5 border border-black/10"
                      style={{ backgroundColor: currentBg, color: currentText }}
                    >
                      <span>{btn.text || 'Nút xem trước'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-[#7A6B60] hover:text-[#8C2320] disabled:opacity-30 cursor-pointer"
                      title="Lên trên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === buttons.length - 1}
                      className="p-1 text-[#7A6B60] hover:text-[#8C2320] disabled:opacity-30 cursor-pointer"
                      title="Xuống dưới"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteButton(btn.id)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Xóa nút này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">Chữ trong nút *</label>
                    <input
                      type="text"
                      required
                      value={btn.text}
                      onChange={(e) => handleUpdateButton(btn.id, { text: e.target.value })}
                      placeholder="Khám phá ngay"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">Icon nút</label>
                    <select
                      value={btn.icon || 'ChevronRight'}
                      onChange={(e) => handleUpdateButton(btn.id, { icon: e.target.value })}
                      className="w-full p-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                    >
                      {PRESET_BUTTON_ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">Đường dẫn Link / URL liên kết *</label>
                    <input
                      type="text"
                      required
                      value={btn.link || ''}
                      onChange={(e) => handleUpdateButton(btn.id, { link: e.target.value })}
                      placeholder="VD: /news, /about, audio-play..."
                      className="w-full p-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-mono text-[#2D241E]"
                    />
                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['/news', '/research-diary', '/about', 'audio-play'].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleUpdateButton(btn.id, { link: suggestion })}
                          className="text-[10px] bg-[#FAF8F5] hover:bg-[#8C2320]/10 hover:text-[#8C2320] text-[#7A6B60] border border-[#D9CEBA] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Background Color Picker */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">Màu nền nút (Button Bg Color)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentBg}
                        onChange={(e) => handleUpdateButton(btn.id, { bgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#D9CEBA] p-0.5"
                      />
                      <input
                        type="text"
                        value={currentBg}
                        onChange={(e) => handleUpdateButton(btn.id, { bgColor: e.target.value })}
                        className="w-24 p-1.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-lg text-xs font-mono"
                      />
                      <div className="flex items-center space-x-1">
                        {PRESET_BG_COLORS.map(p => (
                          <button
                            key={p.hex}
                            type="button"
                            onClick={() => handleUpdateButton(btn.id, { bgColor: p.hex })}
                            className="w-5 h-5 rounded-full border border-black/20 cursor-pointer shadow-2xs hover:scale-110 transition-transform"
                            style={{ backgroundColor: p.hex }}
                            title={p.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Text Color Picker */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">Màu chữ nút (Text Color)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentText}
                        onChange={(e) => handleUpdateButton(btn.id, { textColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#D9CEBA] p-0.5"
                      />
                      <input
                        type="text"
                        value={currentText}
                        onChange={(e) => handleUpdateButton(btn.id, { textColor: e.target.value })}
                        className="w-24 p-1.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-lg text-xs font-mono"
                      />
                      <div className="flex items-center space-x-1">
                        {PRESET_TEXT_COLORS.map(p => (
                          <button
                            key={p.hex}
                            type="button"
                            onClick={() => handleUpdateButton(btn.id, { textColor: p.hex })}
                            className="w-5 h-5 rounded-full border border-black/20 cursor-pointer shadow-2xs hover:scale-110 transition-transform"
                            style={{ backgroundColor: p.hex }}
                            title={p.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

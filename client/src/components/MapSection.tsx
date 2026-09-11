import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Eye, X, Compass, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { MapLocation, MapConfig } from '../types';
import { apiService } from '../services/apiService';

interface MapSectionProps {
  initialConfig?: MapConfig;
  initialLocations?: MapLocation[];
  standalonePage?: boolean;
}

export const MapSection: React.FC<MapSectionProps> = ({
  initialConfig,
  initialLocations,
  standalonePage = false,
}) => {
  const [config, setConfig] = useState<MapConfig>(
    initialConfig || {
      title: 'BẢN ĐỒ MẠCH QUAN HỌ',
      subtitle: 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa',
      height: '600px',
      width: '100%',
      defaultLat: 21.1861,
      defaultLng: 106.0763,
      defaultZoom: 12,
    }
  );

  const [locations, setLocations] = useState<MapLocation[]>(initialLocations || []);
  const [loading, setLoading] = useState<boolean>(!initialLocations);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<MapLocation | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Load Config & Locations on mount if not passed via props
  useEffect(() => {
    let isMounted = true;
    if (!initialConfig) {
      apiService.getMapConfig().then((cfg) => {
        if (isMounted && cfg) setConfig(cfg);
      });
    }
    if (!initialLocations) {
      setLoading(true);
      apiService.getMapLocations()
        .then((data) => {
          if (isMounted) setLocations(data || []);
        })
        .catch((err) => {
          console.error('Fetch map locations error:', err);
          if (isMounted) setLocations([]);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [initialConfig, initialLocations]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (loading || !mapContainerRef.current) return;

    // Remove existing map if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [config.defaultLat, config.defaultLng],
        zoom: config.defaultZoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // CartoDB Positron / OpenStreetMap Tile Layer with clean heritage style
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap & Mạch Quan Họ',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      leafletMapRef.current = map;
      markersLayerRef.current = layerGroup;
    } catch (err) {
      console.warn('Leaflet map init error:', err);
    }

    // Attach global click event handler for dynamic "Xem chi tiết" buttons inside Leaflet Popups
    const handlePopupClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.map-popup-detail-btn') as HTMLElement;
      if (btn) {
        const locId = btn.getAttribute('data-id');
        if (locId) {
          const loc = locations.find((item) => String(item.id) === String(locId));
          if (loc) {
            setSelectedDetailLocation(loc);
          }
        }
      }
    };

    document.addEventListener('click', handlePopupClick);

    return () => {
      document.removeEventListener('click', handlePopupClick);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [config, loading]);

  const dynamicCategories = [
    { id: 'Tất cả', label: 'Tất cả điểm di sản', icon: '📍', color: '#8B263E' },
    ...((config.categories && config.categories.length > 0)
      ? config.categories.map((c) => ({
          id: c.name,
          label: c.name,
          icon: c.icon || '📍',
          color: c.color || '#8B263E',
        }))
      : []),
  ];

  // Filter locations by selected category & active status
  const filteredLocations = locations.filter((loc) => {
    if (loc.status === false) return false;
    if (selectedCategory === 'Tất cả') return true;
    return loc.category === selectedCategory;
  });

  // Update Markers when filteredLocations change
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredLocations.forEach((loc) => {
      // Determine pin color based on dynamic category config
      const matchingCat = dynamicCategories.find((c) => c.id === loc.category);
      const pinColor = matchingCat ? matchingCat.color : '#8B263E';

      const customIcon = L.divIcon({
        className: 'custom-map-marker-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Build HTML content for Popup
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; width: 260px; padding: 2px;">
          ${
            loc.image_url
              ? `<img src="${loc.image_url}" alt="${loc.title}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 12px; margin-bottom: 10px;" />`
              : ''
          }
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: ${pinColor}; letter-spacing: 0.5px; margin-bottom: 2px;">
            ${loc.category}
          </div>
          <h4 style="font-size: 15px; font-weight: 700; color: #1C1412; margin: 0 0 4px 0; line-height: 1.3;">
            ${loc.title}
          </h4>
          ${
            loc.address
              ? `<div style="font-size: 12px; color: #6B5A4E; margin-bottom: 8px; font-weight: 500;">
                  📍 ${loc.address}
                </div>`
              : ''
          }
          ${
            loc.summary
              ? `<p style="font-size: 12px; color: #4A3B32; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${loc.summary}
                </p>`
              : ''
          }
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button 
              data-id="${loc.id}" 
              class="map-popup-detail-btn"
              style="
                flex: 1;
                background-color: #2D241E;
                color: #FAF8F5;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: background-color 0.2s;
              "
            >
              Xem chi tiết
            </button>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                flex: 1;
                background-color: #8B263E;
                color: #ffffff;
                text-decoration: none;
                text-align: center;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                display: block;
              "
            >
              Chỉ đường
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon })
        .bindPopup(popupHtml, { maxWidth: 300, className: 'machquanho-leaflet-popup' });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredLocations]);

  // If on HomePage and no active map data exists in DB (or loading), hide section completely
  if (!standalonePage) {
    if (loading) return null;
    if (locations.filter(l => l.status !== false).length === 0) {
      return null;
    }
  }

  return (
    <section className={`w-full bg-[#FAF8F5] ${standalonePage ? 'py-8' : 'py-16'} border-t border-[#E8DCC4]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8B263E]/10 border border-[#8B263E]/20 text-[#8B263E] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4 text-[#8B263E]" />
            <span>Không gian Di sản Trực quan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-culture font-bold text-[#2D241E] tracking-tight">
            {config.title || 'BẢN ĐỒ MẠCH QUAN HỌ'}
          </h2>
          <p className="text-sm text-[#6B5A4E] font-medium">
            {config.subtitle || 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {dynamicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#2D241E] text-[#E5B567] border-[#2D241E] shadow-md scale-105'
                  : 'bg-white text-[#6B5A4E] border-[#E8DCC4] hover:bg-[#F2EBDC] hover:text-[#2D241E]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Map Container */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8DCC4] shadow-xl bg-white">
          <div
            ref={mapContainerRef}
            style={{ height: config.height || '600px', width: config.width || '100%' }}
            className="z-0"
          />

          {/* Map Footer Overlay Badge */}
          <div className="absolute bottom-4 left-4 z-10 bg-[#1C1412]/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-lg border border-[#382B26] hidden sm:flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#E5B567]" />
            <span>Đang hiển thị {filteredLocations.length} điểm di sản trên bản đồ</span>
          </div>
        </div>
      </div>

      {/* Full Detail Modal */}
      {selectedDetailLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E8DCC4] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Cover Header */}
            <div className="relative h-56 sm:h-72 w-full shrink-0 bg-[#1C1412]">
              {selectedDetailLocation.image_url ? (
                <img
                  src={selectedDetailLocation.image_url}
                  alt={selectedDetailLocation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1C1412] to-[#382520] flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-[#E5B567]/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setSelectedDetailLocation(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#8B263E] text-white border border-[#A8324E]">
                  {selectedDetailLocation.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-culture font-bold text-white tracking-wide">
                  {selectedDetailLocation.title}
                </h3>
                {selectedDetailLocation.address && (
                  <p className="text-xs text-[#E5B567] font-medium flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedDetailLocation.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-[#2D241E] flex-1">
              {selectedDetailLocation.summary && (
                <div className="p-4 rounded-2xl bg-[#F4EDE2] border-l-4 border-[#8B263E] text-sm italic font-serif text-[#4A3B32]">
                  "{selectedDetailLocation.summary}"
                </div>
              )}

              {/* Rich Text Formatted HTML Content */}
              {selectedDetailLocation.content ? (
                <div
                  className="prose prose-stone max-w-none text-sm leading-relaxed text-[#2D241E] space-y-3"
                  dangerouslySetInnerHTML={{ __html: selectedDetailLocation.content }}
                />
              ) : (
                <p className="text-xs text-[#A8988B] italic">Chưa có thông tin bài viết chi tiết.</p>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 bg-[#F2EBDC] border-t border-[#E8DCC4] flex items-center justify-between shrink-0">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDetailLocation.latitude},${selectedDetailLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#8B263E] hover:bg-[#751F33] text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Mở chỉ đường Google Maps</span>
              </a>

              <button
                onClick={() => setSelectedDetailLocation(null)}
                className="px-5 py-2.5 rounded-xl bg-[#2D241E] hover:bg-[#1C1412] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

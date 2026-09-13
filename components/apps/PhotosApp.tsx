import React, { useState } from 'react';
import { Image as ImageIcon, Wallpaper, Check, ZoomIn } from 'lucide-react';
import { ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface PhotosAppProps {
  theme: ThemeConfig;
  onSetWallpaper: (url: string) => void;
}

export const PhotosApp: React.FC<PhotosAppProps> = ({ theme, onSetWallpaper }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'wallpapers' | 'nature' | 'art'>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const photos = [
    {
      id: 'p1',
      title: 'Coral Fluid 3D Ribbon',
      category: 'wallpapers',
      url: '/wallpapers/coral-flow.jpg',
      author: 'Material You Studios',
    },
    {
      id: 'p2',
      title: 'Lavender Mist Curved Spheres',
      category: 'wallpapers',
      url: '/wallpapers/lavender-flow.jpg',
      author: 'Material You Studios',
    },
    {
      id: 'p3',
      title: 'Pastel Sky Cyan Wave',
      category: 'wallpapers',
      url: '/wallpapers/sky-flow.jpg',
      author: 'Material You Studios',
    },
    {
      id: 'p4',
      title: 'Pink Sunset Horizon',
      category: 'nature',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      author: 'Sean Oulashin',
    },
    {
      id: 'p5',
      title: 'Minimalist Architecture Curve',
      category: 'art',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      author: 'Danist Soh',
    },
    {
      id: 'p6',
      title: 'Botanical Fern Leaves',
      category: 'nature',
      url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
      author: 'Kari Shea',
    },
  ];

  const filtered = photos.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  return (
    <div className="flex flex-col h-full bg-[#fdfafb] text-gray-800 text-sm">
      {/* Category header */}
      <div
        className="p-3 px-6 border-b border-black/5 flex items-center justify-between"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-xs uppercase tracking-wider">
            Photo Gallery
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'wallpapers', 'nature', 'art'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUiClick();
                setActiveCategory(cat as any);
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#c85252] text-white shadow-xs'
                  : 'bg-black/5 hover:bg-black/10'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((photo) => {
            const isCurrentWp = theme.wallpaper === photo.url;

            return (
              <div
                key={photo.id}
                className="group relative rounded-3xl overflow-hidden border border-black/10 shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="p-3 bg-white/95 backdrop-blur-md flex items-center justify-between">
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs truncate">{photo.title}</div>
                    <div className="text-[10px] text-gray-500">{photo.author}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewImage(photo.url)}
                      title="Preview Full Size"
                      className="p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>

                    <button
                      onClick={() => {
                        playUiClick();
                        onSetWallpaper(photo.url);
                      }}
                      title="Set as Desktop Wallpaper"
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isCurrentWp
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#c85252] text-white hover:bg-[#b04242]'
                      }`}
                    >
                      {isCurrentWp ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Wallpaper className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] rounded-[36px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-center p-3 rounded-2xl bg-black/50 backdrop-blur-md text-white">
              <span className="text-xs font-semibold">High Resolution Wallpaper</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playUiClick();
                    onSetWallpaper(previewImage);
                    setPreviewImage(null);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#c85252] text-xs font-bold hover:bg-[#b04242] cursor-pointer"
                >
                  Set as Desktop Wallpaper
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold hover:bg-white/30 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

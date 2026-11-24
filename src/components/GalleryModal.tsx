import React from 'react';
import { Download, Trash2, X, Images } from 'lucide-react';
import { SavedStrip } from '../types/booth';

interface GalleryModalProps {
  isOpen: boolean;
  strips: SavedStrip[];
  onClose: () => void;
  onDownload: (strip: SavedStrip) => void;
  onDelete: (id: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  strips,
  onClose,
  onDownload,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1A2F]/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-[#FFFDF7] pop-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-[2.5px] border-[#2B1A2F] bg-[#FFF5EA] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2B1A2F] bg-[#D8B4F8]">
              <Images className="h-5 w-5 text-[#2B1A2F]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#2B1A2F]">
                Print Dispenser Tray
              </h2>
              <p className="text-xs font-medium text-[#564147]">
                {strips.length} {strips.length === 1 ? 'strip' : 'strips'} printed this session
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close gallery"
            onClick={onClose}
            className="pop-btn flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6EA7] text-[#2B1A2F] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="pop-scroll flex-1 overflow-y-auto p-6">
          {strips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFD9E3] text-2xl">
                ✧
              </div>
              <h3 className="font-display text-lg font-extrabold uppercase text-[#2B1A2F]">
                No Prints Yet
              </h3>
              <p className="max-w-sm text-sm font-medium text-[#564147]">
                Snap your poses in the booth and click Download or Save to Tray to collect your Purikura strips here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {strips.map((strip) => (
                <div
                  key={strip.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] bg-[#FFF5EA] p-4 pop-card-sm"
                >
                  <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl border-2 border-[#2B1A2F] bg-[#FFFDF7] p-2">
                    <img
                      src={strip.dataUrl}
                      alt={strip.caption || 'Saved Purikura strip'}
                      referrerPolicy="no-referrer"
                      className="max-h-full w-auto rounded-md object-contain shadow-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-xs font-extrabold uppercase text-[#2B1A2F]">
                        {strip.caption || 'PURIKURA POP'}
                      </p>
                      <p className="font-mono text-[10px] font-bold text-[#564147]">
                        {strip.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onDownload(strip)}
                        title="Download PNG"
                        className="pop-btn flex h-9 w-9 items-center justify-center rounded-full bg-[#7AE582] text-[#2B1A2F] cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(strip.id)}
                        title="Remove from tray"
                        className="pop-btn flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD9E3] text-[#71003C] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Download, Images, Sparkles } from 'lucide-react';
import {
  CameraViewfinder,
  CameraViewfinderHandle,
} from './components/CameraViewfinder';
import { ControlPanel } from './components/ControlPanel';
import { GalleryModal } from './components/GalleryModal';
import { StripCanvasEditor } from './components/StripCanvasEditor';
import { STRIP_LAYOUTS } from './data/boothPresets';
import {
  CapturedPhoto,
  CountdownOption,
  DecorateTab,
  DoodleStroke,
  FilterId,
  FrameStyleId,
  PlacedSticker,
  SavedStrip,
  StripLayoutId,
  StudioMode,
} from './types/booth';
import {
  playCountdownBeep,
  playShutterSound,
  playStickerPop,
} from './utils/sound';
import {
  generateSamplePosePhoto,
  renderStripToDataUrl,
} from './utils/stripExporter';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function triggerPngDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function App() {
  const cameraRef = useRef<CameraViewfinderHandle | null>(null);
  const shootRunIdRef = useRef(0);

  // Core Studio State
  const [mode, setMode] = useState<StudioMode>('capture');
  const [layoutId, setLayoutId] = useState<StripLayoutId>('strip-3');
  const [activeFilter, setActiveFilter] = useState<FilterId>('y2k-gloss');
  const [frameId, setFrameId] = useState<FrameStyleId>('glitter-pink');
  const [decorateTab, setDecorateTab] = useState<DecorateTab>('stickers');

  // Booth & Timer State
  const [countdownSeconds, setCountdownSeconds] = useState<CountdownOption>(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShooting, setIsShooting] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [currentShotNumber, setCurrentShotNumber] = useState(1);
  const [retakeSlotIndex, setRetakeSlotIndex] = useState<number | null>(null);
  const [flashTrigger, setFlashTrigger] = useState(0);

  // Strip Content State
  const [photos, setPhotos] = useState<(CapturedPhoto | null)[]>([
    null,
    null,
    null,
  ]);
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [doodles, setDoodles] = useState<DoodleStroke[]>([]);
  const [penColor, setPenColor] = useState('#FF6EA7');
  const [penSize, setPenSize] = useState(9);
  const [caption, setCaption] = useState('PURIKURA POP');
  const [showDateStamp, setShowDateStamp] = useState(true);

  // Export & Session Gallery State
  const [isExporting, setIsExporting] = useState(false);
  const [savedStrips, setSavedStrips] = useState<SavedStrip[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const layout = STRIP_LAYOUTS[layoutId];
  const capturedCount = photos.filter(Boolean).length;

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  // Adjust photos array length when switching layouts while preserving existing shots
  const handleLayoutChange = (nextLayoutId: StripLayoutId) => {
    const nextCount = STRIP_LAYOUTS[nextLayoutId].shotCount;
    setLayoutId(nextLayoutId);
    setPhotos((prev) => {
      const next: (CapturedPhoto | null)[] = Array(nextCount).fill(null);
      for (let i = 0; i < Math.min(prev.length, nextCount); i++) {
        next[i] = prev[i];
      }
      return next;
    });
    setRetakeSlotIndex(null);
  };

  const handleCancelShoot = useCallback(() => {
    shootRunIdRef.current += 1;
    setIsShooting(false);
    setCountdownValue(null);
  }, []);

  const runCaptureSequence = useCallback(
    async (targetSingleSlot: number | null = null) => {
      if (isShooting) return;

      const runId = ++shootRunIdRef.current;
      setIsShooting(true);
      setMode('capture');

      const slotsToShoot: number[] =
        targetSingleSlot !== null
          ? [targetSingleSlot]
          : Array.from({ length: layout.shotCount }, (_, i) => i);

      // If starting a fresh full shoot, clear existing photos first
      if (targetSingleSlot === null) {
        setPhotos(Array(layout.shotCount).fill(null));
      }

      for (let stepIdx = 0; stepIdx < slotsToShoot.length; stepIdx++) {
        const slotIndex = slotsToShoot[stepIdx];
        if (shootRunIdRef.current !== runId) return;

        setCurrentShotNumber(slotIndex + 1);

        // Countdown loop
        if (countdownSeconds > 0) {
          for (let sec: number = countdownSeconds; sec >= 1; sec--) {
            if (shootRunIdRef.current !== runId) return;
            setCountdownValue(sec);
            if (soundEnabled) {
              playCountdownBeep(sec === 1);
            }
            await sleep(1000);
          }
        } else {
          // Tiny visual beat even with timer off
          await sleep(180);
        }

        if (shootRunIdRef.current !== runId) return;
        setCountdownValue(null);

        // Flash + Shutter sound + Capture frame
        setFlashTrigger((n) => n + 1);
        if (soundEnabled) {
          playShutterSound();
        }

        const captured = cameraRef.current?.capturePhoto(slotIndex) ?? null;
        if (captured) {
          setPhotos((prev) => {
            const copy = [...prev];
            copy[slotIndex] = captured;
            return copy;
          });
        }

        // Brief breathing room between poses so user can strike next pose
        if (stepIdx < slotsToShoot.length - 1) {
          await sleep(750);
        }
      }

      if (shootRunIdRef.current !== runId) return;

      setIsShooting(false);
      setCountdownValue(null);
      setRetakeSlotIndex(null);

      // Wait briefly for flash to settle, then move into Decorate Studio
      await sleep(420);
      if (shootRunIdRef.current !== runId) return;
      setMode('decorate');
      showToast(
        targetSingleSlot !== null
          ? `Shot 0${targetSingleSlot + 1} updated! Ready to decorate or download.`
          : `All ${layout.shotCount} poses snapped! Decorate with stickers or save PNG.`
      );
    },
    [countdownSeconds, isShooting, layout.shotCount, showToast, soundEnabled]
  );

  // Trigger sample studio shoot for webcam-less users
  const handleSampleShoot = useCallback(() => {
    const samples = Array.from({ length: layout.shotCount }, (_, idx) =>
      generateSamplePosePhoto(idx, activeFilter)
    );
    setPhotos(samples);
    setFlashTrigger((n) => n + 1);
    if (soundEnabled) playShutterSound();
    setMode('decorate');
    showToast('Loaded sample studio poses! Try stickers, gel pen, and PNG download.');
  }, [activeFilter, layout.shotCount, showToast, soundEnabled]);

  // Handle manual image file uploads into photo slots
  const handleUploadFiles = useCallback(
    (files: FileList) => {
      const fileArray = Array.from(files).slice(0, layout.shotCount);
      if (fileArray.length === 0) return;

      Promise.all(
        fileArray.map(
          (file) =>
            new Promise<CapturedPhoto>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  dataUrl: String(reader.result),
                  filterId: activeFilter,
                  capturedAt: new Date().toISOString(),
                });
              reader.onerror = () => reject(new Error('Failed to read image'));
              reader.readAsDataURL(file);
            })
        )
      )
        .then((loaded) => {
          setPhotos((prev) => {
            const copy = [...prev];
            let cursor =
              retakeSlotIndex !== null
                ? retakeSlotIndex
                : copy.findIndex((p) => p === null);
            if (cursor === -1) cursor = 0;

            for (const photo of loaded) {
              if (cursor < copy.length) {
                copy[cursor] = photo;
                cursor += 1;
              }
            }
            return copy;
          });
          setRetakeSlotIndex(null);
          showToast(
            `Added ${loaded.length} ${loaded.length === 1 ? 'photo' : 'photos'} to your strip!`
          );
        })
        .catch(() => {
          showToast('Could not read one of the selected image files.');
        });
    },
    [activeFilter, layout.shotCount, retakeSlotIndex, showToast]
  );

  // Clicking a slot to retake it
  const handleRetakeSlot = (slotIndex: number) => {
    if (isShooting) return;
    setRetakeSlotIndex(slotIndex);
    setMode('capture');
    showToast(`Ready to retake Shot 0${slotIndex + 1} — press the shutter when ready!`);
  };

  // Sticker CRUD
  const handleAddSticker = (stickerId: string) => {
    const newSticker: PlacedSticker = {
      id: `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stickerId,
      x: 0.28 + Math.random() * 0.44,
      y: 0.2 + Math.random() * 0.55,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 20),
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    if (soundEnabled) playStickerPop();
  };

  const handleMoveSticker = useCallback((id: string, x: number, y: number) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s))
    );
  }, []);

  const handleUpdateSticker = (id: string, patch: Partial<PlacedSticker>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const handleDuplicateSticker = (id: string) => {
    const target = stickers.find((s) => s.id === id);
    if (!target) return;
    const clone: PlacedSticker = {
      ...target,
      id: `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: Math.min(0.92, target.x + 0.06),
      y: Math.min(0.92, target.y + 0.04),
    };
    setStickers((prev) => [...prev, clone]);
    setSelectedStickerId(clone.id);
    if (soundEnabled) playStickerPop();
  };

  const handleDeleteSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    setSelectedStickerId((curr) => (curr === id ? null : curr));
  }, []);

  // Export & Save PNG
  const exportStrip = async (triggerDownload: boolean) => {
    if (capturedCount === 0 || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await renderStripToDataUrl({
        layoutId,
        frameId,
        photos,
        stickers,
        doodles,
        caption,
        showDateStamp,
        scale: 2,
      });

      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      if (triggerDownload) {
        triggerPngDownload(dataUrl, `purikura-pop-${layoutId}-${stamp}.png`);
      }

      const newSaved: SavedStrip = {
        id: `strip-${Date.now()}`,
        dataUrl,
        createdAt: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        layoutId,
        frameId,
        caption: caption.trim() || 'PURIKURA POP',
      };
      setSavedStrips((prev) => [newSaved, ...prev]);

      showToast(
        triggerDownload
          ? 'Photo strip downloaded as PNG & saved to your Print Tray!'
          : 'Saved a copy to your Print Dispenser Tray!'
      );
    } catch {
      showToast('Export failed — please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard shortcuts (Spacebar shutter in Capture mode, Delete selected sticker in Decorate mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space' && mode === 'capture' && !isGalleryOpen) {
        e.preventDefault();
        if (isShooting) {
          handleCancelShoot();
        } else {
          runCaptureSequence(retakeSlotIndex);
        }
      }

      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        mode === 'decorate' &&
        selectedStickerId
      ) {
        e.preventDefault();
        handleDeleteSticker(selectedStickerId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleCancelShoot,
    handleDeleteSticker,
    isGalleryOpen,
    isShooting,
    mode,
    retakeSlotIndex,
    runCaptureSequence,
    selectedStickerId,
  ]);

  return (
    <div className="purikura-bg min-h-screen flex flex-col">
      {/* Clean 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b-[2.5px] border-[#2B1A2F] bg-[#FFFDF7]/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-4 py-3.5 sm:px-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => setMode('capture')}
            className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#2B1A2F] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Purikura Pop
          </button>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav className="flex items-center gap-5 sm:gap-8 text-sm font-bold text-[#564147]">
            <button
              type="button"
              onClick={() => setMode('capture')}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
                mode === 'capture'
                  ? 'border-b-[2.5px] border-[#FF6EA7] text-[#2B1A2F]'
                  : 'hover:text-[#2B1A2F]'
              }`}
            >
              Booth
            </button>
            <button
              type="button"
              onClick={() => setMode('decorate')}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
                mode === 'decorate'
                  ? 'border-b-[2.5px] border-[#FF6EA7] text-[#2B1A2F]'
                  : 'hover:text-[#2B1A2F]'
              }`}
            >
              Decorate
            </button>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="whitespace-nowrap shrink-0 pb-0.5 transition-colors hover:text-[#2B1A2F] cursor-pointer"
            >
              Print Tray{savedStrips.length > 0 ? ` (${savedStrips.length})` : ''}
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              disabled={capturedCount === 0 || isExporting}
              onClick={() => exportStrip(true)}
              className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#FF6EA7] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#2B1A2F] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download Strip</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main 12-Column Responsive Purikura Workspace */}
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 sm:px-8 lg:py-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT / CENTER STAGE (7 Columns) */}
          <div className="lg:col-span-7">
            {mode === 'capture' ? (
              <CameraViewfinder
                ref={cameraRef}
                activeFilter={activeFilter}
                countdownSeconds={countdownSeconds}
                onCountdownChange={setCountdownSeconds}
                isShooting={isShooting}
                countdownValue={countdownValue}
                currentShotNumber={currentShotNumber}
                totalShots={layout.shotCount}
                retakeSlotIndex={retakeSlotIndex}
                flashTrigger={flashTrigger}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((s) => !s)}
                onStartShoot={() => runCaptureSequence(retakeSlotIndex)}
                onCancelShoot={handleCancelShoot}
                onUploadFiles={handleUploadFiles}
                onSampleShoot={handleSampleShoot}
              />
            ) : (
              /* Interactive Photo Strip Decoration Stage */
              <div className="rounded-[2rem] bg-[#FFF5EA] p-5 sm:p-8 pop-card">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#2B1A2F]">
                      Decorate Your Strip
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-[#564147]">
                      {decorateTab === 'pen'
                        ? 'Gel Pen active — draw directly over your photos or border.'
                        : 'Drag stickers anywhere on your strip, or hover a photo to retake.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('capture')}
                      className="pop-btn inline-flex items-center gap-1.5 rounded-full bg-[#70D6FF] px-3.5 py-2 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer whitespace-nowrap"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Reshoot
                    </button>
                  </div>
                </div>

                {capturedCount === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border-2 border-dashed border-[#2B1A2F]/30 bg-[#FFFDF7] px-6 py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFD9E3]">
                      <Sparkles className="h-7 w-7 text-[#AB2B64]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-display text-lg font-extrabold uppercase text-[#2B1A2F]">
                        Your Film Strip Is Empty
                      </h2>
                      <p className="max-w-sm text-sm font-medium text-[#564147]">
                        Head back to the booth to snap photos with your webcam, or try sample poses right away.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setMode('capture')}
                        className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#FF6EA7] px-5 py-2.5 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        Open Webcam Booth
                      </button>
                      <button
                        type="button"
                        onClick={handleSampleShoot}
                        className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#7AE582] px-5 py-2.5 text-xs font-extrabold uppercase text-[#2B1A2F] cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        Load Sample Strip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border-2 border-[#2B1A2F]/15 bg-[#FFFDF7] p-5 sm:p-7">
                    <StripCanvasEditor
                      layoutId={layoutId}
                      frameId={frameId}
                      photos={photos}
                      stickers={stickers}
                      doodles={doodles}
                      caption={caption}
                      showDateStamp={showDateStamp}
                      interactive
                      isDrawingMode={decorateTab === 'pen'}
                      penColor={penColor}
                      penSize={penSize}
                      selectedStickerId={selectedStickerId}
                      onSelectSticker={setSelectedStickerId}
                      onMoveSticker={handleMoveSticker}
                      onDeleteSticker={handleDeleteSticker}
                      onAddDoodleStroke={(stroke) =>
                        setDoodles((prev) => [...prev, stroke])
                      }
                      onRetakeSlot={handleRetakeSlot}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT TOOLBOX & FILM STRIP PANEL (5 Columns) */}
          <div className="lg:col-span-5">
            <ControlPanel
              mode={mode}
              onModeChange={setMode}
              layoutId={layoutId}
              onLayoutChange={handleLayoutChange}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              frameId={frameId}
              onFrameChange={setFrameId}
              decorateTab={decorateTab}
              onDecorateTabChange={(tab) => {
                setDecorateTab(tab);
                if (tab === 'pen') setSelectedStickerId(null);
              }}
              photos={photos}
              stickers={stickers}
              doodles={doodles}
              selectedStickerId={selectedStickerId}
              onAddSticker={handleAddSticker}
              onUpdateSticker={handleUpdateSticker}
              onDuplicateSticker={handleDuplicateSticker}
              onDeleteSticker={handleDeleteSticker}
              onClearStickers={() => {
                setStickers([]);
                setSelectedStickerId(null);
              }}
              penColor={penColor}
              onPenColorChange={setPenColor}
              penSize={penSize}
              onPenSizeChange={setPenSize}
              onUndoDoodle={() => setDoodles((prev) => prev.slice(0, -1))}
              onClearDoodles={() => setDoodles([])}
              caption={caption}
              onCaptionChange={setCaption}
              showDateStamp={showDateStamp}
              onToggleDateStamp={() => setShowDateStamp((v) => !v)}
              onClearPhotos={() => {
                setPhotos(Array(layout.shotCount).fill(null));
                setRetakeSlotIndex(null);
              }}
              onRetakeSlot={handleRetakeSlot}
              onDownloadStrip={() => exportStrip(true)}
              onSaveToGallery={() => exportStrip(false)}
              isExporting={isExporting}
              isShooting={isShooting}
            />
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t-2 border-[#2B1A2F]/15 bg-[#FFFDF7]/80">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8 text-xs font-semibold text-[#564147]">
          <span>Purikura Pop · Private client-side webcam processing (photos never leave your browser)</span>
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="inline-flex items-center gap-1.5 font-bold text-[#2B1A2F] hover:text-[#AB2B64] cursor-pointer"
          >
            <Images className="h-3.5 w-3.5" />
            Open Print Tray ({savedStrips.length})
          </button>
        </div>
      </footer>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4">
          <div className="animate-pop-bounce inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFFDF7] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#2B1A2F] shadow-[4px_4px_0_#2B1A2F]">
            <span className="text-[#FF6EA7]">✧</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Session Print Dispenser Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        strips={savedStrips}
        onClose={() => setIsGalleryOpen(false)}
        onDownload={(strip) =>
          triggerPngDownload(strip.dataUrl, `purikura-pop-${strip.id}.png`)
        }
        onDelete={(id) =>
          setSavedStrips((prev) => prev.filter((s) => s.id !== id))
        }
      />
    </div>
  );
}

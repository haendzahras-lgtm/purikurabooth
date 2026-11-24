import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Camera,
  FlipHorizontal2,
  Grid2x2,
  RefreshCw,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  SwitchCamera,
  Square,
} from 'lucide-react';
import { getFilterById } from '../data/boothPresets';
import { CapturedPhoto, CountdownOption, FilterId } from '../types/booth';
import { formatRetroDate, generateSamplePosePhoto } from '../utils/stripExporter';

export interface CameraViewfinderHandle {
  capturePhoto: (shotIndex: number) => CapturedPhoto | null;
}

interface CameraViewfinderProps {
  activeFilter: FilterId;
  countdownSeconds: CountdownOption;
  onCountdownChange: (val: CountdownOption) => void;
  isShooting: boolean;
  countdownValue: number | null;
  currentShotNumber: number;
  totalShots: number;
  retakeSlotIndex: number | null;
  flashTrigger: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartShoot: () => void;
  onCancelShoot: () => void;
  onUploadFiles: (files: FileList) => void;
  onSampleShoot: () => void;
  onCameraReadyChange?: (ready: boolean) => void;
}

export const CameraViewfinder = forwardRef<CameraViewfinderHandle, CameraViewfinderProps>(
  function CameraViewfinder(
    {
      activeFilter,
      countdownSeconds,
      onCountdownChange,
      isShooting,
      countdownValue,
      currentShotNumber,
      totalShots,
      retakeSlotIndex,
      flashTrigger,
      soundEnabled,
      onToggleSound,
      onStartShoot,
      onCancelShoot,
      onUploadFiles,
      onSampleShoot,
      onCameraReadyChange,
    },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [cameraState, setCameraState] = useState<'loading' | 'ready' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isMirrored, setIsMirrored] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
    const [clockText, setClockText] = useState(() =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    );

    const filterDef = getFilterById(activeFilter);

    // Live camera HUD clock
    useEffect(() => {
      const interval = window.setInterval(() => {
        setClockText(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        );
      }, 1000);
      return () => window.clearInterval(interval);
    }, []);

    const stopStream = useCallback(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }, []);

    const startCamera = useCallback(
      async (mode: 'user' | 'environment') => {
        stopStream();
        setCameraState('loading');
        setErrorMessage('');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraState('error');
          setErrorMessage('Camera API is unavailable in this browser.');
          onCameraReadyChange?.(false);
          return;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 960 },
            },
            audio: false,
          });

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => {});
          }

          setCameraState('ready');
          onCameraReadyChange?.(true);

          // Detect multiple video input devices
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            setHasMultipleCameras(videoInputs.length > 1);
          } catch {
            // Ignore enumerate error
          }
        } catch (err) {
          const msg =
            err instanceof DOMException && err.name === 'NotAllowedError'
              ? 'Camera access was denied. Allow webcam permissions or upload photos below.'
              : 'No webcam detected right now. You can retry, upload your own photos, or test with sample poses.';
          setErrorMessage(msg);
          setCameraState('error');
          onCameraReadyChange?.(false);
        }
      },
      [onCameraReadyChange, stopStream]
    );

    useEffect(() => {
      startCamera(facingMode);
      return () => {
        stopStream();
      };
    }, [facingMode, startCamera, stopStream]);

    useImperativeHandle(
      ref,
      () => ({
        capturePhoto(shotIndex: number): CapturedPhoto | null {
          const video = videoRef.current;
          if (cameraState === 'ready' && video && video.videoWidth > 0 && video.videoHeight > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            ctx.save();
            if (isMirrored) {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            return {
              dataUrl: canvas.toDataURL('image/jpeg', 0.92),
              filterId: activeFilter,
              capturedAt: new Date().toISOString(),
            };
          }

          // Graceful studio fallback if triggered in demo mode
          return generateSamplePosePhoto(shotIndex, activeFilter);
        },
      }),
      [activeFilter, cameraState, isMirrored]
    );

    const handleSwitchCamera = () => {
      const next = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(next);
      setIsMirrored(next === 'user');
    };

    return (
      <div className="flex flex-col gap-5">
        {/* Main Toy-Camera Viewfinder Housing */}
        <div className="relative rounded-[2rem] bg-[#2B1A2F] p-2.5 sm:p-3 pop-card">
          {/* Inner Screen */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border-[2.5px] border-[#2B1A2F] bg-[#1E1022]">
            {/* Live Webcam Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover transition-opacity duration-200 ${
                cameraState === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: isMirrored ? 'scaleX(-1)' : 'none',
                filter: filterDef.cssFilter,
              }}
            />

            {/* Filter Color Tint Overlay */}
            {cameraState === 'ready' && filterDef.tintOverlay && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{ backgroundColor: filterDef.tintOverlay }}
              />
            )}

            {/* Loading State */}
            {cameraState === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#2B1A2F] p-6 text-center text-[#FFFDF7]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-[2.5px] border-[#FFFDF7] bg-[#FF6EA7] text-[#2B1A2F]">
                  <Camera className="h-6 w-6 animate-pulse" />
                </div>
                <p className="font-display text-lg font-bold tracking-tight">
                  Warming up the booth lens...
                </p>
                <p className="max-w-xs text-xs text-[#FFB0C9]">
                  Allow camera access when prompted to start snapping live Purikura strips.
                </p>
              </div>
            )}

            {/* Camera Unavailable / Permission Denied Fallback */}
            {cameraState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FFF5EA] p-6 text-center text-[#2B1A2F]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFD9E3] shadow-[3px_3px_0_#2B1A2F]">
                  <Camera className="h-6 w-6 text-[#AB2B64]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-tight">
                    Camera Standby Mode
                  </h3>
                  <p className="mx-auto max-w-sm text-sm font-medium text-[#564147]">
                    {errorMessage}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#70D6FF] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#2B1A2F]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Enable Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#FFFDF7] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#2B1A2F]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Photos
                  </button>
                  <button
                    type="button"
                    onClick={onSampleShoot}
                    className="pop-btn inline-flex items-center gap-2 rounded-full bg-[#FF6EA7] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#2B1A2F]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Try Sample Shoot
                  </button>
                </div>
              </div>
            )}

            {/* Crosshair / Rule-of-Thirds Guides */}
            {showGrid && cameraState === 'ready' && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/25" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/25" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/25" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/25" />
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/55" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-white/55" />
                </div>
              </div>
            )}

            {/* Purikura Viewfinder Corner Brackets + Star Cutouts */}
            <div className="pointer-events-none absolute inset-3 sm:inset-4 z-10">
              {/* Top-left bracket */}
              <div className="absolute left-0 top-0 h-7 w-7 rounded-tl-xl border-l-[3.5px] border-t-[3.5px] border-[#FFFDF7] drop-shadow-[0_1px_2px_rgba(43,26,47,0.8)]" />
              {/* Top-right bracket */}
              <div className="absolute right-0 top-0 h-7 w-7 rounded-tr-xl border-r-[3.5px] border-t-[3.5px] border-[#FFFDF7] drop-shadow-[0_1px_2px_rgba(43,26,47,0.8)]" />
              {/* Bottom-left bracket */}
              <div className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-xl border-b-[3.5px] border-l-[3.5px] border-[#FFFDF7] drop-shadow-[0_1px_2px_rgba(43,26,47,0.8)]" />
              {/* Bottom-right bracket */}
              <div className="absolute bottom-0 right-0 h-7 w-7 rounded-br-xl border-b-[3.5px] border-r-[3.5px] border-[#FFFDF7] drop-shadow-[0_1px_2px_rgba(43,26,47,0.8)]" />
            </div>

            {/* Top Camera HUD Bar */}
            <div className="pointer-events-none absolute left-5 right-5 top-5 z-20 flex items-center justify-between gap-2">
              {/* Live Ready / Shooting Status */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border-2 border-[#2B1A2F] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0_#2B1A2F] ${
                  isShooting
                    ? 'bg-[#FF6EA7] text-[#2B1A2F]'
                    : cameraState === 'ready'
                      ? 'bg-[#7AE582] text-[#2B1A2F]'
                      : 'bg-[#D8B4F8] text-[#2B1A2F]'
                }`}
              >
                <span className="font-mono">
                  {isShooting
                    ? retakeSlotIndex !== null
                      ? `RETAKE 0${retakeSlotIndex + 1}`
                      : `REC · SHOT ${currentShotNumber}/${totalShots}`
                    : cameraState === 'ready'
                      ? 'LIVE · READY'
                      : 'STANDBY'}
                </span>
              </div>

              {/* Filter & Timestamp HUD */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex items-center rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7]/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#2B1A2F] shadow-[2px_2px_0_#2B1A2F]">
                  ✧ {filterDef.name}
                </div>
                <div className="inline-flex items-center rounded-full border-2 border-[#2B1A2F] bg-[#2B1A2F]/90 px-3 py-1 font-mono text-[11px] font-bold tabular-nums text-[#FFFDF7] shadow-[2px_2px_0_#FF6EA7]">
                  {formatRetroDate()} {clockText}
                </div>
              </div>
            </div>

            {/* Giant Pop Countdown Overlay */}
            {countdownValue !== null && countdownValue > 0 && (
              <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#2B1A2F]/20 backdrop-blur-[1px]">
                <div
                  key={countdownValue}
                  className="animate-pop-bounce flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-[4px] border-[#2B1A2F] bg-[#FF6EA7] shadow-[6px_6px_0_#2B1A2F]"
                >
                  <span className="font-display text-7xl sm:text-8xl font-extrabold tabular-nums text-[#FFFDF7] drop-shadow-[3px_3px_0_#2B1A2F]">
                    {countdownValue}
                  </span>
                </div>
                <div className="mt-4 rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7] px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[#2B1A2F] shadow-[3px_3px_0_#2B1A2F]">
                  {retakeSlotIndex !== null
                    ? `Strike a pose for Shot 0${retakeSlotIndex + 1}!`
                    : `Pose ${currentShotNumber} of ${totalShots} · Smile!`}
                </div>
              </div>
            )}

            {/* White Camera Flash Burst */}
            {flashTrigger > 0 && (
              <div
                key={flashTrigger}
                className="animate-shutter-flash pointer-events-none absolute inset-0 z-40 bg-white"
              />
            )}
          </div>
        </div>

        {/* Tactile Arcade Shutter & Controls Deck */}
        <div className="rounded-[2rem] bg-[#FFF5EA] p-4 sm:p-5 pop-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Group: Countdown Timer Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#564147]">
                Timer
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#2B1A2F] bg-[#FFFDF7] p-1">
                {([0, 3, 5] as CountdownOption[]).map((sec) => {
                  const active = countdownSeconds === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      disabled={isShooting}
                      onClick={() => onCountdownChange(sec)}
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
                        active
                          ? 'border-[1.5px] border-[#2B1A2F] bg-[#70D6FF] text-[#2B1A2F] shadow-[2px_2px_0_#2B1A2F]'
                          : 'text-[#564147] hover:text-[#2B1A2F]'
                      }`}
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center Focal Anchor: Iconic Concentric Shutter Trigger */}
            <div className="flex items-center gap-3">
              {!isShooting ? (
                <button
                  type="button"
                  onClick={onStartShoot}
                  className="pop-btn group relative inline-flex items-center gap-3 rounded-full bg-[#FF6EA7] py-2.5 pl-3 pr-6 text-[#2B1A2F] cursor-pointer"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-[#2B1A2F] bg-[#FFFDF7] shadow-[inset_0_2px_0_rgba(255,255,255,0.8)] transition-transform group-hover:scale-105">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2B1A2F] bg-[#FF6EA7] text-sm font-black text-[#FFFDF7]">
                      ✧
                    </span>
                  </span>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-display text-base font-extrabold uppercase leading-tight tracking-tight text-[#2B1A2F]">
                      {retakeSlotIndex !== null
                        ? `Retake Shot 0${retakeSlotIndex + 1}`
                        : `Start ${totalShots}-Shot Booth`}
                    </span>
                    <span className="text-[11px] font-bold text-[#71003C]">
                      {countdownSeconds > 0
                        ? `${countdownSeconds}s countdown · Spacebar`
                        : 'Instant shutter · Spacebar'}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancelShoot}
                  className="pop-btn inline-flex items-center gap-2.5 rounded-full bg-[#FFD9E3] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#71003C] cursor-pointer"
                >
                  <Square className="h-4 w-4 fill-current" />
                  Stop Sequence
                </button>
              )}
            </div>

            {/* Right Group: Hardware / Booth Utility Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                title={isMirrored ? 'Mirror On' : 'Mirror Off'}
                aria-label="Toggle mirror view"
                onClick={() => setIsMirrored((m) => !m)}
                className={`pop-btn flex h-11 w-11 items-center justify-center rounded-full cursor-pointer ${
                  isMirrored ? 'bg-[#D8B4F8]' : 'bg-[#FFFDF7]'
                }`}
              >
                <FlipHorizontal2 className="h-4 w-4 text-[#2B1A2F]" />
              </button>

              {hasMultipleCameras && (
                <button
                  type="button"
                  title="Switch Camera"
                  aria-label="Switch front or rear camera"
                  onClick={handleSwitchCamera}
                  className="pop-btn flex h-11 w-11 items-center justify-center rounded-full bg-[#70D6FF] cursor-pointer"
                >
                  <SwitchCamera className="h-4 w-4 text-[#2B1A2F]" />
                </button>
              )}

              <button
                type="button"
                title={showGrid ? 'Hide Grid' : 'Show Grid'}
                aria-label="Toggle camera grid guides"
                onClick={() => setShowGrid((g) => !g)}
                className={`pop-btn flex h-11 w-11 items-center justify-center rounded-full cursor-pointer ${
                  showGrid ? 'bg-[#7AE582]' : 'bg-[#FFFDF7]'
                }`}
              >
                <Grid2x2 className="h-4 w-4 text-[#2B1A2F]" />
              </button>

              <button
                type="button"
                title={soundEnabled ? 'Mute Booth Audio' : 'Enable Booth Audio'}
                aria-label="Toggle sound effects"
                onClick={onToggleSound}
                className={`pop-btn flex h-11 w-11 items-center justify-center rounded-full cursor-pointer ${
                  soundEnabled ? 'bg-[#70D6FF]' : 'bg-[#FFFDF7]'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-[#2B1A2F]" />
                ) : (
                  <VolumeX className="h-4 w-4 text-[#564147]" />
                )}
              </button>

              <button
                type="button"
                title="Upload Photo from Device"
                aria-label="Upload photo from device"
                onClick={() => fileInputRef.current?.click()}
                className="pop-btn flex h-11 w-11 items-center justify-center rounded-full bg-[#FFFDF7] cursor-pointer"
              >
                <Upload className="h-4 w-4 text-[#2B1A2F]" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUploadFiles(e.target.files);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    );
  }
);

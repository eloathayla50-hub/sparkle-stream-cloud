import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward,
  Maximize, Minimize, ArrowLeft, Volume2, VolumeX
} from "lucide-react";
import { getProxyUrl } from "@/lib/api";

interface VideoPlayerProps {
  url: string;
  title: string;
  onBack: () => void;
}

export function VideoPlayer({ url, title, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);

  const proxyUrl = getProxyUrl(url);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [playing, resetHideTimer]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play();
    }
    setPlaying(!playing);
    resetHideTimer();
  };

  const seek = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.currentTime + seconds, duration));
    resetHideTimer();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    v.currentTime = pos * duration;
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex flex-col"
      onClick={resetHideTimer}
      onMouseMove={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={proxyUrl}
        className="w-full h-full object-contain bg-background"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        muted={muted}
        playsInline
        onClick={togglePlay}
      />

      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)' }}
      >
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="btn-player w-10 h-10 bg-secondary/80">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-display text-sm font-bold truncate">{title}</h3>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button onClick={() => seek(-10)} className="btn-player w-12 h-12">
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="btn-player w-16 h-16 bg-primary/90 text-primary-foreground hover:bg-primary"
          >
            {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={() => seek(10)} className="btn-player w-12 h-12">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <div className="progress-bar-3d" onClick={handleProgressClick}>
            <div
              className="progress-fill"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setMuted(!muted)} className="btn-player w-8 h-8">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={toggleFullscreen} className="btn-player w-8 h-8">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
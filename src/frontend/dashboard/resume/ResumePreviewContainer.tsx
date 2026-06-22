import {
  Expand,
  FileText,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import ResumePreview from './ResumePreview';

type ZoomLevel = 'fit-width' | 'fit-page' | number;

const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const A4_ASPECT_RATIO = 297 / 210;

function ResumePreviewContainer() {
  const [zoom, setZoom] = useState<ZoomLevel>('fit-width');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const { watch } = useFormContext<ResumeInfo>();
  const formValues = watch();

  const calculatePageCount = useCallback(() => {
    if (!paperRef.current) return;
    const contentHeight = paperRef.current.scrollHeight;
    const pageHeight = 1056;
    const pages = Math.max(1, Math.ceil(contentHeight / pageHeight));
    setPageCount(pages);
  }, []);

  useEffect(() => {
    calculatePageCount();
    const timer = setTimeout(calculatePageCount, 100);
    return () => clearTimeout(timer);
  }, [formValues, calculatePageCount]);

  const getZoomScale = useCallback(() => {
    if (typeof zoom === 'number') return zoom;
    if (!containerRef.current) return 1;

    const containerWidth = containerRef.current.clientWidth - 48;
    const containerHeight = containerRef.current.clientHeight - 48;
    const paperWidth = 816;
    const paperHeight = 1056;

    if (zoom === 'fit-width') {
      return Math.min(1, containerWidth / paperWidth);
    }

    const scaleX = containerWidth / paperWidth;
    const scaleY = containerHeight / paperHeight;
    return Math.min(scaleX, scaleY, 1);
  }, [zoom]);

  const handleZoomIn = () => {
    const current = typeof zoom === 'number' ? zoom : getZoomScale();
    const nextPreset = ZOOM_PRESETS.find((p) => p > current + 0.05);
    setZoom(nextPreset ?? 2);
  };

  const handleZoomOut = () => {
    const current = typeof zoom === 'number' ? zoom : getZoomScale();
    const prevPreset = [...ZOOM_PRESETS].reverse().find((p) => p < current - 0.05);
    setZoom(prevPreset ?? 0.5);
  };

  const handleResetZoom = () => {
    setZoom('fit-width');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      fullscreenRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const scale = getZoomScale();
  const zoomPercentage = Math.round(scale * 100);

  const hasContent =
    formValues.firstName ||
    formValues.lastName ||
    formValues.summary ||
    (formValues.experience && formValues.experience.length > 0) ||
    (formValues.skills && formValues.skills.length > 0);

  return (
    <div
      ref={fullscreenRef}
      className={cn(
        'flex flex-col rounded-xl border bg-muted/30 overflow-hidden',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[calc(100vh-12rem)]'
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomPercentage <= 50}
            className="h-8 w-8 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]"
          >
            {zoomPercentage}%
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomPercentage >= 200}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom('fit-width')}
            className={cn('h-8 px-2 text-xs', zoom === 'fit-width' && 'bg-muted')}
          >
            <Expand className="w-3 h-3 mr-1" />
            Fit
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Page indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span>
              {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </span>
            {pageCount > 1 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">(Multi-page)</span>
            )}
          </div>

          <div className="w-px h-4 bg-border mx-1" />

          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-auto p-6',
          'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]',
          'from-muted/50 to-muted/80'
        )}
      >
        <div
          className="mx-auto transition-transform duration-200 origin-top"
          style={{
            width: 816,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Paper with shadow */}
          <div
            ref={paperRef}
            className={cn(
              'relative bg-white shadow-2xl',
              'ring-1 ring-black/5',
              'before:absolute before:inset-0 before:shadow-[0_0_0_1px_rgba(0,0,0,0.05)]',
              '[&_#resume-preview]:min-h-[1056px]'
            )}
            style={{
              minHeight: 1056,
            }}
          >
            <ResumePreview />

            {/* Empty state overlay */}
            {!hasContent && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-[1px]">
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Start building your resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form on the left and watch your resume come to life in real-time.
                  </p>
                </div>
              </div>
            )}

            {/* Page break indicators */}
            {pageCount > 1 && (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-red-300 pointer-events-none"
                style={{ top: 1056 }}
              >
                <span className="absolute -top-3 left-4 text-[10px] font-medium text-red-500 bg-white px-1.5 py-0.5 rounded">
                  Page break
                </span>
              </div>
            )}
          </div>

          {/* Paper shadow base */}
          <div className="h-2 mx-4 bg-gradient-to-b from-black/10 to-transparent rounded-b-lg" />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t bg-muted/50 text-xs text-muted-foreground">
        <span>A4 · 210 × 297 mm</span>
        <span>Real-time preview</span>
      </div>
    </div>
  );
}

export default ResumePreviewContainer;

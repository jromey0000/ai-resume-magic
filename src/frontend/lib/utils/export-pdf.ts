import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export type ExportQuality = 'standard' | 'high';
export type PaperSize = 'a4' | 'letter';
export type ExportStep = 'validating' | 'preparing' | 'rendering' | 'generating' | 'complete';

export interface ExportPdfOptions {
  quality?: ExportQuality;
  paperSize?: PaperSize;
  onProgress?: (step: ExportStep, progress: number) => void;
}

const QUALITY_SCALE: Record<ExportQuality, number> = {
  standard: 1.5,
  high: 2,
};

const PAPER_FORMATS: Record<PaperSize, [number, number]> = {
  a4: [210, 297],
  letter: [215.9, 279.4],
};

const RESUME_WIDTH_PX = 816;
const RESUME_HEIGHT_PX = 1056;
const CANVAS_TIMEOUT_MS = 20000;
const FONT_LOAD_TIMEOUT_MS = 5000;
const EXPORT_TIMEOUT_MS = 45000;

let renderLock: Promise<void> = Promise.resolve();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function withRenderLock<T>(fn: () => Promise<T>): Promise<T> {
  const previous = renderLock;
  let releaseLock!: () => void;
  renderLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });

  await previous;
  try {
    return await fn();
  } finally {
    releaseLock();
  }
}

async function waitForFonts(): Promise<void> {
  if (!document.fonts?.ready) return;
  await withTimeout(document.fonts.ready, FONT_LOAD_TIMEOUT_MS, 'Font loading');
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 200);
}

function findResumePreviewElement(elementId: string): HTMLElement {
  const requested = document.getElementById(elementId);
  if (requested) return requested;

  for (const id of ['resume-preview', 'export-modal-preview']) {
    const candidate = document.getElementById(id);
    if (candidate) return candidate;
  }

  throw new Error('Resume preview element not found');
}

function createExportContainer(): HTMLDivElement {
  removeExportContainer();

  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: ${RESUME_WIDTH_PX}px;
    z-index: -1;
    pointer-events: none;
    background: white;
    overflow: visible;
  `;
  document.body.appendChild(container);
  return container;
}

function removeExportContainer(): void {
  const container = document.getElementById('pdf-export-container');
  if (container) {
    document.body.removeChild(container);
  }
}

function prepareClone(element: HTMLElement, cloneId: string): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = cloneId;
  clone.style.width = `${RESUME_WIDTH_PX}px`;
  clone.style.minHeight = `${RESUME_HEIGHT_PX}px`;
  clone.style.transform = 'none';
  clone.style.position = 'static';
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.style.boxShadow = 'none';
  return clone;
}

const UNSUPPORTED_COLOR_PATTERN = /\b(oklch|oklab|lab|lch|color)\(/i;

function hasUnsupportedColor(value: string): boolean {
  return UNSUPPORTED_COLOR_PATTERN.test(value);
}

const INLINE_STYLE_PROPS = [
  'display',
  'position',
  'box-sizing',
  'width',
  'height',
  'min-height',
  'max-width',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-radius',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-decoration',
  'text-transform',
  'white-space',
  'word-break',
  'flex',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'gap',
  'flex-shrink',
  'grid-template-columns',
  'opacity',
  'overflow',
] as const;

function getExportableChildren(element: Element): Element[] {
  return Array.from(element.children).filter((child) => child.tagName !== 'SVG');
}

function inlineComputedStyles(source: Element, target: Element, win: Window): void {
  if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) return;

  const computed = win.getComputedStyle(source);

  for (const prop of INLINE_STYLE_PROPS) {
    const value = computed.getPropertyValue(prop);
    if (!value || value === 'none' || value === 'normal') continue;
    if (hasUnsupportedColor(value)) continue;
    target.style.setProperty(prop, value);
  }

  const colorProps = [
    'color',
    'background-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
    'text-decoration-color',
  ] as const;

  for (const prop of colorProps) {
    const value = computed.getPropertyValue(prop);
    if (!value || value === 'transparent') continue;
    if (hasUnsupportedColor(value)) continue;
    target.style.setProperty(prop, value);
  }

  const boxShadow = computed.boxShadow;
  if (boxShadow && boxShadow !== 'none' && !hasUnsupportedColor(boxShadow)) {
    target.style.boxShadow = boxShadow;
  }

  target.removeAttribute('class');

  const sourceChildren = getExportableChildren(source);
  const targetChildren = getExportableChildren(target);
  const childCount = Math.min(sourceChildren.length, targetChildren.length);

  for (let i = 0; i < childCount; i++) {
    inlineComputedStyles(sourceChildren[i], targetChildren[i], win);
  }
}

function prepareCloneForCanvas(
  clonedDoc: Document,
  clonedElement: HTMLElement,
  sourceElement: HTMLElement
): void {
  clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => node.remove());
  clonedElement.querySelectorAll('svg').forEach((svg) => svg.remove());
  clonedElement.querySelectorAll('[class*="animate-"]').forEach((el) => {
    el.classList.forEach((className) => {
      if (className.startsWith('animate-')) {
        el.classList.remove(className);
      }
    });
  });
  inlineComputedStyles(sourceElement, clonedElement, window);
}

async function captureResumeCanvas(
  element: HTMLElement,
  cloneId: string,
  quality: ExportQuality
): Promise<HTMLCanvasElement> {
  return withRenderLock(async () => {
    const exportContainer = createExportContainer();

    try {
      const clone = prepareClone(element, cloneId);
      exportContainer.appendChild(clone);

      await waitForFonts();
      await delay(100);

      // Force layout so scrollHeight is accurate before capture
      const contentHeight = Math.max(clone.scrollHeight, RESUME_HEIGHT_PX);

      const canvasPromise = html2canvas(clone, {
        scale: QUALITY_SCALE[quality],
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: RESUME_WIDTH_PX,
        height: contentHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, clonedElement) => {
          prepareCloneForCanvas(clonedDoc, clonedElement, element);
        },
      });

      return await withTimeout(canvasPromise, CANVAS_TIMEOUT_MS, 'Rendering resume');
    } finally {
      removeExportContainer();
    }
  });
}

export async function exportResumeToPdf(
  elementId: string,
  filename: string,
  options: ExportPdfOptions = {}
): Promise<void> {
  const exportOperation = async () => {
    const { quality = 'standard', paperSize = 'a4', onProgress } = options;

    onProgress?.('preparing', 10);

    const element = findResumePreviewElement(elementId);

    onProgress?.('preparing', 25);
    onProgress?.('rendering', 40);

    const canvas = await captureResumeCanvas(element, 'resume-preview-export-clone', quality);

    onProgress?.('rendering', 60);

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    onProgress?.('generating', 70);

    const [pageWidthMm, pageHeightMm] = PAPER_FORMATS[paperSize];
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageWidthMm, pageHeightMm],
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    onProgress?.('generating', 80);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    onProgress?.('generating', 95);

    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    const pdfBlob = pdf.output('blob');
    triggerDownload(pdfBlob, finalFilename);

    onProgress?.('complete', 100);
  };

  await withTimeout(exportOperation(), EXPORT_TIMEOUT_MS, 'PDF export');
}

export async function generatePdfPreview(
  elementId: string,
  options: { quality?: ExportQuality; paperSize?: PaperSize } = {}
): Promise<string> {
  const { quality = 'standard' } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  const canvas = await captureResumeCanvas(element, 'resume-preview-clone', quality);
  return canvas.toDataURL('image/jpeg', 0.85);
}

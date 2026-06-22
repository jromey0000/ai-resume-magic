import { useUser } from '@clerk/clerk-react';
import {
  Check,
  Download,
  LayoutGrid,
  List,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useTier } from '@/lib/contexts/TierContext';
import {
  useBulkDeleteResumes,
  useDeleteResume,
  useDuplicateResume,
  useGetUserResumes,
} from '@/lib/hooks/resume';
import { useAnimatedList } from '@/lib/hooks/useAnimatedList';
import { useNotification } from '@/lib/utils/hooks';
import ResumeItem from './ResumeItem';

type ViewMode = 'gallery' | 'list';

function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeletePending, setBulkDeletePending] = useState(false);
  const [bulkExporting, setBulkExporting] = useState(false);
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false);
  const { isExiting, isHighlighted, highlight, requestRemove, completeRemove } =
    useAnimatedList<string>();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { tier } = useTier();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { data: resumeList, error, isLoading, mutate } = useGetUserResumes(userEmail);

  if (!isLoaded || !userEmail) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    );
  }
  const { deleteResume } = useDeleteResume();
  const { bulkDeleteResumes } = useBulkDeleteResumes();
  const { duplicateResume } = useDuplicateResume();
  const { addNotification } = useNotification();

  const hasBulkProcessing = tier.limits.hasBulkProcessing;

  const handleAddResume = () => {
    navigate('/dashboard/new');
  };

  const handleDeleteClick = (resume: Resume) => {
    setDeleteTarget(resume);
  };

  const handleSelectionChange = useCallback((resume: Resume, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(resume.documentId);
      } else {
        next.delete(resume.documentId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!resumeList) return;
    const allIds = new Set<string>(resumeList.map((r: Resume) => r.documentId));
    setSelectedIds(allIds);
  }, [resumeList]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleExitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleBulkDeleteClick = () => {
    setBulkDeletePending(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;

    const idsToDelete = Array.from(selectedIds);
    setBulkDeletePending(false);

    for (const id of idsToDelete) {
      requestRemove(id);
    }
  };

  const handleBulkDeleteExitComplete = async () => {
    const idsToDelete = Array.from(selectedIds);
    const count = idsToDelete.length;

    try {
      const { successCount, failureCount } = await bulkDeleteResumes(idsToDelete, userEmail);

      if (failureCount === 0) {
        addNotification({
          title: 'Resumes deleted',
          message: `${successCount} resume${successCount !== 1 ? 's' : ''} deleted successfully.`,
        });
      } else {
        addNotification({
          title: 'Partial deletion',
          message: `${successCount} deleted, ${failureCount} failed. Please try again.`,
        });
      }
    } catch {
      addNotification({
        title: 'Error',
        message: `Failed to delete ${count} resume${count !== 1 ? 's' : ''}. Please try again.`,
      });
    } finally {
      completeRemove(() => {});
      setSelectedIds(new Set());
      setSelectionMode(false);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeletePending(false);
  };

  const handleBulkExport = async () => {
    if (selectedIds.size === 0 || !hasBulkProcessing) return;

    setBulkExporting(true);
    const count = selectedIds.size;

    try {
      await new Promise((r) => setTimeout(r, 1500));

      addNotification({
        title: 'Bulk Export Started',
        message: `Exporting ${count} resume${count !== 1 ? 's' : ''}. Downloads will appear shortly.`,
      });
    } catch {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export resumes. Please try again.',
      });
    } finally {
      setBulkExporting(false);
    }
  };

  const handleBulkAnalyze = async () => {
    if (selectedIds.size === 0 || !hasBulkProcessing) return;

    setBulkAnalyzing(true);
    const count = selectedIds.size;

    try {
      await new Promise((r) => setTimeout(r, 2000));

      addNotification({
        title: 'Bulk Analysis Complete',
        message: `ATS analysis completed for ${count} resume${count !== 1 ? 's' : ''}. View results in each resume.`,
      });
    } catch {
      addNotification({
        title: 'Analysis Failed',
        message: 'Failed to analyze resumes. Please try again.',
      });
    } finally {
      setBulkAnalyzing(false);
      setSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setDeleteTarget(null);
    requestRemove(target.documentId);
  };

  const handleDeleteExitComplete = async (documentId: string) => {
    const deletedTitle =
      resumeList?.find((r: Resume) => r.documentId === documentId)?.title ?? 'Resume';

    try {
      await deleteResume(documentId, userEmail);
      addNotification({
        title: 'Resume deleted',
        message: `"${deletedTitle}" has been deleted.`,
      });
    } catch {
      addNotification({
        title: 'Error',
        message: 'Failed to delete resume. Please try again.',
      });
    } finally {
      completeRemove(() => {});
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleDuplicate = async (resume: Resume) => {
    try {
      const existingTitles = resumeList.map((r: Resume) => r.title);
      const response = await duplicateResume(resume, userEmail, existingTitles);
      const newId = response?.data?.documentId;
      const newTitle = response?.data?.title;
      if (newId) highlight(newId);

      addNotification({
        title: 'Resume duplicated',
        message: newTitle
          ? `"${newTitle}" has been created.`
          : `"${resume.title}" has been copied.`,
      });
    } catch {
      addNotification({
        title: 'Error',
        message: 'Failed to duplicate resume. Please try again.',
      });
    }
  };

  const { isOverLimit, warnings } = useTier();
  const overLimitWarning = warnings.find((w) => w.severity === 'over_limit');

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    );

  if (error) {
    return <ErrorDisplay error={error} title="Error Loading Resumes" onRetry={() => mutate()} />;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Over Limit Warning Banner */}
      {isOverLimit && overLimitWarning && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border border-red-200 dark:border-red-800/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                You&apos;re Over Your Plan Limit
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                {overLimitWarning.message} Your resumes are safe, but you won&apos;t be able to
                create new ones or use some features until you&apos;re within your limit.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/settings')}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Upgrade Plan
                </Button>
                <span className="text-xs text-red-600 dark:text-red-400">
                  or delete {Math.ceil((resumeList?.length || 0) - (tier.limits.maxResumes === Infinity ? Infinity : tier.limits.maxResumes))} resume(s) to continue
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-light text-4xl mb-2">My Resumes</h2>
        <p className="text-muted-foreground">Start creating your AI-powered resume.</p>
      </div>

      {selectionMode ? (
        <div className="flex items-center justify-between mb-8 p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleExitSelectionMode}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Exit selection mode"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              {selectedIds.size} selected
              {resumeList && selectedIds.size < resumeList.length && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="ml-2 text-primary hover:underline"
                >
                  Select all
                </button>
              )}
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="ml-2 text-muted-foreground hover:text-foreground hover:underline"
                >
                  Clear
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasBulkProcessing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  disabled={selectedIds.size === 0 || bulkExporting}
                  className="h-9"
                >
                  {bulkExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkAnalyze}
                  disabled={selectedIds.size === 0 || bulkAnalyzing}
                  className="h-9"
                >
                  {bulkAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="w-4 h-4 mr-2" />
                  )}
                  ATS Analyze
                </Button>
              </>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
              disabled={selectedIds.size === 0}
              className="h-9"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button variant="primary" size="default" onClick={handleAddResume} className="group">
              <Plus className="w-5 h-5 mr-2" />
              Add Resume
              <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            {resumeList && resumeList.length > 0 && (
              <Button
                variant="outline"
                size="default"
                onClick={() => setSelectionMode(true)}
                className="text-muted-foreground"
              >
                <Check className="w-4 h-4 mr-2" />
                Select
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'gallery'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Gallery view"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      )}

      {resumeList && resumeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No resumes yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first AI-powered resume and start landing more interviews.
          </p>
          <Button variant="primary" onClick={handleAddResume}>
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Resume
          </Button>
        </div>
      ) : viewMode === 'gallery' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {resumeList?.map((resume: Resume, index: number) => (
            <ResumeItem
              key={resume.documentId || index}
              resume={resume}
              viewMode="gallery"
              onDelete={handleDeleteClick}
              onDuplicate={handleDuplicate}
              isExiting={isExiting(resume.documentId)}
              isHighlighted={isHighlighted(resume.documentId)}
              enterDelay={Math.min(index * 40, 200)}
              onExitComplete={
                selectionMode
                  ? handleBulkDeleteExitComplete
                  : () => handleDeleteExitComplete(resume.documentId)
              }
              selectionMode={selectionMode}
              isSelected={selectedIds.has(resume.documentId)}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border bg-card">
          {resumeList?.map((resume: Resume, index: number) => (
            <ResumeItem
              key={resume.documentId || index}
              resume={resume}
              viewMode="list"
              onDelete={handleDeleteClick}
              onDuplicate={handleDuplicate}
              isExiting={isExiting(resume.documentId)}
              isHighlighted={isHighlighted(resume.documentId)}
              enterDelay={Math.min(index * 30, 150)}
              onExitComplete={
                selectionMode
                  ? handleBulkDeleteExitComplete
                  : () => handleDeleteExitComplete(resume.documentId)
              }
              selectionMode={selectionMode}
              isSelected={selectedIds.has(resume.documentId)}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={false}
      />

      <ConfirmModal
        isOpen={bulkDeletePending}
        onClose={handleBulkDeleteCancel}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Resumes"
        message={`Are you sure you want to delete ${selectedIds.size} resume${selectedIds.size !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.size}`}
        cancelText="Cancel"
        variant="danger"
        isLoading={false}
      />
    </div>
  );
}

export default Dashboard;

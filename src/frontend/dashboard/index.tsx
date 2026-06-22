import { useUser } from '@clerk/clerk-react';
import { LayoutGrid, List, Loader2, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useDeleteResume, useDuplicateResume, useGetUserResumes } from '@/lib/hooks/resume';
import { useAnimatedList } from '@/lib/hooks/useAnimatedList';
import { useNotification } from '@/lib/utils/hooks';
import ResumeItem from './ResumeItem';

type ViewMode = 'gallery' | 'list';

function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);
  const { isExiting, isHighlighted, highlight, requestRemove, completeRemove } =
    useAnimatedList<string>();
  const { user } = useUser();
  const navigate = useNavigate();
  const userEmail = user?.primaryEmailAddress?.emailAddress as string;
  const { data: resumeList, error, isLoading, mutate } = useGetUserResumes(userEmail);
  const { deleteResume } = useDeleteResume();
  const { duplicateResume } = useDuplicateResume();
  const { addNotification } = useNotification();

  const handleAddResume = () => {
    navigate('/dashboard/new');
  };

  const handleDeleteClick = (resume: Resume) => {
    setDeleteTarget(resume);
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
      <div className="mb-8">
        <h2 className="font-light text-4xl mb-2">My Resumes</h2>
        <p className="text-muted-foreground">Start creating your AI-powered resume.</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <Button variant="primary" size="default" onClick={handleAddResume} className="group">
          <Plus className="w-5 h-5 mr-2" />
          Add Resume
          <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>

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
              onExitComplete={() => handleDeleteExitComplete(resume.documentId)}
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
              onExitComplete={() => handleDeleteExitComplete(resume.documentId)}
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
    </div>
  );
}

export default Dashboard;

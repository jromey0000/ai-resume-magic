import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSyncResumeUsage } from '@/lib/hooks/useSyncResumeUsage';
import DashboardSidebar from './DashboardSidebar';
import UpgradeModal from './UpgradeModal';

const FOCUSED_FLOW_PATHS = ['/dashboard/new', '/dashboard/resume/guest/edit'];

export default function DashboardLayout() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const location = useLocation();
  useSyncResumeUsage();

  const isFocusedFlow = FOCUSED_FLOW_PATHS.some((path) => location.pathname.startsWith(path));

  if (isFocusedFlow) {
    return <Outlet />;
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <DashboardSidebar onUpgradeClick={() => setShowUpgrade(true)} />

      <main className="flex-1 overflow-y-auto bg-cod-gray-50 dark:bg-cod-gray-950">
        <Outlet />
      </main>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

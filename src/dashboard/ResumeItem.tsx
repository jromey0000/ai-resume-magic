import { Link } from 'react-router-dom';
import { Resume } from '@/types';
import { BookText } from 'lucide-react';

interface ResumeItemProps {
  resume: Resume;
}

function ResumeItem({ resume }: ResumeItemProps) {
  return (
    <Link to={`/dashboard/resume/${resume.resumeId}/edit`}>
      <div className="p-14 bg-cod-gray-200 dark:bg-cod-gray-300 flex items-center justify-center h-[280px] border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md hover:cursor-pointer">
        <BookText className="stroke-cod-gray-900" />
      </div>
      <h2 className="text-center my-1 dark:text-white text-cod-gray-900">
        {resume.title}
      </h2>
    </Link>
  );
}

export default ResumeItem;

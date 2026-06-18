import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useTier } from '@/lib/contexts/TierContext';

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

const stats: StatCard[] = [
  { label: 'Total Resumes', value: '24', change: 12, icon: FileText, trend: 'up' },
  { label: 'AI Optimizations', value: '156', change: 23, icon: Zap, trend: 'up' },
  { label: 'Avg. ATS Score', value: '87%', change: 5, icon: Target, trend: 'up' },
  { label: 'Team Activity', value: '89%', change: -2, icon: Users, trend: 'down' },
];

interface ActivityItem {
  user: string;
  action: string;
  target: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  { user: 'Sarah M.', action: 'created', target: 'Software Engineer Resume', time: '2 hours ago' },
  { user: 'John D.', action: 'optimized', target: 'Product Manager Resume', time: '4 hours ago' },
  { user: 'Emily R.', action: 'exported', target: 'UX Designer Resume', time: '5 hours ago' },
  { user: 'Michael K.', action: 'created', target: 'Data Analyst Resume', time: '1 day ago' },
  { user: 'Sarah M.', action: 'optimized', target: 'Software Engineer Resume', time: '1 day ago' },
];

interface WeeklyData {
  day: string;
  resumes: number;
  optimizations: number;
}

const weeklyData: WeeklyData[] = [
  { day: 'Mon', resumes: 3, optimizations: 12 },
  { day: 'Tue', resumes: 5, optimizations: 18 },
  { day: 'Wed', resumes: 2, optimizations: 8 },
  { day: 'Thu', resumes: 7, optimizations: 24 },
  { day: 'Fri', resumes: 4, optimizations: 15 },
  { day: 'Sat', resumes: 1, optimizations: 5 },
  { day: 'Sun', resumes: 2, optimizations: 7 },
];

function StatCardComponent({ stat }: { stat: StatCard }) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
        </div>
        <div
          className={`
          flex items-center gap-1 text-sm font-medium
          ${stat.trend === 'up' ? 'text-teal-600 dark:text-teal-400' : 'text-coral-rose-600 dark:text-coral-rose-400'}
        `}
        >
          <TrendIcon className="w-4 h-4" />
          {Math.abs(stat.change)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-cod-gray-900 dark:text-white mb-1">{stat.value}</div>
      <div className="text-sm text-cod-gray-500 dark:text-cod-gray-400">{stat.label}</div>
    </div>
  );
}

function SimpleBarChart({ data }: { data: WeeklyData[] }) {
  const maxOptimizations = Math.max(...data.map((d) => d.optimizations));

  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {data.map((item) => (
        <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
            <div
              className="w-full max-w-8 bg-fuchsia-pink-500 rounded-t-md transition-all hover:bg-fuchsia-pink-600"
              style={{ height: `${(item.optimizations / maxOptimizations) * 100}%` }}
              title={`${item.optimizations} optimizations`}
            />
          </div>
          <span className="text-xs text-cod-gray-500 dark:text-cod-gray-400">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { tier } = useTier();

  if (tier.name !== 'enterprise') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <BarChart3 className="w-16 h-16 text-cod-gray-300 dark:text-cod-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-cod-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h3>
        <p className="text-cod-gray-500 dark:text-cod-gray-400 max-w-md">
          Upgrade to Enterprise to access detailed analytics about your team's resume performance
          and activity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cod-gray-900 dark:text-white">Analytics</h2>
          <p className="text-cod-gray-500 dark:text-cod-gray-400">Track your team's performance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cod-gray-100 dark:bg-cod-gray-800 border border-cod-gray-200 dark:border-cod-gray-700">
          <Calendar className="w-4 h-4 text-cod-gray-500" />
          <span className="text-sm text-cod-gray-700 dark:text-cod-gray-300">Last 7 days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCardComponent key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-cod-gray-900 dark:text-white">Weekly Activity</h3>
              <p className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
                AI optimizations per day
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">+18%</span>
            </div>
          </div>
          <SimpleBarChart data={weeklyData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-cod-gray-900 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
                Your team's latest actions
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.user}-${activity.target}-${activity.time}`}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 flex items-center justify-center">
                  <span className="text-xs font-semibold text-fuchsia-pink-600 dark:text-fuchsia-pink-400">
                    {activity.user
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cod-gray-900 dark:text-white truncate">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="text-cod-gray-500 dark:text-cod-gray-400">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-cod-gray-400 dark:text-cod-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white dark:bg-cod-gray-900 rounded-xl border border-cod-gray-200 dark:border-cod-gray-800 p-6">
        <h3 className="font-semibold text-cod-gray-900 dark:text-white mb-4">
          Top Performing Resumes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cod-gray-200 dark:border-cod-gray-700">
                <th className="text-left py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Resume
                </th>
                <th className="text-left py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Owner
                </th>
                <th className="text-center py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  ATS Score
                </th>
                <th className="text-center py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Optimizations
                </th>
                <th className="text-right py-3 text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title: 'Senior Software Engineer',
                  owner: 'Sarah M.',
                  score: 94,
                  optimizations: 8,
                  updated: '2h ago',
                },
                {
                  title: 'Product Manager',
                  owner: 'John D.',
                  score: 91,
                  optimizations: 6,
                  updated: '4h ago',
                },
                {
                  title: 'UX Designer',
                  owner: 'Emily R.',
                  score: 89,
                  optimizations: 5,
                  updated: '1d ago',
                },
                {
                  title: 'Data Scientist',
                  owner: 'Michael K.',
                  score: 87,
                  optimizations: 4,
                  updated: '2d ago',
                },
              ].map((resume) => (
                <tr
                  key={resume.title}
                  className="border-b border-cod-gray-100 dark:border-cod-gray-800 last:border-0"
                >
                  <td className="py-3">
                    <span className="font-medium text-cod-gray-900 dark:text-white">
                      {resume.title}
                    </span>
                  </td>
                  <td className="py-3 text-cod-gray-600 dark:text-cod-gray-400">{resume.owner}</td>
                  <td className="py-3 text-center">
                    <span
                      className={`
                      px-2 py-1 rounded-full text-sm font-medium
                      ${
                        resume.score >= 90
                          ? 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300'
                          : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      }
                    `}
                    >
                      {resume.score}%
                    </span>
                  </td>
                  <td className="py-3 text-center text-cod-gray-600 dark:text-cod-gray-400">
                    {resume.optimizations}
                  </td>
                  <td className="py-3 text-right text-cod-gray-500 dark:text-cod-gray-400">
                    {resume.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
